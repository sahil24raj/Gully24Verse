import * as THREE from 'three';
import { TRACK_WIDTH, MULTIPLIER_ZONES } from './constants';
import { MultiplierZone, LevelConfig } from './types';

export class JellyTrackManager {
  private scene: THREE.Scene;
  private trackGroup: THREE.Group = new THREE.Group();
  private oceanMesh: THREE.Mesh | null = null;
  public multiplierZones: MultiplierZone[] = [];
  public finishZ: number = 100;
  public endOfRunwayZ: number = 250;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.scene.add(this.trackGroup);
  }

  public buildTrack(config: LevelConfig) {
    // Clear existing
    while (this.trackGroup.children.length > 0) {
      const obj = this.trackGroup.children[0];
      this.trackGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }

    this.finishZ = config.trackLength;
    this.multiplierZones = [];

    // 1. Main Running Track Geometry
    const mainTrackGeo = new THREE.BoxGeometry(TRACK_WIDTH, 0.4, this.finishZ);
    const mainTrackMat = new THREE.MeshStandardMaterial({
      color: config.theme.trackColor,
      roughness: 0.25,
      metalness: 0.15
    });

    const mainTrackMesh = new THREE.Mesh(mainTrackGeo, mainTrackMat);
    mainTrackMesh.position.set(0, -0.2, this.finishZ / 2);
    mainTrackMesh.receiveShadow = true;
    this.trackGroup.add(mainTrackMesh);

    // 2. Glowing Side Rails
    const railGeo = new THREE.BoxGeometry(0.3, 0.5, this.finishZ);
    const railMat = new THREE.MeshStandardMaterial({
      color: config.theme.railColor,
      roughness: 0.2,
      emissive: new THREE.Color(config.theme.railColor),
      emissiveIntensity: 0.35
    });

    const leftRail = new THREE.Mesh(railGeo, railMat);
    leftRail.position.set(-TRACK_WIDTH / 2 - 0.15, 0.15, this.finishZ / 2);
    this.trackGroup.add(leftRail);

    const rightRail = new THREE.Mesh(railGeo, railMat);
    rightRail.position.set(TRACK_WIDTH / 2 + 0.15, 0.15, this.finishZ / 2);
    this.trackGroup.add(rightRail);

    // 3. Center Guide Line (dashed)
    const lineCount = Math.floor(this.finishZ / 6);
    const dashGeo = new THREE.PlaneGeometry(0.16, 2.5);
    const dashMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55
    });

    for (let i = 0; i < lineCount; i++) {
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.01, i * 6 + 3);
      this.trackGroup.add(dash);
    }

    // 4. Track Support Pylons (into the ocean)
    const pylonGeo = new THREE.CylinderGeometry(0.35, 0.45, 12, 12);
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      roughness: 0.8
    });

    for (let z = 10; z < this.finishZ; z += 18) {
      const pylonL = new THREE.Mesh(pylonGeo, pylonMat);
      pylonL.position.set(-TRACK_WIDTH / 2, -6, z);
      this.trackGroup.add(pylonL);

      const pylonR = new THREE.Mesh(pylonGeo, pylonMat);
      pylonR.position.set(TRACK_WIDTH / 2, -6, z);
      this.trackGroup.add(pylonR);
    }

    // 5. Finish Gate Arch
    this.buildFinishArch(this.finishZ);

    // 6. Multiplier Runway after finish line!
    let currentZ = this.finishZ;
    MULTIPLIER_ZONES.forEach((zone) => {
      const zoneGeo = new THREE.BoxGeometry(TRACK_WIDTH * 1.1, 0.4, zone.length);
      const zoneMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(zone.color),
        roughness: 0.2,
        emissive: new THREE.Color(zone.color),
        emissiveIntensity: 0.25
      });

      const zoneMesh = new THREE.Mesh(zoneGeo, zoneMat);
      zoneMesh.position.set(0, -0.2, currentZ + zone.length / 2);
      this.trackGroup.add(zoneMesh);

      // Gate banner on each multiplier threshold
      this.buildMultiplierGate(currentZ, zone.multiplier, zone.color);

      this.multiplierZones.push({
        multiplier: zone.multiplier,
        zStart: currentZ,
        zEnd: currentZ + zone.length,
        color: zone.color
      });

      currentZ += zone.length;
    });

    this.endOfRunwayZ = currentZ;

    // 7. Ambient Ocean Floor Plane
    if (!this.oceanMesh) {
      const oceanGeo = new THREE.PlaneGeometry(1200, 1200, 16, 16);
      const oceanMat = new THREE.MeshStandardMaterial({
        color: config.theme.waterColor,
        roughness: 0.1,
        metalness: 0.4
      });
      this.oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
      this.oceanMesh.rotation.x = -Math.PI / 2;
      this.oceanMesh.position.y = -6.5;
      this.scene.add(this.oceanMesh);
    }
  }

  private buildFinishArch(zPos: number) {
    const archGroup = new THREE.Group();
    archGroup.position.set(0, 0, zPos);

    // Pillars
    const postGeo = new THREE.CylinderGeometry(0.35, 0.35, 5, 16);
    const postMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8, roughness: 0.2 });

    const leftPost = new THREE.Mesh(postGeo, postMat);
    leftPost.position.set(-TRACK_WIDTH / 2 - 0.2, 2.5, 0);
    archGroup.add(leftPost);

    const rightPost = new THREE.Mesh(postGeo, postMat);
    rightPost.position.set(TRACK_WIDTH / 2 + 0.2, 2.5, 0);
    archGroup.add(rightPost);

    // Crossbar
    const barGeo = new THREE.BoxGeometry(TRACK_WIDTH + 1.2, 0.8, 0.6);
    const barMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    const crossBar = new THREE.Mesh(barGeo, barMat);
    crossBar.position.set(0, 4.6, 0);
    archGroup.add(crossBar);

    // Canvas banner with "FINISH"
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(0, 0, 512, 128);
      ctx.fillStyle = '#000000';
      ctx.font = '900 64px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🏁 FINISH 🏁', 256, 64);
    }

    const bannerTex = new THREE.CanvasTexture(canvas);
    const bannerGeo = new THREE.PlaneGeometry(TRACK_WIDTH + 0.8, 0.7);
    const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex });
    const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
    bannerMesh.position.set(0, 4.6, -0.32);
    bannerMesh.rotation.y = Math.PI;
    archGroup.add(bannerMesh);

    this.trackGroup.add(archGroup);
  }

  private buildMultiplierGate(zPos: number, multiplier: number, color: string) {
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, zPos);

    // Arch
    const archGeo = new THREE.BoxGeometry(TRACK_WIDTH, 0.35, 0.2);
    const archMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.4
    });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.set(0, 2.8, 0);
    gateGroup.add(arch);

    // Multiplier Text Label
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 256, 128);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 68px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`x${multiplier}`, 128, 64);
    }

    const tex = new THREE.CanvasTexture(canvas);
    const tagGeo = new THREE.PlaneGeometry(1.6, 0.8);
    const tagMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
    const tagMesh = new THREE.Mesh(tagGeo, tagMat);
    tagMesh.position.set(0, 2.8, 0.12);
    gateGroup.add(tagMesh);

    this.trackGroup.add(gateGroup);
  }

  public getMultiplierAtZ(z: number): number {
    const zone = this.multiplierZones.find((zn) => z >= zn.zStart && z < zn.zEnd);
    return zone ? zone.multiplier : (z >= this.endOfRunwayZ ? 50 : 1.0);
  }

  public destroy() {
    while (this.trackGroup.children.length > 0) {
      const obj = this.trackGroup.children[0];
      this.trackGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
      }
    }
    this.scene.remove(this.trackGroup);
    if (this.oceanMesh) {
      this.scene.remove(this.oceanMesh);
      this.oceanMesh.geometry.dispose();
      this.oceanMesh = null;
    }
  }
}
