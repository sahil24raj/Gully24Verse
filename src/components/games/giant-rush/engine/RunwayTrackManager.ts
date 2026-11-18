import * as THREE from 'three';
import { ColorGateItem, ColorType, LevelConfig, ObstacleItem } from './types';
import { COLOR_DEFINITIONS, MULTIPLIERS, RUNWAY_HALF_WIDTH, RUNWAY_WIDTH } from './constants';
import { AudioEffects } from './AudioEffects';

export class RunwayTrackManager {
  public group: THREE.Group = new THREE.Group();
  public gates: ColorGateItem[] = [];
  public obstacles: ObstacleItem[] = [];
  public finishLineZ: number = 100;
  public bossArenaZ: number = 120;

  private gateMeshes: THREE.Group[] = [];
  private obstacleMeshes: THREE.Group[] = [];

  constructor() {}

  public buildLevelTrack(level: LevelConfig): void {
    // Clear previous objects
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
    this.gates = [];
    this.gateMeshes = [];
    this.obstacles = [];
    this.obstacleMeshes = [];

    this.finishLineZ = level.trackLength;
    this.bossArenaZ = level.trackLength + 24;

    // 1. Main Asphalt Runway
    const runwayLength = level.trackLength + 360; // Extends into multiplier launch strip
    const runwayGeo = new THREE.PlaneGeometry(RUNWAY_WIDTH, runwayLength);
    runwayGeo.rotateX(-Math.PI / 2);

    const runwayMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.7,
      metalness: 0.1
    });

    const runwayMesh = new THREE.Mesh(runwayGeo, runwayMat);
    runwayMesh.position.set(0, -0.02, runwayLength / 2);
    runwayMesh.receiveShadow = true;
    this.group.add(runwayMesh);

    // 2. Yellow & Black Safety Guardrails along both sides
    const guardrailGeo = new THREE.BoxGeometry(0.5, 0.9, runwayLength);
    const railMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.4,
      metalness: 0.6
    });

    const leftRail = new THREE.Mesh(guardrailGeo, railMat);
    leftRail.position.set(-RUNWAY_HALF_WIDTH - 0.25, 0.45, runwayLength / 2);
    const rightRail = new THREE.Mesh(guardrailGeo, railMat);
    rightRail.position.set(RUNWAY_HALF_WIDTH + 0.25, 0.45, runwayLength / 2);

    this.group.add(leftRail, rightRail);

    // 3. Neon Lane Lines
    const laneCount = 3;
    const laneWidth = 0.14;
    const laneMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const lanes = [-2.75, 2.75];

    lanes.forEach((lx) => {
      const lineGeo = new THREE.PlaneGeometry(laneWidth, level.trackLength);
      lineGeo.rotateX(-Math.PI / 2);
      const lineMesh = new THREE.Mesh(lineGeo, laneMat);
      lineMesh.position.set(lx, 0.01, level.trackLength / 2);
      this.group.add(lineMesh);
    });

    // 4. Generate Color-Changing Gates
    this.generateColorGates(level);

    // 5. Generate Dynamic Obstacles
    this.generateObstacles(level);

    // 6. Build Finish Line Arch & Multiplier Zone
    this.buildFinishLineAndMultiplierZone(level);
  }

  private generateColorGates(level: LevelConfig): void {
    // Space gates every 90m for long, meaningful color sections
    const gateInterval = 90;
    const gateCount = Math.max(2, Math.floor(level.trackLength / gateInterval) - (level.trackLength % gateInterval === 0 ? 1 : 0));
    const allowed = level.colorsAllowed;

    for (let i = 1; i <= gateCount; i++) {
      const z = i * gateInterval;
      // Cycle through allowed colors distinct from previous
      const targetColor = allowed[i % allowed.length];
      const colorDef = COLOR_DEFINITIONS[targetColor];

      const gateItem: ColorGateItem = {
        id: `gate_${i}`,
        z,
        targetColor,
        width: RUNWAY_WIDTH,
        isPassed: false
      };

      // 3D Gate Arch
      const gateGroup = new THREE.Group();
      gateGroup.position.set(0, 0, z);

      // Pillars with neon accent bands
      const pillarGeo = new THREE.CylinderGeometry(0.4, 0.5, 6.5, 12);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.6 });
      const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
      leftPillar.position.set(-RUNWAY_HALF_WIDTH, 3.25, 0);
      const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
      rightPillar.position.set(RUNWAY_HALF_WIDTH, 3.25, 0);

      // Top Crossbar
      const crossbarGeo = new THREE.BoxGeometry(RUNWAY_WIDTH + 1.4, 0.8, 0.9);
      const crossbar = new THREE.Mesh(crossbarGeo, pillarMat);
      crossbar.position.set(0, 6.5, 0);

      // Translucent Glowing Energy Curtain
      const curtainGeo = new THREE.PlaneGeometry(RUNWAY_WIDTH - 0.4, 6.2);
      const curtainMat = new THREE.MeshBasicMaterial({
        color: colorDef.hex,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      });
      const curtain = new THREE.Mesh(curtainGeo, curtainMat);
      curtain.position.set(0, 3.2, 0);

      // Glowing Arch Light
      const archNeon = new THREE.Mesh(
        new THREE.BoxGeometry(RUNWAY_WIDTH, 0.15, 0.15),
        new THREE.MeshBasicMaterial({ color: colorDef.hex })
      );
      archNeon.position.set(0, 6.1, 0.4);

      gateGroup.add(leftPillar, rightPillar, crossbar, curtain, archNeon);
      this.group.add(gateGroup);

      this.gates.push(gateItem);
      this.gateMeshes.push(gateGroup);
    }
  }

  private generateObstacles(level: LevelConfig): void {
    // Generate obstacles only in middle of sections with generous reaction distance
    const gateInterval = 90;
    const gateCount = Math.max(2, Math.floor(level.trackLength / gateInterval) - (level.trackLength % gateInterval === 0 ? 1 : 0));
    const types: ObstacleItem['type'][] = ['spinning_blade', 'spike_roller', 'barrier_wall'];
    let obsId = 0;

    // For each section between gates (and initial/final sections):
    const sectionStarts = [0];
    for (let i = 1; i <= gateCount; i++) sectionStarts.push(i * gateInterval);

    for (let s = 0; s < sectionStarts.length; s++) {
      const secStart = sectionStarts[s];
      const secEnd = (s < sectionStarts.length - 1) ? sectionStarts[s + 1] : level.trackLength;
      
      // Place 1 or 2 obstacles per section, ensuring at least 25m buffer from gates
      const obsCount = Math.round(1 + level.hazardFrequency);
      const obsStep = (secEnd - secStart - 40) / (obsCount + 1);

      for (let k = 1; k <= obsCount; k++) {
        const z = secStart + 22 + k * obsStep;
        if (z >= level.trackLength - 20) continue;

        const type = types[(obsId) % types.length];
        // Restrict obstacle X so at least 1 lane is always clearly passable
        const laneOffsets = [-2.8, 2.8, 0];
        const initialX = laneOffsets[(obsId) % laneOffsets.length];

        const item: ObstacleItem = {
          id: `obstacle_${obsId++}`,
          x: initialX,
          y: 0.5,
          z,
          type,
          width: type === 'barrier_wall' ? 3.6 : 2.2,
          height: 1.5,
          depth: 1.2,
          rotSpeed: 3.5,
          moveAmplitude: type === 'spinning_blade' ? 1.6 : 0,
          moveSpeed: 1.5 + Math.random() * 1.0,
          initialX,
          isHit: false
        };

        const obsGroup = new THREE.Group();
        obsGroup.position.set(item.x, item.y, item.z);

        const hazardMat = new THREE.MeshStandardMaterial({
          color: 0xdc2626,
          roughness: 0.35,
          metalness: 0.6
        });

        if (type === 'spinning_blade') {
          const bladeGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.15, 6);
          bladeGeo.rotateX(Math.PI / 2);
          const blade = new THREE.Mesh(bladeGeo, hazardMat);
          blade.castShadow = true;
          obsGroup.add(blade);
        } else if (type === 'spike_roller') {
          const rollerGeo = new THREE.CylinderGeometry(0.7, 0.7, 3.2, 12);
          rollerGeo.rotateZ(Math.PI / 2);
          const roller = new THREE.Mesh(rollerGeo, hazardMat);
          roller.castShadow = true;
          obsGroup.add(roller);
        } else {
          const wallGeo = new THREE.BoxGeometry(item.width, 2.0, 0.8);
          const wall = new THREE.Mesh(wallGeo, hazardMat);
          wall.position.y = 0.5;
          wall.castShadow = true;
          obsGroup.add(wall);
        }

        this.group.add(obsGroup);
        this.obstacles.push(item);
        this.obstacleMeshes.push(obsGroup);
      }
    }
  }
        x: initialX,
        y: 0.5,
        z,
        type,
        width: type === 'barrier_wall' ? 4.5 : 2.5,
        height: 1.5,
        depth: 1.2,
        rotSpeed: 3.5,
        moveAmplitude: type === 'spinning_blade' ? 2.8 : 0,
        moveSpeed: 1.8 + Math.random() * 1.5,
        initialX,
        isHit: false
      };

      const obsGroup = new THREE.Group();
      obsGroup.position.set(item.x, item.y, item.z);

      const hazardMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.4,
        metalness: 0.7
      });

      if (type === 'spinning_blade') {
        const bladeGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.15, 6);
        bladeGeo.rotateX(Math.PI / 2);
        const blade = new THREE.Mesh(bladeGeo, hazardMat);
        blade.castShadow = true;
        obsGroup.add(blade);
      } else if (type === 'spike_roller') {
        const rollerGeo = new THREE.CylinderGeometry(0.8, 0.8, 4.0, 12);
        rollerGeo.rotateZ(Math.PI / 2);
        const roller = new THREE.Mesh(rollerGeo, hazardMat);
        roller.castShadow = true;
        obsGroup.add(roller);
      } else {
        // Barrier Wall with hazard stripes
        const wallGeo = new THREE.BoxGeometry(item.width, 2.2, 0.8);
        const wall = new THREE.Mesh(wallGeo, hazardMat);
        wall.position.y = 0.6;
        wall.castShadow = true;
        obsGroup.add(wall);
      }

      this.group.add(obsGroup);
      this.obstacles.push(item);
      this.obstacleMeshes.push(obsGroup);
    }
  }

  private buildFinishLineAndMultiplierZone(level: LevelConfig): void {
    // Finish Arch
    const finishGroup = new THREE.Group();
    finishGroup.position.set(0, 0, this.finishLineZ);

    const archMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.7 });
    const archBar = new THREE.Mesh(new THREE.BoxGeometry(RUNWAY_WIDTH + 1.5, 1.0, 0.8), archMat);
    archBar.position.set(0, 7, 0);

    const bannerCanvas = document.createElement('canvas');
    bannerCanvas.width = 512;
    bannerCanvas.height = 128;
    const ctx = bannerCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, 0, 512, 128);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 58px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FINISH LINE', 256, 85);
    }
    const bannerTex = new THREE.CanvasTexture(bannerCanvas);
    const bannerGeo = new THREE.PlaneGeometry(RUNWAY_WIDTH, 2.2);
    const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(0, 5, 0);

    finishGroup.add(archBar, banner);
    this.group.add(finishGroup);

    // Multiplier Launch Strip Markers
    MULTIPLIERS.forEach((m) => {
      const zPos = this.bossArenaZ + m.minDistance;
      const stripGeo = new THREE.PlaneGeometry(RUNWAY_WIDTH, 3.5);
      stripGeo.rotateX(-Math.PI / 2);
      const stripMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(m.color),
        roughness: 0.3
      });
      const stripMesh = new THREE.Mesh(stripGeo, stripMat);
      stripMesh.position.set(0, 0.03, zPos);
      this.group.add(stripMesh);
    });
  }

  public checkGateCrossings(playerZ: number): ColorType | null {
    for (let i = 0; i < this.gates.length; i++) {
      const gate = this.gates[i];
      if (!gate.isPassed && playerZ >= gate.z) {
        gate.isPassed = true;
        AudioEffects.playColorGate();
        return gate.targetColor;
      }
    }
    return null;
  }

  public checkObstacleCollisions(
    playerX: number,
    playerZ: number,
    playerScale: number
  ): boolean {
    const playerRadius = 0.8 * playerScale;

    for (let i = 0; i < this.obstacles.length; i++) {
      const obs = this.obstacles[i];
      if (obs.isHit) continue;

      const dz = Math.abs(playerZ - obs.z);
      if (dz > (obs.depth / 2 + playerRadius)) continue;

      const dx = Math.abs(playerX - obs.x);
      if (dx < (obs.width / 2 + playerRadius)) {
        obs.isHit = true;
        AudioEffects.playHazardHit();
        return true;
      }
    }
    return false;
  }

  public update(delta: number): void {
    const time = performance.now() * 0.001;

    for (let i = 0; i < this.obstacles.length; i++) {
      const obs = this.obstacles[i];
      const mesh = this.obstacleMeshes[i];

      // Oscillate horizontally
      if (obs.moveAmplitude > 0) {
        obs.x = obs.initialX + Math.sin(time * obs.moveSpeed) * obs.moveAmplitude;
        mesh.position.x = obs.x;
      }

      // Rotate blades / rollers
      if (obs.type === 'spinning_blade') {
        mesh.rotation.y += obs.rotSpeed * delta;
      } else if (obs.type === 'spike_roller') {
        mesh.rotation.x += obs.rotSpeed * delta;
      }
    }
  }
}
