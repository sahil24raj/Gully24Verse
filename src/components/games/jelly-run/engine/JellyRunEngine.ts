import * as THREE from 'three';
import { GameState, GameStats, LevelConfig } from './types';
import { LEVELS, DEFAULT_SPEED, BOOST_SPEED } from './constants';
import { JellyAudioManager } from './AudioManager';
import { JellyParticleManager } from './ParticleManager';
import { PlayerJellyController } from './PlayerJellyController';
import { JellyTrackManager } from './TrackManager';
import { JellyObstacleManager } from './ObstacleManager';
import { JellyCollectibleManager } from './CollectibleManager';
import { JellyTextureGenerator } from './TextureGenerator';

export class JellyRunEngine {
  private container: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;
  private lastTime: number = 0;
  private elapsed: number = 0;

  // Subsystems
  public audio: JellyAudioManager;
  public particles: JellyParticleManager;
  public player: PlayerJellyController;
  public track: JellyTrackManager;
  public obstacles: JellyObstacleManager;
  public collectibles: JellyCollectibleManager;

  // Game state
  public state: GameState = 'START';
  public currentLevelIndex: number = 0;
  public currentLevel: LevelConfig;
  public score: number = 0;
  public highestNumber: number = 2;
  public mergesCount: number = 0;
  public splitsCount: number = 0;

  // Run mechanics
  private forwardSpeed: number = DEFAULT_SPEED;
  private isPastFinish: boolean = false;
  private multiplierAchieved: number = 1.0;
  private finalStopTimer: number = 0;

  // Callbacks
  public onStateChange?: (state: GameState) => void;
  public onStatsUpdate?: (stats: GameStats) => void;
  public onProgressUpdate?: (progress01: number) => void;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.currentLevel = LEVELS[0];

    // 1. Scene & Atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x38BDF8);
    this.scene.fog = new THREE.FogExp2(0x38BDF8, 0.015);

    // 2. Camera
    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    this.camera = new THREE.PerspectiveCamera(56, aspect, 0.1, 400);
    this.camera.position.set(0, 5.0, -7.0);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    container.appendChild(this.renderer.domElement);

    // 4. Lighting
    this.setupLighting();

    // 5. Initialize Subsystems
    this.audio = new JellyAudioManager();
    this.particles = new JellyParticleManager(this.scene);
    this.player = new PlayerJellyController(this.scene, this.audio, this.particles);
    this.track = new JellyTrackManager(this.scene);
    this.obstacles = new JellyObstacleManager(this.scene);
    this.collectibles = new JellyCollectibleManager(this.scene);

    // Setup Level 1
    this.loadLevel(0);

    // Event listeners
    window.addEventListener('resize', this.handleResize);

    // Start loop
    this.lastTime = performance.now();
    this.loop();
  }

  private setupLighting() {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0284C7, 0.7);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.3);
    dirLight.position.set(15, 30, -20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 25;
    dirLight.shadow.camera.bottom = -15;
    this.scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);
  }

  public loadLevel(levelIndex: number) {
    this.currentLevelIndex = levelIndex % LEVELS.length;
    this.currentLevel = LEVELS[this.currentLevelIndex];

    this.scene.background = new THREE.Color(this.currentLevel.theme.skyColorBottom);
    if (this.scene.fog) {
      this.scene.fog.color = new THREE.Color(this.currentLevel.theme.skyColorBottom);
    }

    this.track.buildTrack(this.currentLevel);
    this.obstacles.populate(this.currentLevel);
    this.collectibles.populate(this.currentLevel);

    this.player.reset(2);
    this.score = 0;
    this.highestNumber = 2;
    this.forwardSpeed = this.currentLevel.speed;
    this.isPastFinish = false;
    this.multiplierAchieved = 1.0;
    this.finalStopTimer = 0;
    this.setState('START');
    this.dispatchStats();
  }

  public startGame() {
    if (this.state === 'START' || this.state === 'PAUSED') {
      this.setState('RUNNING');
      this.audio.playClick();
    }
  }

  public pauseGame() {
    if (this.state === 'RUNNING') {
      this.setState('PAUSED');
    }
  }

  public resumeGame() {
    if (this.state === 'PAUSED') {
      this.setState('RUNNING');
    }
  }

  public restartLevel() {
    this.loadLevel(this.currentLevelIndex);
  }

  public nextLevel() {
    this.loadLevel(this.currentLevelIndex + 1);
  }

  public toggleSplit() {
    if (this.state !== 'RUNNING') return;
    this.player.toggleSplit();
    this.splitsCount++;
    this.dispatchStats();
  }

  public setSteering(normX: number) {
    if (this.state !== 'RUNNING' && this.state !== 'START') return;
    this.player.setSteering(normX);
  }

  private setState(newState: GameState) {
    this.state = newState;
    if (this.onStateChange) {
      this.onStateChange(newState);
    }
  }

  private loop = () => {
    this.animFrameId = requestAnimationFrame(this.loop);

    const now = performance.now();
    const delta = Math.min((now - this.lastTime) / 1000, 0.08); // cap frame spikes
    this.lastTime = now;
    this.elapsed += delta;

    if (this.state === 'RUNNING') {
      this.updateGame(delta);
    }

    this.particles.update(delta);
    this.updateCamera(delta);
    this.renderer.render(this.scene, this.camera);
  };

  private updateGame(delta: number) {
    // 1. Move Player
    this.player.update(delta, this.forwardSpeed);

    const leadPos = this.player.getLeadingPosition();
    const progress = Math.min(1.0, leadPos.z / this.track.finishZ);
    if (this.onProgressUpdate) {
      this.onProgressUpdate(progress);
    }

    // 2. Obstacles Update & Collision Detection
    this.obstacles.update(delta);

    if (!this.isPastFinish) {
      // Check hazards against every alive cube
      for (const cube of this.player.cubes) {
        if (!cube.alive) continue;
        const hitObs = this.obstacles.checkCollisions(cube.position);
        if (hitObs) {
          this.player.damageCube(cube);
          break;
        }
      }

      // Check if all cubes are dead
      if (!this.player.hasAliveCubes()) {
        this.handleDefeat();
        return;
      }

      // 3. Collectibles Detection
      this.collectibles.update(delta, this.elapsed);
      for (const cube of this.player.cubes) {
        if (!cube.alive) continue;
        const collectible = this.collectibles.checkCollisions(cube.position);
        if (collectible) {
          const res = this.player.absorbCollectible(cube, collectible.value);
          this.collectibles.removeCollectible(collectible);
          this.score += res.points;
          if (res.newValue > this.highestNumber) {
            this.highestNumber = res.newValue;
          }
          if (res.success) {
            this.mergesCount++;
          }
          this.dispatchStats();
        }
      }

      // 4. Check Finish Line Trigger
      if (leadPos.z >= this.track.finishZ) {
        this.isPastFinish = true;
        this.audio.playCheer();
        this.forwardSpeed = BOOST_SPEED; // Boost along multiplier runway!
      }
    } else {
      // Past Finish Line: Multiplier Runway mechanics!
      this.multiplierAchieved = this.track.getMultiplierAtZ(leadPos.z);

      // Decelerate as player runs further along multiplier runway
      this.forwardSpeed = Math.max(3.5, this.forwardSpeed - 5.5 * delta);

      // Stop condition
      if (leadPos.z >= this.track.endOfRunwayZ - 2 || this.forwardSpeed <= 4.0) {
        this.finalStopTimer += delta;
        if (this.finalStopTimer > 0.8) {
          this.handleVictory();
        }
      }
    }
  }

  private handleVictory() {
    this.setState('VICTORY');
    const finalScore = Math.round(this.score * this.multiplierAchieved);
    this.dispatchStats(finalScore);
  }

  private handleDefeat() {
    this.setState('DEFEAT');
    this.dispatchStats();
  }

  private updateCamera(delta: number) {
    const lead = this.player.getLeadingPosition();

    // Smooth camera trailing
    const targetCamX = lead.x * 0.45;
    const targetCamY = 4.6 + (this.isPastFinish ? 1.0 : 0);
    const targetCamZ = lead.z - 7.5;

    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetCamX, 8.0 * delta);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetCamY, 6.0 * delta);
    this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, targetCamZ, 12.0 * delta);

    const lookTarget = new THREE.Vector3(
      lead.x * 0.25,
      1.3,
      lead.z + 5.0
    );
    this.camera.lookAt(lookTarget);
  }

  private dispatchStats(overrideFinalScore?: number) {
    if (this.onStatsUpdate) {
      this.onStatsUpdate({
        score: this.score,
        highestNumber: Math.max(this.highestNumber, this.player.getMaxNumber()),
        mergesCount: this.mergesCount,
        splitsCount: this.splitsCount,
        level: this.currentLevelIndex + 1,
        multiplier: this.multiplierAchieved,
        finalScore: overrideFinalScore !== undefined ? overrideFinalScore : this.score
      });
    }
  }

  private handleResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = Math.max(1, this.container.clientHeight);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    window.removeEventListener('resize', this.handleResize);

    this.player.destroy();
    this.track.destroy();
    this.obstacles.destroy();
    this.collectibles.destroy();
    this.particles.destroy(this.scene);
    this.audio.destroy();
    JellyTextureGenerator.clearCache();

    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
