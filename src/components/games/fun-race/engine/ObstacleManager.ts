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
    isCrusher?: boolean;
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
  private hazardStripeMat: THREE.MeshStandardMaterial;

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

    this.hazardStripeMat = new THREE.MeshStandardMaterial({
      color: 0xFBBF24,
      roughness: 0.4,
      metalness: 0.2
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
        // Re-engineered as Iconic Hydraulic Overhead Crusher Stamp
        this.createCrusher(activeObs);
        break;
      case 'GATE':
        this.createGate(activeObs);
        break;
    }

    this.scene.add(root);
    this.obstacles.push(activeObs);
  }

  // 1. ROTATING SWEEPER: Suspended from overhead arch (Ground is 100% CLEAR)
  private createSweeper(obs: ActiveObstacle) {
    const { root, config } = obs;
    // 1 or 2 arms for fair, fun Fun Race 3D gameplay
    const armsCount = Math.min(2, config.arms || 2);
    const armLength = config.width || 2.4;
    const archHeight = 3.8;
    const archWidth = 3.4;

    // Left and Right Arch Pillars (well outside track deck)
    const legGeom = new THREE.CylinderGeometry(0.14, 0.18, archHeight, 14);
    const leftLeg = new THREE.Mesh(legGeom, this.metalMat);
    leftLeg.position.set(-archWidth * 0.5, archHeight * 0.5, 0);
    leftLeg.castShadow = true;
    root.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, this.metalMat);
    rightLeg.position.set(archWidth * 0.5, archHeight * 0.5, 0);
    rightLeg.castShadow = true;
    root.add(rightLeg);

    // Overhead Crossbeam
    const beamGeom = new THREE.CylinderGeometry(0.16, 0.16, archWidth + 0.4, 14);
    const beam = new THREE.Mesh(beamGeom, this.metalMat);
    beam.position.y = archHeight;
    beam.rotation.z = Math.PI / 2;
    beam.castShadow = true;
    root.add(beam);

    // Hazard Marker on Overhead Beam
    const markerGeom = new THREE.BoxGeometry(0.8, 0.22, 0.22);
    const marker = new THREE.Mesh(markerGeom, this.hazardStripeMat);
    marker.position.y = archHeight;
    root.add(marker);

    // Hanging Axle descending from overhead crossbeam
    const axleLength = 2.4;
    const axleGeom = new THREE.CylinderGeometry(0.1, 0.1, axleLength, 12);
    const axle = new THREE.Mesh(axleGeom, this.metalMat);
    axle.position.set(0, archHeight - axleLength * 0.5, 0);
    axle.castShadow = true;
    root.add(axle);

    // Rotating Spindle Hub at chest height (0.95m, ZERO ground pillar!)
    const hubGroup = new THREE.Group();
    hubGroup.position.y = 0.95;
    root.add(hubGroup);
    obs.movingParts.push(hubGroup);

    const capGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.35, 16);
    const cap = new THREE.Mesh(capGeom, this.accentMat);
    hubGroup.add(cap);

    // Horizontal Sweeper Spoke Arms
    for (let i = 0; i < armsCount; i++) {
      const armAngle = (i * Math.PI * 2) / armsCount;
      const armGroup = new THREE.Group();
      armGroup.rotation.y = armAngle;
      hubGroup.add(armGroup);

      // Arm Bar
      const barGeom = new THREE.BoxGeometry(armLength, 0.2, 0.2);
      const bar = new THREE.Mesh(barGeom, this.dangerMat);
      bar.position.x = armLength * 0.5;
      bar.castShadow = true;
      armGroup.add(bar);

      // Arm Tip Bumper
      const tipGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.24, 16);
      const tip = new THREE.Mesh(tipGeom, this.accentMat);
      tip.position.x = armLength;
      tip.rotation.z = Math.PI / 2;
      armGroup.add(tip);

      // Precise collider (fair hitbox)
      obs.colliders.push({
        type: 'BOX',
        obj: bar,
        halfSize: new THREE.Vector3(armLength * 0.48, 0.12, 0.12)
      });
    }
  }

  // 2. SWINGING HAMMER: Overhead arch with swinging pendulum
  private createHammer(obs: ActiveObstacle) {
    const { root } = obs;
    const archHeight = 4.2;
    const archWidth = 3.3;

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

    // Pendulum Pivot at top beam
    const pivot = new THREE.Group();
    pivot.position.set(0, archHeight, 0);
    root.add(pivot);
    obs.movingParts.push(pivot);

    // Pendulum Rod
    const rodLength = 3.0;
    const rodGeom = new THREE.CylinderGeometry(0.08, 0.08, rodLength, 12);
    const rod = new THREE.Mesh(rodGeom, this.metalMat);
    rod.position.y = -rodLength * 0.5;
    pivot.add(rod);

    // Hammer Head (Cylinder aligned along Z forward)
    const hammerGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.85, 16);
    const hammer = new THREE.Mesh(hammerGeom, this.dangerMat);
    hammer.position.y = -rodLength;
    hammer.rotation.x = Math.PI / 2;
    hammer.castShadow = true;
    pivot.add(hammer);

    // Chrome face plates
    const endGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.08, 16);
    const end1 = new THREE.Mesh(endGeom, this.accentMat);
    end1.position.y = 0.43;
    hammer.add(end1);

    const end2 = new THREE.Mesh(endGeom, this.accentMat);
    end2.position.y = -0.43;
    hammer.add(end2);

    obs.colliders.push({
      type: 'CYLINDER',
      obj: hammer,
      radius: 0.38
    });
  }

  // 3. PNEUMATIC PUSHER: Piston extending and retracting from track side
  private createPusher(obs: ActiveObstacle) {
    const { root, config } = obs;
    const side = config.reverse ? -1 : 1;
    const stroke = config.amplitude || 1.8;

    // Housing Base mounted outside curb
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
    const rodGeom = new THREE.CylinderGeometry(0.1, 0.1, stroke, 12);
    const rod = new THREE.Mesh(rodGeom, this.metalMat);
    rod.rotation.z = Math.PI / 2;
    rod.position.x = -side * stroke * 0.5;
    pistonGroup.add(rod);

    // Piston Bumper
    const bumperGeom = new THREE.BoxGeometry(0.24, 0.8, 0.8);
    const bumper = new THREE.Mesh(bumperGeom, this.dangerMat);
    bumper.position.x = -side * stroke;
    bumper.castShadow = true;
    pistonGroup.add(bumper);

    obs.colliders.push({
      type: 'BOX',
      obj: bumper,
      halfSize: new THREE.Vector3(0.14, 0.4, 0.4)
    });
  }

  // 4. HYDRAULIC OVERHEAD CRUSHER STAMP (Playable, Iconic Fun Race 3D Obstacle)
  // Replaces the impassable ground roller!
  // Slams down, then lifts UP to 2.6m so runners easily sprint underneath!
  private createCrusher(obs: ActiveObstacle) {
    const { root, config } = obs;
    const archHeight = 4.0;
    const archWidth = 3.3;
    const stampWidth = config.width || 2.4;

    // Left and Right Frame Columns
    const colGeom = new THREE.BoxGeometry(0.3, archHeight, 0.4);
    const leftCol = new THREE.Mesh(colGeom, this.metalMat);
    leftCol.position.set(-archWidth * 0.5, archHeight * 0.5, 0);
    leftCol.castShadow = true;
    root.add(leftCol);

    const rightCol = new THREE.Mesh(colGeom, this.metalMat);
    rightCol.position.set(archWidth * 0.5, archHeight * 0.5, 0);
    rightCol.castShadow = true;
    root.add(rightCol);

    // Top Beam
    const topBeamGeom = new THREE.BoxGeometry(archWidth + 0.4, 0.4, 0.5);
    const topBeam = new THREE.Mesh(topBeamGeom, this.metalMat);
    topBeam.position.y = archHeight;
    topBeam.castShadow = true;
    root.add(topBeam);

    // Warning light on top
    const lightGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 12);
    const light = new THREE.Mesh(lightGeom, this.hazardStripeMat);
    light.position.set(0, archHeight + 0.3, 0);
    root.add(light);

    // Moving Crusher Stamp Head (Piston)
    const crusherGroup = new THREE.Group();
    crusherGroup.position.y = 2.6; // Start elevated high
    root.add(crusherGroup);
    obs.movingParts.push(crusherGroup);

    // Twin Piston Shafts
    const shaftGeom = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 12);
    const leftShaft = new THREE.Mesh(shaftGeom, this.metalMat);
    leftShaft.position.set(-0.6, 1.1, 0);
    crusherGroup.add(leftShaft);

    const rightShaft = new THREE.Mesh(shaftGeom, this.metalMat);
    rightShaft.position.set(0.6, 1.1, 0);
    crusherGroup.add(rightShaft);

    // Massive Heavy Stamp Block
    const stampGeom = new THREE.BoxGeometry(stampWidth, 0.7, 0.75);
    const stamp = new THREE.Mesh(stampGeom, this.dangerMat);
    stamp.position.y = 0.35;
    stamp.castShadow = true;
    crusherGroup.add(stamp);

    // Bottom Steel Striker Plate
    const plateGeom = new THREE.BoxGeometry(stampWidth * 0.98, 0.12, 0.73);
    const plate = new THREE.Mesh(plateGeom, this.accentMat);
    plate.position.y = 0.04;
    crusherGroup.add(plate);

    // Collider attached to stamp
    obs.colliders.push({
      type: 'BOX',
      obj: stamp,
      halfSize: new THREE.Vector3(stampWidth * 0.48, 0.35, 0.36),
      isCrusher: true
    });
  }

  // 5. ROTATING REVOLVING GATE
  private createGate(obs: ActiveObstacle) {
    const { root } = obs;
    const archHeight = 3.8;
    const archWidth = 3.4;

    const legGeom = new THREE.CylinderGeometry(0.14, 0.18, archHeight, 14);
    const leftLeg = new THREE.Mesh(legGeom, this.metalMat);
    leftLeg.position.set(-archWidth * 0.5, archHeight * 0.5, 0);
    leftLeg.castShadow = true;
    root.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, this.metalMat);
    rightLeg.position.set(archWidth * 0.5, archHeight * 0.5, 0);
    rightLeg.castShadow = true;
    root.add(rightLeg);

    const beamGeom = new THREE.CylinderGeometry(0.16, 0.16, archWidth + 0.4, 14);
    const beam = new THREE.Mesh(beamGeom, this.metalMat);
    beam.position.y = archHeight;
    beam.rotation.z = Math.PI / 2;
    beam.castShadow = true;
    root.add(beam);

    const axleGeom = new THREE.CylinderGeometry(0.1, 0.1, 2.2, 12);
    const axle = new THREE.Mesh(axleGeom, this.metalMat);
    axle.position.set(0, 2.7, 0);
    root.add(axle);

    const gateGroup = new THREE.Group();
    gateGroup.position.y = 1.05;
    root.add(gateGroup);
    obs.movingParts.push(gateGroup);

    // 2 opposing wings
    for (let i = 0; i < 2; i++) {
      const wingAngle = i * Math.PI;
      const wing = new THREE.Group();
      wing.rotation.y = wingAngle;
      gateGroup.add(wing);

      const panelGeom = new THREE.BoxGeometry(1.2, 0.85, 0.12);
      const panel = new THREE.Mesh(panelGeom, this.dangerMat);
      panel.position.x = 0.65;
      panel.castShadow = true;
      wing.add(panel);

      obs.colliders.push({
        type: 'BOX',
        obj: panel,
        halfSize: new THREE.Vector3(0.58, 0.42, 0.1)
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

        case 'HAMMER': {
          const maxAngle = obs.config.amplitude || 1.1;
          moving.rotation.z = Math.sin(phase) * maxAngle;
          break;
        }

        case 'PUSHER': {
          // Pulse waveform: retracted 60% of time, quick punch & retract 40%
          const maxStroke = obs.config.amplitude || 1.8;
          const cycle = (phase % (Math.PI * 2)) / (Math.PI * 2); // 0 to 1
          let punch = 0;
          if (cycle < 0.4) {
            // Punch out and back: half-sine pulse
            punch = Math.sin((cycle / 0.4) * Math.PI);
          }
          const side = obs.config.reverse ? -1 : 1;
          moving.position.x = side * (1.5 - punch * maxStroke);
          break;
        }

        case 'ROLLER': {
          // Hydraulic Crusher Stamp:
          // Cycle: 60% elevated at 2.6m (CLEAR RUNNING!), 40% fast slam down to 0.15m & lift
          const cycle = (phase % (Math.PI * 2)) / (Math.PI * 2);
          let height = 2.6; // High clearance
          if (cycle > 0.6) {
            // Slamming down to floor and retracting back up
            const sub = (cycle - 0.6) / 0.4; // 0 to 1
            const slamProgress = Math.sin(sub * Math.PI);
            height = 2.6 - slamProgress * 2.45; // Descends to 0.15m!
          }
          moving.position.y = height;
          break;
        }

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
    characterRadius: number = 0.26,
    characterHeight: number = 1.4
  ): { hit: boolean; impulse: THREE.Vector3 } | null {
    const charCenter = characterPos.clone();
    charCenter.y += characterHeight * 0.5;

    const colliderWorldPos = new THREE.Vector3();

    for (const obs of this.obstacles) {
      if (charCenter.distanceTo(obs.position) > 5.0) continue;

      for (const col of obs.colliders) {
        col.obj.getWorldPosition(colliderWorldPos);

        // Crusher safety check: only collides when stamp is near ground level (< 1.1m)
        if (col.isCrusher && colliderWorldPos.y > 1.1) {
          continue; // High up: player passes safely underneath!
        }

        if (col.type === 'CYLINDER' || col.type === 'SPHERE') {
          const r = col.radius || 0.4;
          const dist = charCenter.distanceTo(colliderWorldPos);
          if (dist < characterRadius + r) {
            const dir = charCenter.clone().sub(colliderWorldPos).normalize();
            dir.y = Math.max(0.45, dir.y);
            return {
              hit: true,
              impulse: dir.multiplyScalar(9.0)
            };
          }
        } else if (col.type === 'BOX') {
          const boxInv = col.obj.matrixWorld.clone().invert();
          const localCharPos = charCenter.clone().applyMatrix4(boxInv);
          const hs = col.halfSize || new THREE.Vector3(0.5, 0.5, 0.5);

          const dx = Math.abs(localCharPos.x) - (hs.x + characterRadius);
          const dy = Math.abs(localCharPos.y) - (hs.y + characterHeight * 0.35);
          const dz = Math.abs(localCharPos.z) - (hs.z + characterRadius);

          if (dx < 0 && dy < 0 && dz < 0) {
            const worldDir = charCenter.clone().sub(colliderWorldPos).normalize();
            worldDir.y = 0.55;
            worldDir.normalize();
            return {
              hit: true,
              impulse: worldDir.multiplyScalar(8.5)
            };
          }
        }
      }
    }

    return null;
  }
}
