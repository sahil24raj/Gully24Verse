import * as THREE from 'three';
import { JellyCubeState } from './types';
import {
  TRACK_HALF_WIDTH,
  JELLY_BASE_SIZE,
  JELLY_Y_POS,
  SPLIT_DISTANCE,
  JELLY_COLORS
} from './constants';
import { JellyModelBuilder } from './JellyModelBuilder';
import { JellyParticleManager } from './ParticleManager';
import { JellyAudioManager } from './AudioManager';

export class PlayerJellyController {
  public cubes: JellyCubeState[] = [];
  public isSplit: boolean = false;
  public centralX: number = 0;
  public forwardZ: number = 0;

  private scene: THREE.Scene;
  private audio: JellyAudioManager;
  private particles: JellyParticleManager;

  // Smoothing & physics
  private targetCentralX: number = 0;
  private currentSpeed: number = 14.0;
  private totalDistance: number = 0;

  constructor(scene: THREE.Scene, audio: JellyAudioManager, particles: JellyParticleManager) {
    this.scene = scene;
    this.audio = audio;
    this.particles = particles;
    this.reset(2);
  }

  public reset(startingValue: number = 2) {
    // Clear old meshes
    this.cubes.forEach((c) => {
      if (c.mesh) {
        this.scene.remove(c.mesh);
      }
    });

    this.cubes = [];
    this.isSplit = false;
    this.centralX = 0;
    this.targetCentralX = 0;
    this.forwardZ = 0;
    this.totalDistance = 0;

    // Create primary cube
    const primaryMesh = JellyModelBuilder.createJellyMesh(startingValue);
    this.scene.add(primaryMesh);

    this.cubes.push({
      id: 'cube_main',
      value: startingValue,
      position: new THREE.Vector3(0, JELLY_Y_POS, 0),
      targetX: 0,
      scale: new THREE.Vector3(1, 1, 1),
      wobbleTimer: 0,
      wobbleMagnitude: 0,
      mesh: primaryMesh,
      alive: true,
      side: 'center'
    });

    this.updateMeshTransforms();
  }

  public setSteering(normX: number) {
    // normX: -1 (far left) to +1 (far right)
    const maxSafeX = TRACK_HALF_WIDTH - (this.isSplit ? SPLIT_DISTANCE : JELLY_BASE_SIZE * 0.6);
    this.targetCentralX = THREE.MathUtils.clamp(normX * (TRACK_HALF_WIDTH * 0.8), -maxSafeX, maxSafeX);
  }

  public toggleSplit() {
    if (this.cubes.length === 0) return;

    if (!this.isSplit) {
      // SPLIT ACTION: split single cube into twin cubes
      const primary = this.cubes.find((c) => c.alive);
      if (!primary) return;

      this.isSplit = true;
      this.audio.playSplit();
      this.particles.emitSplitBurst(primary.position);

      primary.side = 'left';
      primary.wobbleMagnitude = 0.4;

      // Create twin right cube with same value
      const rightMesh = JellyModelBuilder.createJellyMesh(primary.value);
      this.scene.add(rightMesh);

      this.cubes.push({
        id: `cube_twin_${Date.now()}`,
        value: primary.value,
        position: primary.position.clone(),
        targetX: this.centralX + SPLIT_DISTANCE / 2,
        scale: new THREE.Vector3(1, 1, 1),
        wobbleTimer: 0,
        wobbleMagnitude: 0.4,
        mesh: rightMesh,
        alive: true,
        side: 'right'
      });
    } else {
      // MERGE ACTION: pull both cubes back together
      this.isSplit = false;
      const aliveCubes = this.cubes.filter((c) => c.alive);

      if (aliveCubes.length >= 2) {
        const [c1, c2] = aliveCubes;
        // If equal values, combine into next tier!
        if (c1.value === c2.value) {
          const nextVal = c1.value * 2;
          c1.value = nextVal;
          c1.side = 'center';
          c1.wobbleMagnitude = 0.6; // huge bounce!
          JellyModelBuilder.updateJellyValue(c1.mesh!, nextVal);

          // Remove second cube
          c2.alive = false;
          if (c2.mesh) {
            this.scene.remove(c2.mesh);
          }

          this.cubes = [c1];
          this.audio.playMerge();
          const col = JELLY_COLORS[nextVal]?.hex || 0xFFD700;
          this.particles.emitMergeBurst(c1.position, col, 35);
        } else {
          // If unequal, keep both adjacent in center
          c1.side = 'left';
          c2.side = 'right';
        }
      } else if (aliveCubes.length === 1) {
        aliveCubes[0].side = 'center';
        this.cubes = [aliveCubes[0]];
      }
    }
  }

  public update(delta: number, forwardVelocity: number) {
    this.currentSpeed = forwardVelocity;
    this.forwardZ += this.currentSpeed * delta;
    this.totalDistance = this.forwardZ;

    // Smooth lateral movement (lerp)
    this.centralX = THREE.MathUtils.lerp(this.centralX, this.targetCentralX, 14.0 * delta);

    // Update individual cubes
    const aliveCubes = this.cubes.filter((c) => c.alive);
    if (aliveCubes.length === 0) return;

    if (this.isSplit && aliveCubes.length >= 2) {
      const leftCube = aliveCubes.find((c) => c.side === 'left') || aliveCubes[0];
      const rightCube = aliveCubes.find((c) => c.side === 'right') || aliveCubes[1];

      leftCube.targetX = this.centralX - SPLIT_DISTANCE / 2;
      rightCube.targetX = this.centralX + SPLIT_DISTANCE / 2;
    } else {
      aliveCubes.forEach((c) => {
        c.targetX = this.centralX;
      });
    }

    aliveCubes.forEach((cube) => {
      // Smooth lateral position
      cube.position.x = THREE.MathUtils.lerp(cube.position.x, cube.targetX, 16.0 * delta);
      cube.position.z = this.forwardZ;

      // Soft-body jelly wobble physics
      cube.wobbleTimer += delta * 12.0;

      // Decay wobble magnitude
      cube.wobbleMagnitude = THREE.MathUtils.lerp(cube.wobbleMagnitude, 0, 5.0 * delta);

      // Volume-preserving squash and stretch
      const forwardSquash = Math.sin(cube.wobbleTimer) * (0.05 + cube.wobbleMagnitude * 0.4);
      const scaleY = 1.0 + forwardSquash;
      const scaleXZ = 1.0 / Math.sqrt(Math.max(0.5, scaleY));

      const massScale = JELLY_COLORS[cube.value]?.mass || 1.0;
      cube.scale.set(scaleXZ * massScale, scaleY * massScale, scaleXZ * massScale);
      cube.position.y = (JELLY_BASE_SIZE * scaleY * massScale) / 2;
    });

    this.updateMeshTransforms();
  }

  public absorbCollectible(cube: JellyCubeState, value: number) {
    if (cube.value === value) {
      // Match! Double value
      const nextVal = cube.value * 2;
      cube.value = nextVal;
      cube.wobbleMagnitude = 0.55; // bounce!
      JellyModelBuilder.updateJellyValue(cube.mesh!, nextVal);

      const colorHex = JELLY_COLORS[nextVal]?.hex || 0xFFD700;
      this.particles.emitMergeBurst(cube.position, colorHex, 25);
      this.audio.playMerge();
      return { success: true, newValue: nextVal, points: nextVal * 2 };
    } else {
      // Non-matching cube collection
      cube.wobbleMagnitude = 0.25;
      this.audio.playCollect();
      return { success: false, newValue: cube.value, points: value };
    }
  }

  public damageCube(cube: JellyCubeState) {
    cube.alive = false;
    this.particles.emitHazardBurst(cube.position);
    this.audio.playHazardHit();

    if (cube.mesh) {
      this.scene.remove(cube.mesh);
    }

    // Clean up
    this.cubes = this.cubes.filter((c) => c.alive);
    if (this.cubes.length === 1) {
      this.isSplit = false;
      this.cubes[0].side = 'center';
    }
  }

  private updateMeshTransforms() {
    this.cubes.forEach((c) => {
      if (c.mesh && c.alive) {
        c.mesh.position.copy(c.position);
        c.mesh.scale.copy(c.scale);
      }
    });
  }

  public getLeadingPosition(): THREE.Vector3 {
    return new THREE.Vector3(this.centralX, JELLY_Y_POS, this.forwardZ);
  }

  public getMaxNumber(): number {
    if (this.cubes.length === 0) return 2;
    return Math.max(...this.cubes.filter((c) => c.alive).map((c) => c.value));
  }

  public hasAliveCubes(): boolean {
    return this.cubes.some((c) => c.alive);
  }

  public destroy() {
    this.cubes.forEach((c) => {
      if (c.mesh) {
        this.scene.remove(c.mesh);
      }
    });
    this.cubes = [];
  }
}
