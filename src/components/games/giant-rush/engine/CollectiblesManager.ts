import * as THREE from 'three';
import { CollectibleItem, ColorType, LevelConfig } from './types';
import { COLOR_DEFINITIONS, COLOR_KEYS, RUNWAY_HALF_WIDTH } from './constants';
import { AudioEffects } from './AudioEffects';

export class CollectiblesManager {
  public group: THREE.Group = new THREE.Group();
  public items: CollectibleItem[] = [];
  public meshes: THREE.Group[] = [];

  // Particle bursts
  public particleGroup: THREE.Group = new THREE.Group();
  private activeParticles: Array<{
    mesh: THREE.Mesh;
    vx: number;
    vy: number;
    vz: number;
    life: number;
    maxLife: number;
  }> = [];

  constructor() {
    this.group.add(this.particleGroup);
  }

  public generateLevelCollectibles(level: LevelConfig): void {
    // Clear existing
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
    this.group.add(this.particleGroup);
    this.items = [];
    this.meshes = [];

    let idCount = 0;
    const allowedColors = level.colorsAllowed;
    const gateInterval = 90;
    const gateCount = Math.max(2, Math.floor(level.trackLength / gateInterval) - (level.trackLength % gateInterval === 0 ? 1 : 0));

    // Define sections with corresponding expected player colors
    // Section 0: 0 to 90m -> color allowedColors[0] ('red')
    // Section 1: 90m to 180m -> color allowedColors[1 % allowedColors.length]
    // ...
    const sections: Array<{ startZ: number; endZ: number; activeColor: ColorType }> = [];
    for (let s = 0; s <= gateCount; s++) {
      const startZ = s * gateInterval;
      const endZ = (s < gateCount) ? (s + 1) * gateInterval : level.trackLength;
      const activeColor = allowedColors[s % allowedColors.length];
      sections.push({ startZ, endZ, activeColor });
    }

    const lanes = [-2.8, 0, 2.8]; // Left, Center, Right lanes

    for (const sec of sections) {
      // 8m entry breathing space after gate, 10m exit buffer before next gate
      const secStart = sec.startZ + (sec.startZ === 0 ? 14 : 9);
      const secEnd = sec.endZ - 10;
      const targetColor = sec.activeColor;
      const otherColors = allowedColors.filter((c) => c !== targetColor);

      const stepZ = 3.6; // Regular readable rhythm
      let currentMatchingLaneIdx = Math.floor(Math.random() * 3);
      let rowsInCurrentCluster = 0;
      const clusterLength = 5 + Math.floor(Math.random() * 3); // 5-7 rows per stream (18m-25m run)

      for (let z = secStart; z < secEnd; z += stepZ) {
        rowsInCurrentCluster++;
        if (rowsInCurrentCluster > clusterLength) {
          rowsInCurrentCluster = 0;
          // Switch matching stream to a different lane
          const otherLanes = [0, 1, 2].filter((idx) => idx !== currentMatchingLaneIdx);
          currentMatchingLaneIdx = otherLanes[Math.floor(Math.random() * otherLanes.length)];
        }

        // Spawn matching micro-runner in matching stream lane
        const matchItem: CollectibleItem = {
          id: `collectible_${idCount++}`,
          x: lanes[currentMatchingLaneIdx],
          y: 0,
          z,
          color: targetColor,
          isCollected: false,
          scale: 0.65
        };
        const matchMesh = this.createMicroRunnerMesh(targetColor);
        matchMesh.position.set(matchItem.x, 0, matchItem.z);
        this.group.add(matchMesh);
        this.items.push(matchItem);
        this.meshes.push(matchMesh);

        // Spawn contrasting color in at least one other lane
        const nonMatchingLanes = [0, 1, 2].filter((idx) => idx !== currentMatchingLaneIdx);
        // Randomly pick 1 or 2 obstacle/contrasting lanes
        const contrastLaneIdx = nonMatchingLanes[Math.floor(Math.random() * nonMatchingLanes.length)];
        const contrastColor = otherColors.length > 0
          ? otherColors[Math.floor(Math.random() * otherColors.length)]
          : targetColor;

        const contrastItem: CollectibleItem = {
          id: `collectible_${idCount++}`,
          x: lanes[contrastLaneIdx],
          y: 0,
          z,
          color: contrastColor,
          isCollected: false,
          scale: 0.65
        };
        const contrastMesh = this.createMicroRunnerMesh(contrastColor);
        contrastMesh.position.set(contrastItem.x, 0, contrastItem.z);
        this.group.add(contrastMesh);
        this.items.push(contrastItem);
        this.meshes.push(contrastMesh);
      }
    }
  }

  private createMicroRunnerMesh(color: ColorType): THREE.Group {
    const meshGroup = new THREE.Group();
    const colorDef = COLOR_DEFINITIONS[color];

    const mat = new THREE.MeshStandardMaterial({
      color: colorDef.hex,
      roughness: 0.3,
      emissive: colorDef.emissiveHex,
      emissiveIntensity: 0.3
    });

    // Low-poly cute running blob/stickman
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.55, 8), mat);
    torso.position.y = 0.55;
    torso.castShadow = true;

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), mat);
    head.position.y = 0.98;
    head.castShadow = true;

    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.45, 6), mat);
    leftLeg.position.set(-0.12, 0.22, 0);

    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.45, 6), mat);
    rightLeg.position.set(0.12, 0.22, 0);

    meshGroup.add(torso, head, leftLeg, rightLeg);
    meshGroup.scale.set(0.65, 0.65, 0.65);
    return meshGroup;
  }

  public checkCollisions(
    playerX: number,
    playerZ: number,
    playerScale: number,
    playerColor: ColorType,
    streak: number
  ): { collected: boolean; matched: boolean; deltaScale: number; deltaPower: number } {
    let result = { collected: false, matched: false, deltaScale: 0, deltaPower: 0 };

    // Player collision radius scales with size
    const pickupRadius = 0.95 * Math.max(0.85, playerScale * 0.75);

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.isCollected) continue;

      // Quick bounding box distance check
      const dz = Math.abs(playerZ - item.z);
      if (dz > pickupRadius) continue;

      const dx = Math.abs(playerX - item.x);
      if (dx > pickupRadius) continue;

      // Hit detected!
      item.isCollected = true;
      this.meshes[i].visible = false;

      const isMatch = item.color === playerColor;

      // Spawn colorful particle burst
      this.spawnParticleBurst(item.x, 0.8, item.z, item.color, isMatch ? 14 : 8);

      if (isMatch) {
        AudioEffects.playCollectMatch(streak);
        result = {
          collected: true,
          matched: true,
          deltaScale: 0.065,
          deltaPower: 15
        };
      } else {
        AudioEffects.playCollectWrong();
        result = {
          collected: true,
          matched: false,
          deltaScale: -0.095,
          deltaPower: -25
        };
      }
      break; // One collision resolution per frame step
    }

    return result;
  }

  private spawnParticleBurst(x: number, y: number, z: number, color: ColorType, count: number): void {
    const colorDef = COLOR_DEFINITIONS[color];
    const geo = new THREE.SphereGeometry(0.1, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: colorDef.hex });

    for (let i = 0; i < count; i++) {
      const p = new THREE.Mesh(geo, mat);
      p.position.set(x, y, z);
      this.particleGroup.add(p);

      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 4.0;
      this.activeParticles.push({
        mesh: p,
        vx: Math.cos(angle) * speed,
        vy: 2.0 + Math.random() * 3.5,
        vz: Math.sin(angle) * speed,
        life: 0,
        maxLife: 0.35 + Math.random() * 0.25
      });
    }
  }

  public update(delta: number): void {
    // Animate idle run cycle of micro runners
    const time = performance.now() * 0.008;
    for (let i = 0; i < this.meshes.length; i++) {
      if (this.meshes[i].visible) {
        this.meshes[i].position.y = Math.abs(Math.sin(time + i)) * 0.12;
      }
    }

    // Update active particle physics
    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const p = this.activeParticles[i];
      p.life += delta;
      if (p.life >= p.maxLife) {
        this.particleGroup.remove(p.mesh);
        this.activeParticles.splice(i, 1);
        continue;
      }

      p.mesh.position.x += p.vx * delta;
      p.mesh.position.y += p.vy * delta;
      p.mesh.position.z += p.vz * delta;
      p.vy -= 9.8 * delta; // Gravity

      const scale = Math.max(0, 1 - p.life / p.maxLife);
      p.mesh.scale.set(scale, scale, scale);
    }
  }
}
