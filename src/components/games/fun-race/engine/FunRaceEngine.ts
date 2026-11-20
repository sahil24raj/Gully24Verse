import * as THREE from 'three';
import { TrackManager } from './TrackManager';
import { ObstacleManager } from './ObstacleManager';
import { ParticleManager } from './ParticleManager';
import { PlayerRunner } from './PlayerRunner';
import { OpponentRunner } from './OpponentRunner';
import { funRaceAudio } from './AudioManager';
import { FUN_RACE_CONSTANTS } from './constants';
import { FUN_RACE_LEVELS } from './LevelData';
import { EngineTelemetry, GameState, RunnerTelemetry } from './types';

export class FunRaceEngine {
  public container: HTMLElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;

  public trackManager: TrackManager;
  public obstacleManager: ObstacleManager;
  public particleManager: ParticleManager;
  public player: PlayerRunner;
  public opponents: OpponentRunner[] = [];

  public currentLevelIndex: number = 0;
  public gameState: GameState = 'RACING';
  public isHolding: boolean = false;
  public coinsEarned: number = 0;

  private waterMesh: THREE.Mesh;
  private waterTime: number = 0;
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private onTelemetryCallback?: (telemetry: EngineTelemetry) => void;
  private onVictoryCallback?: (coins: number, rank: number) => void;
  private onDefeatCallback?: (rank: number) => void;

  // Camera damping targets
  private camCurrentPos = new THREE.Vector3();
  private camCurrentLookAt = new THREE.Vector3();

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Scene & Camera Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x7DD3FC); // Sky blue
    this.scene.fog = new THREE.FogExp2(0xBAE6FD, 0.007);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    this.camera = new THREE.PerspectiveCamera(
      FUN_RACE_CONSTANTS.CAMERA_FOV,
      width / height,
      0.1,
      300
    );

    // 2. WebGL Renderer with High-Performance Settings
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    container.appendChild(this.renderer.domElement);

    // 3. Lighting Architecture
    const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x0284C7, 0.7);
    this.scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 1.25);
    sunLight.position.set(25, 45, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -30;
    sunLight.shadow.camera.right = 30;
    sunLight.shadow.camera.top = 30;
    sunLight.shadow.camera.bottom = -30;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    // 4. Stylized Animated Water Lagoon Surface
    const waterGeom = new THREE.PlaneGeometry(350, 350, 48, 48);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x00B4D8,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88,
      flatShading: true
    });
    this.waterMesh = new THREE.Mesh(waterGeom, waterMat);
    this.waterMesh.rotation.x = -Math.PI / 2;
    this.waterMesh.position.y = FUN_RACE_CONSTANTS.WATER_SURFACE_Y;
    this.waterMesh.receiveShadow = true;
    this.scene.add(this.waterMesh);

    // 5. Initialize Managers & Characters
    this.trackManager = new TrackManager();
    this.scene.add(this.trackManager.scene);

    this.obstacleManager = new ObstacleManager();
    this.scene.add(this.obstacleManager.scene);

    this.particleManager = new ParticleManager();
    this.scene.add(this.particleManager.scene);

    this.player = new PlayerRunner(FUN_RACE_CONSTANTS.COLORS.PLAYER);
    this.scene.add(this.player.rig.root);

    // 6. Bind Resize & Start Game Loop
    window.addEventListener('resize', this.handleResize);
    this.loadLevel(0);
    this.startLoop();
  }

  public setCallbacks(
    onTelemetry: (t: EngineTelemetry) => void,
    onVictory: (coins: number, rank: number) => void,
    onDefeat: (rank: number) => void
  ) {
    this.onTelemetryCallback = onTelemetry;
    this.onVictoryCallback = onVictory;
    this.onDefeatCallback = onDefeat;
  }

  public loadLevel(levelIdx: number) {
    this.currentLevelIndex = (levelIdx + FUN_RACE_LEVELS.length) % FUN_RACE_LEVELS.length;
    const config = FUN_RACE_LEVELS[this.currentLevelIndex];

    // Clear and build Track
    this.trackManager.buildLevel(config);

    // Clear and build Obstacles along spline
    this.obstacleManager.clear();
    for (const obsConfig of config.obstacles) {
      const sample = this.trackManager.sampleAtDistance(obsConfig.s);
      this.obstacleManager.buildObstacle(
        obsConfig,
        sample.position,
        sample.tangent,
        sample.normal
      );
    }

    // Reset Player
    this.player.reset(1.5);
    const pSample = this.trackManager.sampleAtDistance(1.5);
    this.player.rig.root.position.copy(pSample.position);

    // Setup Opponents
    for (const opp of this.opponents) {
      this.scene.remove(opp.rig.root);
    }
    this.opponents = [];

    for (const oppConfig of config.opponents) {
      const bot = new OpponentRunner(
        oppConfig.id,
        oppConfig.name,
        oppConfig.color,
        oppConfig.lateralOffset,
        oppConfig.speedFactor,
        oppConfig.aggression,
        oppConfig.accuracy
      );
      bot.reset(1.0);
      const bSample = this.trackManager.sampleAtDistance(1.0);
      bot.rig.root.position.copy(bSample.position).addScaledVector(bSample.normal, oppConfig.lateralOffset);
      this.opponents.push(bot);
      this.scene.add(bot.rig.root);
    }

    // Initialize Camera Position
    const initialTarget = pSample.position.clone();
    this.camCurrentLookAt.copy(initialTarget);
    this.camCurrentPos.copy(initialTarget).add(new THREE.Vector3(0, 5.5, -7.0));
    this.camera.position.copy(this.camCurrentPos);
    this.camera.lookAt(this.camCurrentLookAt);

    this.gameState = 'RACING';
    this.isHolding = false;
  }

  public nextLevel() {
    this.loadLevel(this.currentLevelIndex + 1);
  }

  public retryLevel() {
    this.loadLevel(this.currentLevelIndex);
  }

  public setHolding(holding: boolean) {
    if (this.gameState !== 'RACING') return;
    this.isHolding = holding;
  }

  private handleResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private startLoop() {
    this.lastTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - this.lastTime) / 1000.0);
      this.lastTime = now;

      this.update(dt);
      this.render();

      this.animFrameId = requestAnimationFrame(tick);
    };
    this.animFrameId = requestAnimationFrame(tick);
  }

  private update(dt: number) {
    // 1. Water Ripple Animation
    this.waterTime += dt * 1.5;
    const posAttr = this.waterMesh.geometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const u = (i % 49) * 0.25;
      const v = Math.floor(i / 49) * 0.25;
      const wave = Math.sin(u + this.waterTime) * 0.12 + Math.cos(v + this.waterTime * 0.8) * 0.12;
      posAttr.setZ(i, wave);
    }
    posAttr.needsUpdate = true;

    // 2. Update Obstacles
    this.obstacleManager.update(dt);

    // 3. Update Particles
    this.particleManager.update(dt);

    if (this.gameState === 'RACING') {
      // 4. Update Player
      this.player.update(
        dt,
        this.isHolding,
        this.trackManager,
        this.obstacleManager,
        this.particleManager
      );

      // 5. Update AI Opponents
      for (const bot of this.opponents) {
        bot.update(
          dt,
          this.trackManager,
          this.obstacleManager,
          this.particleManager
        );
      }

      // 6. Dynamic Rank Calculation
      const allRunners = [this.player, ...this.opponents];
      allRunners.sort((a, b) => b.s - a.s);
      allRunners.forEach((r, idx) => {
        r.rank = idx + 1;
      });

      // 7. Check Victory or Defeat Condition
      if (this.player.finished) {
        if (this.player.rank === 1) {
          this.gameState = 'VICTORY';
          const coins = 100 + (this.currentLevelIndex + 1) * 25;
          this.coinsEarned += coins;
          funRaceAudio.playVictory();
          if (this.onVictoryCallback) {
            this.onVictoryCallback(coins, 1);
          }
        } else {
          this.gameState = 'DEFEAT';
          funRaceAudio.playDefeat();
          if (this.onDefeatCallback) {
            this.onDefeatCallback(this.player.rank);
          }
        }
      }
    } else {
      // Idle / celebratory character animation in Victory / Defeat
      this.player.update(
        dt,
        false,
        this.trackManager,
        this.obstacleManager,
        this.particleManager
      );
    }

    // 8. Dynamic Camera Tracking
    this.updateCamera(dt);

    // 9. Dispatch Engine Telemetry to UI HUD
    this.dispatchTelemetry();
  }

  private updateCamera(dt: number) {
    const pPos = this.player.rig.root.position;
    const pSample = this.trackManager.sampleAtDistance(this.player.s);

    if (this.gameState === 'VICTORY') {
      // Dramatic Orbit Camera around winner
      const orbitAngle = performance.now() * 0.001;
      const targetCamPos = pPos.clone().add(new THREE.Vector3(
        Math.cos(orbitAngle) * 4.5,
        2.8,
        Math.sin(orbitAngle) * 4.5
      ));
      this.camCurrentPos.lerp(targetCamPos, 0.08);
      this.camCurrentLookAt.lerp(pPos.clone().add(new THREE.Vector3(0, 1.2, 0)), 0.1);
    } else {
      // Isometric Chase Camera aligned with Track Forward Tangent
      const tangent = pSample.tangent;
      const normal = pSample.normal;

      const targetCamPos = pPos.clone()
        .addScaledVector(tangent, -FUN_RACE_CONSTANTS.CAMERA_FOLLOW_DISTANCE)
        .add(new THREE.Vector3(0, FUN_RACE_CONSTANTS.CAMERA_HEIGHT, 0));

      const targetLookAt = pPos.clone()
        .addScaledVector(tangent, FUN_RACE_CONSTANTS.CAMERA_LOOKAHEAD)
        .add(new THREE.Vector3(0, 1.2, 0));

      this.camCurrentPos.lerp(targetCamPos, FUN_RACE_CONSTANTS.CAMERA_LERP);
      this.camCurrentLookAt.lerp(targetLookAt, FUN_RACE_CONSTANTS.CAMERA_LERP * 1.2);
    }

    this.camera.position.copy(this.camCurrentPos);
    this.camera.lookAt(this.camCurrentLookAt);
  }

  private dispatchTelemetry() {
    if (!this.onTelemetryCallback) return;

    const totalLen = this.trackManager.totalLength || 1.0;
    const playerProg = Math.min(100, Math.max(0, (this.player.s / totalLen) * 100));

    const runnerTelemetries: RunnerTelemetry[] = [
      {
        id: this.player.id,
        name: this.player.name,
        isPlayer: true,
        color: FUN_RACE_CONSTANTS.COLORS.PLAYER,
        s: this.player.s,
        progress: this.player.s / totalLen,
        rank: this.player.rank,
        state: this.player.state,
        position: {
          x: this.player.rig.root.position.x,
          y: this.player.rig.root.position.y,
          z: this.player.rig.root.position.z
        },
        finished: this.player.finished,
        finishTime: this.player.finishTime
      },
      ...this.opponents.map((bot) => ({
        id: bot.id,
        name: bot.name,
        isPlayer: false,
        color: bot.rig.color.getHexString(),
        s: bot.s,
        progress: bot.s / totalLen,
        rank: bot.rank,
        state: bot.state,
        position: {
          x: bot.rig.root.position.x,
          y: bot.rig.root.position.y,
          z: bot.rig.root.position.z
        },
        finished: bot.finished,
        finishTime: bot.finishTime
      }))
    ];

    const currentLvl = FUN_RACE_LEVELS[this.currentLevelIndex];

    this.onTelemetryCallback({
      gameState: this.gameState,
      level: currentLvl.levelNumber,
      totalLevels: FUN_RACE_LEVELS.length,
      playerRank: this.player.rank,
      totalRunners: 1 + this.opponents.length,
      playerProgress: playerProg,
      runners: runnerTelemetries,
      coinsEarned: this.coinsEarned,
      isHolding: this.isHolding,
      currentCheckpoint: this.player.currentCheckpoint,
      totalCheckpoints: currentLvl.checkpoints.length,
      speed: this.player.state === 'RUNNING' ? FUN_RACE_CONSTANTS.PLAYER_RUN_SPEED : 0
    });
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  public destroy() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.handleResize);

    if (this.renderer && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
