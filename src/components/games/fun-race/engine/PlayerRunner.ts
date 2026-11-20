import * as THREE from 'three';
import { CharacterRig, createProceduralCharacter, animateCharacter } from './ProceduralCharacterMesh';
import { TrackManager, TrackSample } from './TrackManager';
import { ObstacleManager } from './ObstacleManager';
import { ParticleManager } from './ParticleManager';
import { funRaceAudio } from './AudioManager';
import { FUN_RACE_CONSTANTS } from './constants';
import { RunnerState } from './types';

export class PlayerRunner {
  public id: string = 'player';
  public name: string = 'Player';
  public isPlayer: boolean = true;
  public state: RunnerState = 'IDLE';
  public rig: CharacterRig;
  public s: number = 0; // Distance along track
  public lateralOffset: number = 0; // Center of lane
  public currentCheckpoint: number = 0; // Latest passed checkpoint index
  public rank: number = 1;
  public finished: boolean = false;
  public finishTime: number = 0;

  // Ragdoll & Knockback physics
  private ragdollVelocity = new THREE.Vector3();
  private tumbleAngularVel = new THREE.Vector3();
  private respawnTimer: number = 0;
  private invincibleTimer: number = 0;
  private hasSplashed: boolean = false;

  constructor(colorHex: string = FUN_RACE_CONSTANTS.COLORS.PLAYER) {
    this.rig = createProceduralCharacter(colorHex, 1.0);
  }

  public reset(startS: number = 1.5) {
    this.s = startS;
    this.state = 'IDLE';
    this.currentCheckpoint = 0;
    this.finished = false;
    this.finishTime = 0;
    this.ragdollVelocity.set(0, 0, 0);
    this.tumbleAngularVel.set(0, 0, 0);
    this.respawnTimer = 0;
    this.invincibleTimer = 0;
    this.hasSplashed = false;
    this.rig.root.rotation.set(0, 0, 0);
  }

  public update(
    dt: number,
    isHolding: boolean,
    track: TrackManager,
    obstacles: ObstacleManager,
    particles: ParticleManager
  ) {
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= dt;
      // Blink effect
      this.rig.root.visible = Math.floor(this.invincibleTimer * 12) % 2 === 0;
    } else {
      this.rig.root.visible = true;
    }

    if (this.state === 'FINISHED') {
      animateCharacter(this.rig, 'FINISHED', dt, 1.0);
      return;
    }

    // 1. KNOCKED_OUT / RAGDOLL STATE
    if (this.state === 'KNOCKED_OUT') {
      this.ragdollVelocity.y += FUN_RACE_CONSTANTS.GRAVITY * dt;
      this.rig.root.position.addScaledVector(this.ragdollVelocity, dt);

      // Tumble rotation
      this.rig.root.rotation.x += this.tumbleAngularVel.x * dt;
      this.rig.root.rotation.y += this.tumbleAngularVel.y * dt;
      this.rig.root.rotation.z += this.tumbleAngularVel.z * dt;

      // Water Plunge Detection
      if (this.rig.root.position.y <= FUN_RACE_CONSTANTS.WATER_SURFACE_Y && !this.hasSplashed) {
        this.hasSplashed = true;
        funRaceAudio.playSplash();
        particles.emitWaterSplash(this.rig.root.position);
        this.ragdollVelocity.multiplyScalar(0.25); // Heavy water drag
      }

      this.respawnTimer += dt;
      if (this.respawnTimer >= FUN_RACE_CONSTANTS.RESPAWN_DELAY) {
        this.respawnAtCheckpoint(track);
      }

      animateCharacter(this.rig, 'KNOCKED_OUT', dt, 1.0);
      return;
    }

    // 2. NORMAL RUNNING / IDLING STATE
    const targetState: RunnerState = isHolding ? 'RUNNING' : 'IDLE';
    if (this.state === 'RUNNING' && targetState === 'IDLE') {
      funRaceAudio.playBrake();
    }
    this.state = targetState;

    if (this.state === 'RUNNING') {
      this.s += FUN_RACE_CONSTANTS.PLAYER_RUN_SPEED * dt;
      funRaceAudio.playFootstep();
      if (Math.random() < 0.2) {
        particles.emitDustPuff(this.rig.root.position);
      }
    }

    // Check Finish Line
    if (this.s >= track.totalLength - 1.2 && !this.finished) {
      this.finished = true;
      this.state = 'FINISHED';
      this.finishTime = performance.now();
      return;
    }

    // Check Checkpoints Passed
    for (const cp of track.checkpointSamples) {
      if (this.s >= cp.sample.s && this.currentCheckpoint < cp.index) {
        this.currentCheckpoint = cp.index;
        funRaceAudio.playCheckpoint();
      }
    }

    // Align Rig with Spline Track
    const sample = track.sampleAtDistance(this.s);
    const targetPos = sample.position.clone().addScaledVector(sample.normal, this.lateralOffset);
    targetPos.y = sample.position.y; // Strictly lock to deck surface
    this.rig.root.position.copy(targetPos);

    // Orientation along Track Tangent (locked yaw, no ungrounded tilt)
    const forward = sample.tangent.clone();
    const targetRotY = Math.atan2(forward.x, forward.z);
    this.rig.root.rotation.set(0, targetRotY, 0);

    // 3. COLLISION DETECTION AGAINST OBSTACLES
    if (this.invincibleTimer <= 0) {
      const col = obstacles.checkCharacterCollision(
        this.rig.root.position,
        FUN_RACE_CONSTANTS.CHARACTER_RADIUS,
        FUN_RACE_CONSTANTS.CHARACTER_HEIGHT
      );

      if (col && col.hit) {
        this.knockout(col.impulse);
      }
    }

    animateCharacter(this.rig, this.state, dt, 1.0);
  }

  public knockout(impulse: THREE.Vector3) {
    if (this.state === 'KNOCKED_OUT' || this.state === 'FINISHED') return;
    this.state = 'KNOCKED_OUT';
    this.ragdollVelocity.copy(impulse);
    this.ragdollVelocity.y = Math.max(FUN_RACE_CONSTANTS.KNOCKBACK_UP_VELOCITY, impulse.y);
    this.tumbleAngularVel.set(
      (Math.random() - 0.5) * 12.0,
      (Math.random() - 0.5) * 8.0,
      (Math.random() - 0.5) * 12.0
    );
    this.respawnTimer = 0;
    this.hasSplashed = false;
    funRaceAudio.playBonk();
  }

  private respawnAtCheckpoint(track: TrackManager) {
    let respawnS = 1.5;
    if (this.currentCheckpoint > 0) {
      const cp = track.checkpointSamples.find((c) => c.index === this.currentCheckpoint);
      if (cp) {
        respawnS = cp.sample.s + 0.5;
      }
    }

    this.s = respawnS;
    this.state = 'IDLE';
    this.ragdollVelocity.set(0, 0, 0);
    this.tumbleAngularVel.set(0, 0, 0);
    this.respawnTimer = 0;
    this.invincibleTimer = FUN_RACE_CONSTANTS.INVINCIBLE_TIME;
    this.hasSplashed = false;

    const sample = track.sampleAtDistance(this.s);
    this.rig.root.position.copy(sample.position);
    const forward = sample.tangent.clone();
    this.rig.root.rotation.set(0, Math.atan2(forward.x, forward.z), 0);
  }
}
