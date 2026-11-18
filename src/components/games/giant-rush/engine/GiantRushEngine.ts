import * as THREE from 'three';
import { GamePhase, LevelConfig, PlayerState } from './types';
import { PlayerCharacter } from './PlayerCharacter';
import { RunwayTrackManager } from './RunwayTrackManager';
import { CollectiblesManager } from './CollectiblesManager';
import { BossCombatManager } from './BossCombatManager';

export class GiantRushEngine {
  private canvas: HTMLCanvasElement;
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;

  // Subsystems
  public player: PlayerCharacter;
  public track: RunwayTrackManager;
  public collectibles: CollectiblesManager;
  public boss: BossCombatManager;

  // Camera Shake & Pulse
  private cameraShakeIntensity: number = 0;
  private targetFov: number = 54;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(canvas.width, canvas.height, false);
    this.renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a); // Deep midnight blue sky
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.006);

    this.camera = new THREE.PerspectiveCamera(54, canvas.width / canvas.height, 0.5, 600);
    this.camera.position.set(0, 4.5, -9);

    // Initialize systems
    this.player = new PlayerCharacter('red');
    this.track = new RunwayTrackManager();
    this.collectibles = new CollectiblesManager();
    this.boss = new BossCombatManager();

    this.scene.add(this.player.group);
    this.scene.add(this.track.group);
    this.scene.add(this.collectibles.group);
    this.scene.add(this.boss.group);

    this.setupLighting();
  }

  private setupLighting(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfffbeb, 1.8);
    sun.position.set(20, 35, 15);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 120;
    sun.shadow.camera.left = -15;
    sun.shadow.camera.right = 15;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -15;
    this.scene.add(sun);

    const hemi = new THREE.HemisphereLight(0x38bdf8, 0x1e293b, 0.6);
    this.scene.add(hemi);
  }

  public initLevel(level: LevelConfig): void {
    this.track.buildLevelTrack(level);
    this.collectibles.generateLevelCollectibles(level);
    this.boss.spawnBoss(level, this.track.bossArenaZ);

    this.player.group.position.set(0, 0, 0);
    this.player.setColor('red');
  }

  public triggerScreenShake(intensity: number = 0.45): void {
    this.cameraShakeIntensity = intensity;
    this.targetFov = 68; // Brief FOV pulse
  }

  public update(delta: number, phase: GamePhase, playerState: PlayerState): void {
    // 1. Update Player 3D Mesh (Negative X maps screen right to Three.js camera NDC)
    this.player.group.position.set(-playerState.x, 0, playerState.z);
    this.player.setColor(playerState.color);
    const isPlayerRunning = phase === 'RUNNING' || phase === 'FINISH_APPROACH';
    this.player.update(delta, isPlayerRunning, playerState.scale);

    // 2. Update Subsystems
    this.track.update(delta);
    this.collectibles.update(delta);
    this.boss.update(delta);

    // 3. Dynamic Camera Logic Based on Game Phase
    this.updateCamera(delta, phase, playerState);

    // 4. Render 3D Frame
    this.renderer.render(this.scene, this.camera);
  }

  private updateCamera(delta: number, phase: GamePhase, playerState: PlayerState): void {
    // FOV Pulse Decay
    this.targetFov += (54 - this.targetFov) * Math.min(1, delta * 6);
    this.camera.fov = this.targetFov;
    this.camera.updateProjectionMatrix();

    // Camera Shake
    let shakeX = 0;
    let shakeY = 0;
    if (this.cameraShakeIntensity > 0) {
      this.cameraShakeIntensity = Math.max(0, this.cameraShakeIntensity - delta * 2.2);
      shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
      shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
    }

    const s = playerState.scale;

    if (phase === 'RUNNING' || phase === 'MENU' || phase === 'FINISH_APPROACH') {
      // Dynamic Chase Camera: Pulls back smoothly as character grows!
      const followDist = 8.5 * Math.pow(s, 0.35);
      const followHeight = 3.6 + s * 1.2;

      const targetX = -playerState.x * 0.45 + shakeX;
      const targetY = followHeight + shakeY;
      const targetZ = playerState.z - followDist;

      this.camera.position.x += (targetX - this.camera.position.x) * Math.min(1, delta * 12);
      this.camera.position.y += (targetY - this.camera.position.y) * Math.min(1, delta * 8);
      this.camera.position.z += (targetZ - this.camera.position.z) * Math.min(1, delta * 14);

      // Look ahead of runner
      this.camera.lookAt(-playerState.x * 0.3, 1.4 * s, playerState.z + 12);
    } else if (phase === 'BOSS_INTRO' || phase === 'BOSS_QTE' || phase === 'BOSS_PUNCH') {
      // Cinematic 45-degree angle facing the two titans
      const arenaZ = this.track.bossArenaZ;
      const camX = 6.8 + shakeX;
      const camY = 4.2 + shakeY;
      const camZ = arenaZ - 5.5;

      this.camera.position.x += (camX - this.camera.position.x) * Math.min(1, delta * 6);
      this.camera.position.y += (camY - this.camera.position.y) * Math.min(1, delta * 6);
      this.camera.position.z += (camZ - this.camera.position.z) * Math.min(1, delta * 6);

      // Focus between player and boss
      const focusZ = (playerState.z + (this.boss.boss?.z || arenaZ)) / 2;
      this.camera.lookAt(0, 2.5, focusZ);
    } else if (phase === 'BOSS_LAUNCH' || phase === 'VICTORY') {
      // Follow the flying ragdoll boss across the multiplier runway!
      if (this.boss.boss) {
        const b = this.boss.boss;
        const targetX = 0 + shakeX;
        const targetY = Math.max(5.0, b.y + 4.0) + shakeY;
        const targetZ = b.z - 12.0;

        this.camera.position.x += (targetX - this.camera.position.x) * Math.min(1, delta * 8);
        this.camera.position.y += (targetY - this.camera.position.y) * Math.min(1, delta * 8);
        this.camera.position.z += (targetZ - this.camera.position.z) * Math.min(1, delta * 8);

        this.camera.lookAt(0, b.y + 1.5, b.z + 6);
      }
    }
  }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }
}
