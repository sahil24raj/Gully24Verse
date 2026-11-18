import * as THREE from 'three';
import { BossEntity, LevelConfig } from './types';
import { COLOR_DEFINITIONS, MULTIPLIERS } from './constants';
import { AudioEffects } from './AudioEffects';

export class BossCombatManager {
  public group: THREE.Group = new THREE.Group();
  public boss: BossEntity | null = null;
  public bossMesh: THREE.Group = new THREE.Group();

  // QTE State
  public qteTimeRemaining: number = 3.0;
  public qteTaps: number = 0;
  public powerRatio: number = 1.0;
  public isQteActive: boolean = false;

  // Launch Ragdoll state
  public isLaunching: boolean = false;
  private launchOriginZ: number = 0;

  constructor() {
    this.group.add(this.bossMesh);
  }

  public spawnBoss(level: LevelConfig, arenaZ: number): void {
    this.launchOriginZ = arenaZ;

    this.boss = {
      name: `Titan Lord (Lvl ${level.levelNum})`,
      level: level.levelNum,
      maxHp: level.bossHp,
      currentHp: level.bossHp,
      scale: level.bossScale,
      color: level.bossColor,
      x: 0,
      y: 0,
      z: arenaZ,
      isKnockedOut: false,
      launchVx: 0,
      launchVy: 0,
      launchVz: 0,
      launchDistance: 0
    };

    this.buildBossModel();
  }

  private buildBossModel(): void {
    while (this.bossMesh.children.length > 0) {
      this.bossMesh.remove(this.bossMesh.children[0]);
    }

    if (!this.boss) return;

    const colorDef = COLOR_DEFINITIONS[this.boss.color];

    const bodyMat = new THREE.MeshStandardMaterial({
      color: colorDef.hex,
      roughness: 0.35,
      metalness: 0.3,
      emissive: colorDef.emissiveHex,
      emissiveIntensity: 0.4
    });

    const darkArmorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.5,
      metalness: 0.7
    });

    // 1. Massive Colossal Torso
    const torsoGeo = new THREE.CylinderGeometry(0.7, 0.45, 1.4, 12);
    const torso = new THREE.Mesh(torsoGeo, bodyMat);
    torso.position.y = 2.0;
    torso.castShadow = true;

    // Shoulder Armor Pads
    const shoulderPadGeo = new THREE.BoxGeometry(0.65, 0.35, 0.55);
    const leftPad = new THREE.Mesh(shoulderPadGeo, darkArmorMat);
    leftPad.position.set(-0.85, 2.5, 0);
    const rightPad = new THREE.Mesh(shoulderPadGeo, darkArmorMat);
    rightPad.position.set(0.85, 2.5, 0);

    // 2. Colossal Head with Crown/Horns
    const headGeo = new THREE.SphereGeometry(0.5, 14, 14);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.y = 3.0;

    const crownGeo = new THREE.ConeGeometry(0.2, 0.6, 6);
    const hornL = new THREE.Mesh(crownGeo, darkArmorMat);
    hornL.position.set(-0.35, 3.45, 0);
    hornL.rotation.z = 0.35;
    const hornR = new THREE.Mesh(crownGeo, darkArmorMat);
    hornR.position.set(0.35, 3.45, 0);
    hornR.rotation.z = -0.35;

    // Glowing Menacing Eyes
    const eyeGeo = new THREE.BoxGeometry(0.18, 0.08, 0.2);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.18, 3.05, 0.42);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.18, 3.05, 0.42);

    // 3. Heavy Brawny Arms
    const armGeo = new THREE.CylinderGeometry(0.25, 0.22, 1.1, 8);
    const fistGeo = new THREE.SphereGeometry(0.32, 8, 8);

    const armL = new THREE.Mesh(armGeo, bodyMat);
    armL.position.set(-0.85, 1.5, 0);
    const fistL = new THREE.Mesh(fistGeo, darkArmorMat);
    fistL.position.set(-0.85, 0.8, 0);

    const armR = new THREE.Mesh(armGeo, bodyMat);
    armR.position.set(0.85, 1.5, 0);
    const fistR = new THREE.Mesh(fistGeo, darkArmorMat);
    fistR.position.set(0.85, 0.8, 0);

    // 4. Sturdy Pillar Legs
    const legGeo = new THREE.CylinderGeometry(0.28, 0.24, 1.5, 8);
    const legL = new THREE.Mesh(legGeo, darkArmorMat);
    legL.position.set(-0.45, 0.75, 0);
    const legR = new THREE.Mesh(legGeo, darkArmorMat);
    legR.position.set(0.45, 0.75, 0);

    this.bossMesh.add(
      torso,
      leftPad,
      rightPad,
      head,
      hornL,
      hornR,
      eyeL,
      eyeR,
      armL,
      fistL,
      armR,
      fistR,
      legL,
      legR
    );

    const s = this.boss.scale;
    this.bossMesh.scale.set(s, s, s);
    this.bossMesh.position.set(this.boss.x, 0, this.boss.z);
    // Face the incoming player
    this.bossMesh.rotation.y = Math.PI;
  }

  public startQte(): void {
    this.isQteActive = true;
    this.qteTimeRemaining = 3.0;
    this.qteTaps = 0;
    this.powerRatio = 1.0;
  }

  public registerTap(): void {
    if (!this.isQteActive) return;
    this.qteTaps++;
    // Each rapid tap adds to power ratio (max 2.2x)
    this.powerRatio = Math.min(2.2, 1.0 + this.qteTaps * 0.08);
  }

  public executePunch(playerPower: number): { isVictory: boolean; damageDealt: number } {
    this.isQteActive = false;
    if (!this.boss) return { isVictory: false, damageDealt: 0 };

    const damageDealt = Math.round(playerPower * this.powerRatio);
    this.boss.currentHp = Math.max(0, this.boss.currentHp - damageDealt);

    const isVictory = this.boss.currentHp <= 0;

    AudioEffects.playPunchImpact(this.powerRatio);

    if (isVictory) {
      this.boss.isKnockedOut = true;
      this.isLaunching = true;

      // Calculate initial ragdoll launch velocity
      const powerFactor = Math.sqrt(damageDealt / 20);
      this.boss.launchVy = 16.0 + powerFactor * 3.5;
      this.boss.launchVz = 24.0 + powerFactor * 6.5;
    }

    return { isVictory, damageDealt };
  }

  public getEarnedMultiplier(): { mult: number; label: string } {
    if (!this.boss) return { mult: 1.2, label: '1.2x' };
    const dist = this.boss.launchDistance;

    for (let i = MULTIPLIERS.length - 1; i >= 0; i--) {
      if (dist >= MULTIPLIERS[i].minDistance) {
        return { mult: MULTIPLIERS[i].mult, label: MULTIPLIERS[i].label };
      }
    }
    return { mult: 1.2, label: '1.2x' };
  }

  public update(delta: number): void {
    if (!this.boss) return;

    if (this.isQteActive) {
      this.qteTimeRemaining = Math.max(0, this.qteTimeRemaining - delta);
    }

    // Menacing Idle Animation when standing in arena
    if (!this.isLaunching && !this.boss.isKnockedOut) {
      const t = performance.now() * 0.003;
      // Menacing chest heave and ground pulse
      this.bossMesh.position.y = Math.sin(t * 2.5) * 0.1 * this.boss.scale;
      this.bossMesh.rotation.y = Math.PI + Math.sin(t * 1.5) * 0.08;
    }

    // Ragdoll Launch Simulation
    if (this.isLaunching) {
      this.boss.y += this.boss.launchVy * delta;
      this.boss.z += this.boss.launchVz * delta;

      // Gravity pulls boss down
      this.boss.launchVy -= 28.0 * delta;

      // Ragdoll tumble rotation
      this.bossMesh.rotation.x += 12.0 * delta;
      this.bossMesh.rotation.z += 8.0 * delta;

      // Ground bounce & friction
      if (this.boss.y <= 0) {
        this.boss.y = 0;
        this.boss.launchVy = -this.boss.launchVy * 0.35; // Bouncy ground bounce
        this.boss.launchVz *= 0.88; // Ground friction

        // Came to stop
        if (Math.abs(this.boss.launchVy) < 1.0 && this.boss.launchVz < 1.5) {
          this.isLaunching = false;
          this.boss.launchVy = 0;
          this.boss.launchVz = 0;
          AudioEffects.playVictory();
        }
      }

      this.boss.launchDistance = Math.max(0, this.boss.z - this.launchOriginZ);
      this.bossMesh.position.set(this.boss.x, this.boss.y, this.boss.z);
    }
  }

  public resetBoss(): void {
    this.isQteActive = false;
    this.isLaunching = false;
    this.qteTimeRemaining = 3.0;
    this.qteTaps = 0;
    this.powerRatio = 1.0;
    if (this.boss) {
      this.boss.currentHp = this.boss.maxHp;
      this.boss.isKnockedOut = false;
      this.boss.launchDistance = 0;
      this.boss.launchVy = 0;
      this.boss.launchVz = 0;
      this.boss.y = 0;
      this.boss.z = this.launchOriginZ;
      this.bossMesh.position.set(0, 0, this.launchOriginZ);
      this.bossMesh.rotation.set(0, Math.PI, 0);
    }
  }
}
