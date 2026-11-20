import * as THREE from 'three';
import { ObstacleConfig } from './types';

export interface ActiveObstacle {
  config: ObstacleConfig;
  root: THREE.Group;
  movingParts: THREE.Object3D[];
  colliders: {
    type: 'SPHERE' | 'BOX' | 'CYLINDER';
    obj: THREE.Object3D;
    radius?: number;
    halfSize?: THREE.Vector3;
  }[];
  phase: number;
  tangent: THREE.Vector3;
  normal: THREE.Vector3;
  position: THREE.Vector3;
}

export class ObstacleManager {
  public scene: THREE.Group;
  public obstacles: ActiveObstacle[] = [];

  private dangerMat: THREE.MeshStandardMaterial;
  private metalMat: THREE.MeshStandardMaterial;
  private accentMat: THREE.MeshStandardMaterial;

  constructor() {
    this.scene = new THREE.Group();

    this.dangerMat = new THREE.MeshStandardMaterial({
      color: 0xEF4444,
      roughness: 0.3,
      metalness: 0.1
    });

    this.metalMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.25,
      metalness: 0.7
    });

    this.accentMat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      roughness: 0.35,
      metalness: 0.15
    });
  }

  public clear() {
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    this.obstacles = [];
  }

  public buildObstacle(
    config: ObstacleConfig,
    worldPos: THREE.Vector3,
    tangent: THREE.Vector3,
    normal: THREE.Vector3
  ) {
    const root = new THREE.Group();
    root.position.copy(worldPos);

    // Align root orientation with track tangent
    const quat = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const m = new THREE.Matrix4().makeBasis(normal, up, tangent);
    quat.setFromRotationMatrix(m);
    root.quaternion.copy(quat);

    const activeObs: ActiveObstacle = {
      config,
      root,
      movingParts: [],
      colliders: [],
      phase: config.phaseOffset || 0,
      tangent: tangent.clone(),
      normal: normal.clone(),
      position: worldPos.clone()
    };

    switch (config.type) {
      case 'SWEEPER':
        this.createSweeper(activeObs);
        break;
      case 'HAMMER':
        this.createHammer(activeObs);
        break;
      case 'PUSHER':
        this.createPusher(activeObs);
        break;
      case 'ROLLER':
        this.createRoller(activeObs);
        break;
      case 'GATE':
        this.createGate(activeObs);
        break;
    }

    this.scene.add(root);
    this.obstacles.push(activeObs);
  }

  // 1. ROTATING SWEEPER: 2 or 4 horizontal arms rotating across the track
  private createSweeper(obs: ActiveObstacle) {
    const { root, config } = obs;
    const armsCount = config.arms || 2;
    const armLength = config.width || 2.4;

    // Central Base Pillar
    const baseGeom = new THREE.CylinderGeometry(0.28, 0.36, 1.2, 16);
    const base = new THREE.Mesh(baseGeom, this.metalMat);
    base.position.y = 0.6;
    base.castShadow = true;
    root.add(base);

    // Rotating Spindle Hub
    const hubGroup = new THREE.Group();
    hubGroup.position.y = 0.55;
    root.add(hubGroup);
    obs.movingParts.push(hubGroup);

    const capGeom = new THREE.CylinderGeometry(0.32, 0.32, 0.35, 16);
    const cap = new THREE.Mesh(capGeom, this.accentMat);
    hubGroup.add(cap);

    // Spoke Arms
    for (let i = 0; i < armsCount; i++) {
      const armAngle = (i * Math.PI * 2) / armsCount;
      const armGroup = new THREE.Group();
      armGroup.rotation.y = armAngle;
      hubGroup.add(armGroup);

      // Arm Bar
      const barGeom = new THREE.BoxGeometry(armLength, 0.22, 0.22);
      const bar = new THREE.Mesh(barGeom, this.dangerMat);
      bar.position.x = armLength * 0.5;
      bar.castShadow = true;
      armGroup.add(bar);

      // Padded Arm Tip
      const tipGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.28, 16);
      const tip = new THREE.Mesh(tipGeom, this.accentMat);
      tip.position.x = armLength;
      tip.rotation.z = Math.PI / 2;
      armGroup.add(tip);

      // Add collider reference
      obs.colliders.push({
        type: 'BOX',
        obj: bar,
        halfSize: new THREE.Vector3(armLength * 0.5, 0.16, 0.16)
      });
    }
  }

  // 2. SWINGING HAMMER: Overhead arch with pendulum swinging left & right
  private createHammer(obs: ActiveObstacle) {
    const { root } = obs;
    const archHeight = 4.2;
    const archWidth = 3.2;

    // Left and Right Arch Pillars
    const legGeom = new THREE.CylinderGeometry(0.14, 0.18, archHeight, 12);
    const leftLeg = new THREE.Mesh(legGeom, this.metalMat);
    leftLeg.position.set(-archWidth * 0.5, archHeight * 0.5, 0);
    leftLeg.castShadow = true;
    root.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, this.metalMat);
    rightLeg.position.set(archWidth * 0.5, archHeight * 0.5, 0);
    rightLeg.castShadow = true;
    root.add(rightLeg);

    // Overhead Beam
    const beamGeom = new THREE.CylinderGeometry(0.15, 0.15, archWidth + 0.4, 12);
    const beam = new THREE.Mesh(beamGeom, this.metalMat);
    beam.position.y = archHeight;
    beam.rotation.z = Math.PI / 2;
    root.add(beam);

    // Pendulum Pivot (located at top beam)
    const pivot = new THREE.Group();
    pivot.position.set(0, archHeight, 0);
    root.add(pivot);
    obs.movingParts.push(pivot);

    // Pendulum Rod
    const rodLength = 3.1;
    const rodGeom = new THREE.CylinderGeometry(0.08, 0.08, rodLength, 12);
    const rod = new THREE.Mesh(rodGeom, this.metalMat);
    rod.position.y = -rodLength * 0.5;
    pivot.add(rod);

    // Massive Hammer Head (Cylinder spanning across Z)
    const hammerGeom = new THREE.CylinderGeometry(0.42, 0.42, 0.9, 16);
    const hammer = new THREE.Mesh(hammerGeom, this.dangerMat);
    hammer.position.y = -rodLength;
    hammer.rotation.x = Math.PI / 2; // Aligned with track forward
    hammer.castShadow = true;
    pivot.add(hammer);

    // Chrome face plates on hammer ends
    const endGeom = new THREE.CylinderGeometry(0.44, 0.44, 0.1, 16);
    const end1 = new THREE.Mesh(endGeom, this.accentMat);
    end1.position.y = 0.45;
    hammer.add(end1);

    const end2 = new THREE.Mesh(endGeom, this.accentMat);
    end2.position.y = -0.45;
    hammer.add(end2);

    obs.colliders.push({
      type: 'CYLINDER',
      obj: hammer,
      radius: 0.55
    });
  }

  // 3. PNEUMATIC PUSHER: Piston extending and retracting from track side
  private createPusher(obs: ActiveObstacle) {
    const { root, config } = obs;
    const side = config.reverse ? -1 : 1;
    const stroke = config.amplitude || 2.2;

    // Housing Base on track border
    const houseGeom = new THREE.BoxGeometry(0.8, 1.2, 1.0);
    const house = new THREE.Mesh(houseGeom, this.metalMat);
    house.position.set(side * 1.8, 0.6, 0);
    house.castShadow = true;
    root.add(house);

    // Piston Arm & Pusher Plate
    const pistonGroup = new THREE.Group();
    pistonGroup.position.set(side * 1.5, 0.6, 0);
    root.add(pistonGroup);
    obs.movingParts.push(pistonGroup);

    // Piston Rod
    const rodGeom = new THREE.CylinderGeometry(0.12, 0.12, stroke, 12);
    const rod = new THREE.Mesh(rodGeom, this.metalMat);
    rod.rotation.z = Math.PI / 2;
    rod.position.x = -side * stroke * 0.5;
    pistonGroup.add(rod);

    // Piston Impact Bumper
    const bumperGeom = new THREE.BoxGeometry(0.25, 0.85, 0.85);
    const bumper = new THREE.Mesh(bumperGeom, this.dangerMat);
    bumper.position.x = -side * stroke;
    bumper.castShadow = true;
    pistonGroup.add(bumper);

    obs.colliders.push({
      type: 'BOX',
      obj: bumper,
      halfSize: new THREE.Vector3(0.18, 0.45, 0.45)
    });
  }

  // 4. SPINNING ROLLER: Rotating drum on track level
  private createRoller(obs: ActiveObstacle) {
    const { root, config } = obs;
    const rollerLength = config.width || 2.4;
    const radius = 0.45;

    // Side Mount Brackets
    const mountGeom = new THREE.BoxGeometry(0.2, 0.8, 0.6);
    const leftMount = new THREE.Mesh(mountGeom, this.metalMat);
    leftMount.position.set(-rollerLength * 0.5 - 0.15, 0.4, 0);
    root.add(leftMount);

    const rightMount = new THREE.Mesh(mountGeom, this.metalMat);
    rightMount.position.set(rollerLength * 0.5 + 0.15, 0.4, 0);
    root.add(rightMount);

    // Rotating Drum
    const drumGroup = new THREE.Group();
    drumGroup.position.y = 0.45;
    root.add(drumGroup);
    obs.movingParts.push(drumGroup);

    const drumGeom = new THREE.CylinderGeometry(radius, radius, rollerLength, 16);
    const drum = new THREE.Mesh(drumGeom, this.dangerMat);
    drum.rotation.z = Math.PI / 2;
    drum.castShadow = true;
    drumGroup.add(drum);

    // Longitudinal Bump Fins
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const finGeom = new THREE.BoxGeometry(rollerLength * 0.95, 0.1, 0.1);
      const fin = new THREE.Mesh(finGeom, this.accentMat);
      fin.position.set(0, Math.cos(angle) * radius, Math.sin(angle) * radius);
      drumGroup.add(fin);
    }

    obs.colliders.push({
      type: 'CYLINDER',
      obj: drum,
      radius: radius + 0.1
    });
  }

  // 5. ROTATING REVOLVING GATE
  private createGate(obs: ActiveObstacle) {
    const { root } = obs;
    const spindleGeom = new THREE.CylinderGeometry(0.18, 0.22, 2.0, 16);
    const spindle = new THREE.Mesh(spindleGeom, this.metalMat);
    spindle.position.y = 1.0;
    root.add(spindle);

    const gateGroup = new THREE.Group();
    gateGroup.position.y = 1.0;
    root.add(gateGroup);
    obs.movingParts.push(gateGroup);

    // 2 opposing gate wings
    for (let i = 0; i < 2; i++) {
      const wingAngle = i * Math.PI;
      const wing = new THREE.Group();
      wing.rotation.y = wingAngle;
      gateGroup.add(wing);

      const panelGeom = new THREE.BoxGeometry(1.2, 0.9, 0.12);
      const panel = new THREE.Mesh(panelGeom, this.dangerMat);
      panel.position.x = 0.65;
      panel.castShadow = true;
      wing.add(panel);

      obs.colliders.push({
        type: 'BOX',
        obj: panel,
        halfSize: new THREE.Vector3(0.65, 0.5, 0.15)
      });
    }
  }

  public update(dt: number) {
    for (const obs of this.obstacles) {
      obs.phase += dt * obs.config.speed;
      const phase = obs.phase;
      const moving = obs.movingParts[0];
      if (!moving) continue;

      switch (obs.config.type) {
        case 'SWEEPER':
          moving.rotation.y = obs.config.reverse ? -phase : phase;
          break;

        case 'HAMMER':
          // Sinusoidal swing across X axis (Z rotation in local frame)
          const maxAngle = obs.config.amplitude || 1.15; // ~65 degrees
          moving.rotation.z = Math.sin(phase) * maxAngle;
          break;

        case 'PUSHER':
          // Piston punching motion with smooth ease in/out
          const maxStroke = obs.config.amplitude || 1.8;
          const punch = Math.max(0, Math.sin(phase));
          const side = obs.config.reverse ? -1 : 1;
          moving.position.x = side * (1.5 - punch * maxStroke);
          break;

        case 'ROLLER':
          moving.rotation.x = obs.config.reverse ? -phase * 2.0 : phase * 2.0;
          break;

        case 'GATE':
          moving.rotation.y = obs.config.reverse ? -phase : phase;
          break;
      }
    }
  }

  /**
   * Collision check against character position.
   * Returns impact impulse vector if hit, or null.
   */
  public checkCharacterCollision(
    characterPos: THREE.Vector3,
    characterRadius: number = 0.38,
    characterHeight: number = 1.5
  ): { hit: boolean; impulse: THREE.Vector3 } | null {
    const charCenter = characterPos.clone();
    charCenter.y += characterHeight * 0.5;

    const colliderWorldPos = new THREE.Vector3();

    for (const obs of this.obstacles) {
      // Broad-phase distance check: only test if within 5m of obstacle anchor
      if (charCenter.distanceTo(obs.position) > 5.5) continue;

      for (const col of obs.colliders) {
        col.obj.getWorldPosition(colliderWorldPos);

        if (col.type === 'SPHERE' || col.type === 'CYLINDER') {
          const r = col.radius || 0.5;
          const dist = charCenter.distanceTo(colliderWorldPos);
          if (dist < characterRadius + r) {
            // Impact vector: away from collider center + upward pop
            const dir = charCenter.clone().sub(colliderWorldPos).normalize();
            dir.y = Math.max(0.4, dir.y);
            return {
              hit: true,
              impulse: dir.multiplyScalar(9.5)
            };
          }
        } else if (col.type === 'BOX') {
          // Bounding box test in local collider space
          const boxInv = col.obj.matrixWorld.clone().invert();
          const localCharPos = charCenter.clone().applyMatrix4(boxInv);
          const hs = col.halfSize || new THREE.Vector3(0.5, 0.5, 0.5);

          const dx = Math.abs(localCharPos.x) - (hs.x + characterRadius);
          const dy = Math.abs(localCharPos.y) - (hs.y + characterHeight * 0.4);
          const dz = Math.abs(localCharPos.z) - (hs.z + characterRadius);

          if (dx < 0 && dy < 0 && dz < 0) {
            // Hit! Generate impulse in world space
            const worldDir = charCenter.clone().sub(colliderWorldPos).normalize();
            worldDir.y = 0.6;
            worldDir.normalize();
            return {
              hit: true,
              impulse: worldDir.multiplyScalar(9.0)
            };
          }
        }
      }
    }

    return null;
  }
}
