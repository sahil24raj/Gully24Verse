import * as THREE from 'three';
import { CharacterRig, createProceduralCharacter, animateCharacter } from './ProceduralCharacterMesh';
import { TrackManager } from './TrackManager';
import { ObstacleManager, ActiveObstacle } from './ObstacleManager';
import { ParticleManager } from './ParticleManager';
import { funRaceAudio } from './AudioManager';
import { FUN_RACE_CONSTANTS } from './constants';
import { RunnerState } from './types';

export class OpponentRunner {
  public id: string;
  public name: string;
  public isPlayer: boolean = false;
  public state: RunnerState = 'IDLE';
  public rig: CharacterRig;
  public s: number = 0;
  public lateralOffset: number;
  public currentCheckpoint: number = 0;
  public rank: number = 2;
  public finished: boolean = false;
  public finishTime: number = 0;

  private speedFactor: number;
  private aggression: number;
  private accuracy: number;

  private ragdollVelocity = new THREE.Vector3();
  private tumbleAngularVel = new THREE.Vector3();
  private respawnTimer: number = 0;
  private invincibleTimer: number = 0;
  private hasSplashed: boolean = false;

  private waitTimer: number = 0;

  constructor(
    id: string,
    name: string,
    colorHex: string,
    lateralOffset: number = 0.75,
    speedFactor: number = 0.98,
    aggression: number = 0.5,
    accuracy: number = 0.88
  ) {
    this.id = id;
    this.name = name;
    this.lateralOffset = lateralOffset;
    this.speedFactor = speedFactor;
    this.aggression = aggression;
    this.accuracy = accuracy;
    this.rig = createProceduralCharacter(colorHex, 0.96);
  }

  public reset(startS: number = 1.0) {
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
    this.waitTimer = 0;
    this.rig.root.rotation.set(0, 0, 0);
  }

  public update(
    dt: number,
    track: TrackManager,
    obstacles: ObstacleManager,
    particles: ParticleManager
  ) {
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= dt;
      this.rig.root.visible = Math.floor(this.invincibleTimer * 12) % 2 === 0;
    } else {
      this.rig.root.visible = true;
    }

    if (this.state === 'FINISHED') {
      animateCharacter(this.rig, 'FINISHED', dt, 1.0);
      return;
    }

    // 1. KNOCKED_OUT STATE
    if (this.state === 'KNOCKED_OUT') {
      this.ragdollVelocity.y += FUN_RACE_CONSTANTS.GRAVITY * dt;
      this.rig.root.position.addScaledVector(this.ragdollVelocity, dt);

      this.rig.root.rotation.x += this.tumbleAngularVel.x * dt;
      this.rig.root.rotation.y += this.tumbleAngularVel.y * dt;
      this.rig.root.rotation.z += this.tumbleAngularVel.z * dt;

      if (this.rig.root.position.y <= FUN_RACE_CONSTANTS.WATER_SURFACE_Y && !this.hasSplashed) {
        this.hasSplashed = true;
        funRaceAudio.playSplash();
        particles.emitWaterSplash(this.rig.root.position);
        this.ragdollVelocity.multiplyScalar(0.25);
      }

      this.respawnTimer += dt;
      if (this.respawnTimer >= FUN_RACE_CONSTANTS.RESPAWN_DELAY) {
        this.respawnAtCheckpoint(track);
      }

      animateCharacter(this.rig, 'KNOCKED_OUT', dt, 1.0);
      return;
    }

    // 2. AI SENSORY DECISION ENGINE
    const shouldRun = this.evaluatePathSafety(obstacles);

    this.state = shouldRun ? 'RUNNING' : 'IDLE';

    if (this.state === 'RUNNING') {
      const runSpeed = FUN_RACE_CONSTANTS.PLAYER_RUN_SPEED * this.speedFactor;
      this.s += runSpeed * dt;
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
      }
    }

    // Align with Spline Track
    const sample = track.sampleAtDistance(this.s);
    const targetPos = sample.position.clone().addScaledVector(sample.normal, this.lateralOffset);
    targetPos.y = sample.position.y; // Strictly lock to deck surface
    this.rig.root.position.copy(targetPos);

    const forward = sample.tangent.clone();
    this.rig.root.rotation.set(0, Math.atan2(forward.x, forward.z), 0);

    // 3. COLLISION DETECTION
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

    animateCharacter(this.rig, this.state, dt, this.speedFactor);
  }

  /**
   * AI Look-ahead decision: evaluates upcoming obstacle phase
   */
  private evaluatePathSafety(obstacles: ObstacleManager): boolean {
    const lookAheadDist = 3.6 + (1.0 - this.aggression) * 1.5;

    let nearestHazard: ActiveObstacle | null = null;
    let nearestDist = 999;

    for (const obs of obstacles.obstacles) {
      const dist = obs.config.s - this.s;
      if (dist > -0.5 && dist < lookAheadDist && dist < nearestDist) {
        nearestDist = dist;
        nearestHazard = obs;
      }
    }

    if (!nearestHazard) return true;

    // Evaluate hazard clearance based on phase and accuracy
    const phase = nearestHazard.phase;
    const type = nearestHazard.config.type;

    if (type === 'HAMMER') {
      // Hammer swings through center near phase = 0 or PI
      const swingPos = Math.abs(Math.sin(phase));
      // Safe when hammer is at top of swing (swingPos > 0.75)
      const isClear = swingPos > 0.65;
      if (!isClear && nearestDist < 2.8) {
        // Roll dice based on accuracy
        if (Math.random() < this.accuracy) {
          return false; // Wait
        }
      }
    } else if (type === 'SWEEPER') {
      // Arm angular position
      const arms = nearestHazard.config.arms || 2;
      const armSpacing = (Math.PI * 2) / arms;
      const normalizedPhase = phase % armSpacing;
      // Danger zone when arm is sweeping across lane
      const inDangerArc = normalizedPhase < armSpacing * 0.45;
      if (inDangerArc && nearestDist < 2.5) {
        if (Math.random() < this.accuracy) {
          return false;
        }
      }
    } else if (type === 'PUSHER') {
      const punch = Math.sin(phase);
      // Danger when extended (punch > 0.2)
      if (punch > 0.15 && nearestDist < 2.4) {
        if (Math.random() < this.accuracy) {
          return false;
        }
      }
    }

    return true;
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
    let respawnS = 1.0;
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
    this.rig.root.position.copy(sample.position).addScaledVector(sample.normal, this.lateralOffset);
    const forward = sample.tangent.clone();
    this.rig.root.rotation.set(0, Math.atan2(forward.x, forward.z), 0);
  }
}
