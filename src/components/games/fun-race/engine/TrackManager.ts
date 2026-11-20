import * as THREE from 'three';
import { LevelConfig, Vector3D } from './types';

export interface TrackSample {
  s: number; // Arc-length distance
  position: THREE.Vector3;
  tangent: THREE.Vector3;
  normal: THREE.Vector3;
}

export class TrackManager {
  public scene: THREE.Group;
  public curve: THREE.CatmullRomCurve3 | null = null;
  public totalLength: number = 0;
  public samples: TrackSample[] = [];
  public checkpointSamples: { index: number; sample: TrackSample }[] = [];

  private trackMaterial: THREE.MeshStandardMaterial;
  private curbMaterial: THREE.MeshStandardMaterial;
  private pillarMaterial: THREE.MeshStandardMaterial;
  private checkpointMat: THREE.MeshStandardMaterial;
  private finishMat: THREE.MeshStandardMaterial;

  constructor() {
    this.scene = new THREE.Group();

    this.trackMaterial = new THREE.MeshStandardMaterial({
      color: 0x00F0FF,
      roughness: 0.45,
      metalness: 0.05
    });

    this.curbMaterial = new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      roughness: 0.5,
      metalness: 0.2
    });

    this.pillarMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.7,
      metalness: 0.1
    });

    this.checkpointMat = new THREE.MeshStandardMaterial({
      color: 0x10B981,
      emissive: 0x059669,
      emissiveIntensity: 0.4,
      roughness: 0.3
    });

    this.finishMat = new THREE.MeshStandardMaterial({
      color: 0xFACC15,
      emissive: 0xEAB308,
      emissiveIntensity: 0.3,
      roughness: 0.2
    });
  }

  public clear() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    this.curve = null;
    this.samples = [];
    this.checkpointSamples = [];
    this.totalLength = 0;
  }

  public buildLevel(config: LevelConfig) {
    this.clear();

    // 1. Create Spline Curve from waypoints
    const points = config.waypoints.map((p) => new THREE.Vector3(p.x, p.y, p.z));
    this.curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.2);
    this.totalLength = this.curve.getLength();

    // 2. Pre-sample spline evenly along arc-length
    const sampleCount = Math.max(120, Math.floor(this.totalLength * 3));
    this.samples = [];

    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i <= sampleCount; i++) {
      const u = i / sampleCount;
      const s = u * this.totalLength;
      const position = this.curve.getPointAt(u);
      const tangent = this.curve.getTangentAt(u).normalize();
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();
      this.samples.push({ s, position, tangent, normal });
    }

    // Update track color per level
    this.trackMaterial.color.set(config.trackColor || '#00F0FF');

    // 3. Build Extruded 3D Track Geometry
    this.buildTrackRibbon(config.trackWidth);

    // 4. Build Support Pillars into water
    this.buildSupportPillars(config.trackWidth);

    // 5. Build Checkpoints & Finish Arch
    this.buildCheckpointsAndFinish(config.checkpoints);
  }

  private buildTrackRibbon(width: number) {
    if (!this.curve || this.samples.length < 2) return;

    const halfW = width * 0.5;
    const curbW = 0.18;
    const curbH = 0.15;
    const segs = this.samples.length;

    // Build ribbon vertices for main track deck
    const deckPositions: number[] = [];
    const deckNormals: number[] = [];
    const deckIndices: number[] = [];

    const curbPositions: number[] = [];
    const curbNormals: number[] = [];
    const curbIndices: number[] = [];

    for (let i = 0; i < segs; i++) {
      const sample = this.samples[i];
      const p = sample.position;
      const n = sample.normal;

      // Left edge, Center, Right edge
      const pL = p.clone().addScaledVector(n, -halfW);
      const pR = p.clone().addScaledVector(n, halfW);

      // Deck surface (flat top facing up)
      deckPositions.push(pL.x, pL.y, pL.z);
      deckPositions.push(pR.x, pR.y, pR.z);
      deckNormals.push(0, 1, 0, 0, 1, 0);

      // Left curb top
      const pCurbL = pL.clone().addScaledVector(n, -curbW);
      pCurbL.y += curbH;
      const pCurbR = pR.clone().addScaledVector(n, curbW);
      pCurbR.y += curbH;

      curbPositions.push(pCurbL.x, pCurbL.y, pCurbL.z);
      curbPositions.push(pL.x, pL.y + curbH, pL.z);
      curbPositions.push(pR.x, pR.y + curbH, pR.z);
      curbPositions.push(pCurbR.x, pCurbR.y, pCurbR.z);

      curbNormals.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);

      if (i > 0) {
        // Deck quad
        const base = (i - 1) * 2;
        deckIndices.push(base, base + 1, base + 2);
        deckIndices.push(base + 1, base + 3, base + 2);

        // Curbs
        const cBase = (i - 1) * 4;
        curbIndices.push(cBase, cBase + 1, cBase + 4);
        curbIndices.push(cBase + 1, cBase + 5, cBase + 4);

        curbIndices.push(cBase + 2, cBase + 3, cBase + 6);
        curbIndices.push(cBase + 3, cBase + 7, cBase + 6);
      }
    }

    const deckGeom = new THREE.BufferGeometry();
    deckGeom.setAttribute('position', new THREE.Float32BufferAttribute(deckPositions, 3));
    deckGeom.setAttribute('normal', new THREE.Float32BufferAttribute(deckNormals, 3));
    deckGeom.setIndex(deckIndices);
    const deckMesh = new THREE.Mesh(deckGeom, this.trackMaterial);
    deckMesh.receiveShadow = true;
    this.scene.add(deckMesh);

    const curbGeom = new THREE.BufferGeometry();
    curbGeom.setAttribute('position', new THREE.Float32BufferAttribute(curbPositions, 3));
    curbGeom.setAttribute('normal', new THREE.Float32BufferAttribute(curbNormals, 3));
    curbGeom.setIndex(curbIndices);
    const curbMesh = new THREE.Mesh(curbGeom, this.curbMaterial);
    curbMesh.castShadow = true;
    curbMesh.receiveShadow = true;
    this.scene.add(curbMesh);
  }

  private buildSupportPillars(width: number) {
    const pillarSpacing = 8.0; // Place pillar every 8 meters
    const pillarGeom = new THREE.CylinderGeometry(0.3, 0.45, 6.0, 12);

    for (let s = 4.0; s < this.totalLength - 2.0; s += pillarSpacing) {
      const sample = this.sampleAtDistance(s);
      const pillar = new THREE.Mesh(pillarGeom, this.pillarMaterial);
      pillar.position.set(sample.position.x, sample.position.y - 3.0, sample.position.z);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      this.scene.add(pillar);
    }
  }

  private buildCheckpointsAndFinish(checkpointsS: number[]) {
    // Checkpoint Arches
    this.checkpointSamples = [];
    checkpointsS.forEach((s, idx) => {
      const sample = this.sampleAtDistance(s);
      this.checkpointSamples.push({ index: idx + 1, sample });

      const archGroup = new THREE.Group();
      archGroup.position.copy(sample.position);

      const quat = new THREE.Quaternion();
      const up = new THREE.Vector3(0, 1, 0);
      const m = new THREE.Matrix4().makeBasis(sample.normal, up, sample.tangent);
      quat.setFromRotationMatrix(m);
      archGroup.quaternion.copy(quat);

      // Arch Posts
      const postGeom = new THREE.CylinderGeometry(0.12, 0.14, 2.6, 12);
      const leftPost = new THREE.Mesh(postGeom, this.checkpointMat);
      leftPost.position.set(-1.4, 1.3, 0);
      archGroup.add(leftPost);

      const rightPost = new THREE.Mesh(postGeom, this.checkpointMat);
      rightPost.position.set(1.4, 1.3, 0);
      archGroup.add(rightPost);

      const topGeom = new THREE.CylinderGeometry(0.12, 0.12, 3.0, 12);
      const topBar = new THREE.Mesh(topGeom, this.checkpointMat);
      topBar.position.set(0, 2.6, 0);
      topBar.rotation.z = Math.PI / 2;
      archGroup.add(topBar);

      // Glowing orb badge
      const orbGeom = new THREE.SphereGeometry(0.24, 16, 16);
      const orb = new THREE.Mesh(orbGeom, this.checkpointMat);
      orb.position.set(0, 2.9, 0);
      archGroup.add(orb);

      this.scene.add(archGroup);
    });

    // Finish Line Arch (at end of track)
    const finishSample = this.sampleAtDistance(this.totalLength - 1.0);
    const finishGroup = new THREE.Group();
    finishGroup.position.copy(finishSample.position);

    const quat = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const m = new THREE.Matrix4().makeBasis(finishSample.normal, up, finishSample.tangent);
    quat.setFromRotationMatrix(m);
    finishGroup.quaternion.copy(quat);

    // Golden Pillars
    const postGeom = new THREE.CylinderGeometry(0.2, 0.25, 3.8, 16);
    const leftPost = new THREE.Mesh(postGeom, this.finishMat);
    leftPost.position.set(-1.7, 1.9, 0);
    finishGroup.add(leftPost);

    const rightPost = new THREE.Mesh(postGeom, this.finishMat);
    rightPost.position.set(1.7, 1.9, 0);
    finishGroup.add(rightPost);

    // Banner board
    const bannerGeom = new THREE.BoxGeometry(3.6, 0.8, 0.2);
    const bannerMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.3
    });
    const banner = new THREE.Mesh(bannerGeom, bannerMat);
    banner.position.set(0, 3.6, 0);
    finishGroup.add(banner);

    // Checkered Stripe
    const stripeGeom = new THREE.BoxGeometry(3.6, 0.2, 0.22);
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xFACC15,
      roughness: 0.2,
      emissive: 0xEAB308,
      emissiveIntensity: 0.5
    });
    const stripe = new THREE.Mesh(stripeGeom, stripeMat);
    stripe.position.set(0, 3.6, 0);
    finishGroup.add(stripe);

    // Ground Checkered Finish Line Strip on Track
    const lineGeom = new THREE.PlaneGeometry(2.6, 1.2);
    const lineMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.5
    });
    const lineMesh = new THREE.Mesh(lineGeom, lineMat);
    lineMesh.rotation.x = -Math.PI / 2;
    lineMesh.position.set(0, 0.02, 0);
    finishGroup.add(lineMesh);

    this.scene.add(finishGroup);
  }

  public sampleAtDistance(s: number): TrackSample {
    if (this.samples.length === 0) {
      return {
        s: 0,
        position: new THREE.Vector3(),
        tangent: new THREE.Vector3(0, 0, 1),
        normal: new THREE.Vector3(1, 0, 0)
      };
    }

    const clampedS = Math.max(0, Math.min(this.totalLength, s));
    const u = clampedS / (this.totalLength || 1.0);

    // Binary search or direct index interpolation
    const idxFloat = u * (this.samples.length - 1);
    const idxLow = Math.floor(idxFloat);
    const idxHigh = Math.min(this.samples.length - 1, idxLow + 1);
    const frac = idxFloat - idxLow;

    const s0 = this.samples[idxLow];
    const s1 = this.samples[idxHigh];

    return {
      s: clampedS,
      position: new THREE.Vector3().lerpVectors(s0.position, s1.position, frac),
      tangent: new THREE.Vector3().lerpVectors(s0.tangent, s1.tangent, frac).normalize(),
      normal: new THREE.Vector3().lerpVectors(s0.normal, s1.normal, frac).normalize()
    };
  }
}
