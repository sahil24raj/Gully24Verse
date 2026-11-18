import * as THREE from 'three';
import { ColorType } from './types';
import { COLOR_DEFINITIONS } from './constants';

export class PlayerCharacter {
  public group: THREE.Group = new THREE.Group();
  public material: THREE.MeshStandardMaterial;

  // Body parts for procedural animation
  private head: THREE.Mesh;
  private torso: THREE.Mesh;
  private leftArm: THREE.Group = new THREE.Group();
  private rightArm: THREE.Group = new THREE.Group();
  private leftLeg: THREE.Group = new THREE.Group();
  private rightLeg: THREE.Group = new THREE.Group();
  private rightFist: THREE.Mesh;

  // Animation states
  private runCycleTime: number = 0;
  private squashStretchTimer: number = 0;
  public punchTimer: number = 0;

  constructor(initialColor: ColorType = 'red') {
    const colorDef = COLOR_DEFINITIONS[initialColor];

    this.material = new THREE.MeshStandardMaterial({
      color: colorDef.hex,
      roughness: 0.25,
      metalness: 0.15,
      emissive: colorDef.emissiveHex,
      emissiveIntensity: 0.35
    });

    const darkMaterial = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.6
    });

    // 1. Torso (muscular athletic runner)
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.26, 0.9, 12);
    this.torso = new THREE.Mesh(torsoGeo, this.material);
    this.torso.position.y = 1.35;
    this.torso.castShadow = true;
    this.group.add(this.torso);

    // 2. Head with runner headband/visor
    const headGeo = new THREE.SphereGeometry(0.32, 16, 16);
    this.head = new THREE.Mesh(headGeo, this.material);
    this.head.position.y = 2.05;
    this.head.castShadow = true;
    this.group.add(this.head);

    // Visor / Face mask
    const visorGeo = new THREE.BoxGeometry(0.42, 0.12, 0.25);
    const visor = new THREE.Mesh(visorGeo, darkMaterial);
    visor.position.set(0, 2.05, 0.22);
    this.group.add(visor);

    // 3. Left Arm
    const shoulderGeo = new THREE.SphereGeometry(0.14, 8, 8);
    const armBicepGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.5, 8);
    const armForearmGeo = new THREE.CylinderGeometry(0.1, 0.11, 0.5, 8);
    const fistGeo = new THREE.SphereGeometry(0.15, 8, 8);

    const leftShoulder = new THREE.Mesh(shoulderGeo, this.material);
    const leftBicep = new THREE.Mesh(armBicepGeo, this.material);
    leftBicep.position.y = -0.25;
    const leftForearm = new THREE.Mesh(armForearmGeo, this.material);
    leftForearm.position.y = -0.7;
    const leftFist = new THREE.Mesh(fistGeo, this.material);
    leftFist.position.y = -1.0;

    this.leftArm.add(leftShoulder, leftBicep, leftForearm, leftFist);
    this.leftArm.position.set(-0.52, 1.7, 0);
    this.group.add(this.leftArm);

    // 4. Right Arm (The PUNCH Arm)
    const rightShoulder = new THREE.Mesh(shoulderGeo, this.material);
    const rightBicep = new THREE.Mesh(armBicepGeo, this.material);
    rightBicep.position.y = -0.25;
    const rightForearm = new THREE.Mesh(armForearmGeo, this.material);
    rightForearm.position.y = -0.7;
    this.rightFist = new THREE.Mesh(fistGeo, this.material);
    this.rightFist.position.y = -1.0;
    this.rightFist.castShadow = true;

    this.rightArm.add(rightShoulder, rightBicep, rightForearm, this.rightFist);
    this.rightArm.position.set(0.52, 1.7, 0);
    this.group.add(this.rightArm);

    // 5. Left Leg
    const legThighGeo = new THREE.CylinderGeometry(0.15, 0.13, 0.55, 8);
    const legShinGeo = new THREE.CylinderGeometry(0.13, 0.12, 0.55, 8);
    const shoeGeo = new THREE.BoxGeometry(0.22, 0.14, 0.4);

    const leftThigh = new THREE.Mesh(legThighGeo, this.material);
    leftThigh.position.y = -0.28;
    const leftShin = new THREE.Mesh(legShinGeo, this.material);
    leftShin.position.y = -0.8;
    const leftShoe = new THREE.Mesh(shoeGeo, darkMaterial);
    leftShoe.position.set(0, -1.1, 0.08);

    this.leftLeg.add(leftThigh, leftShin, leftShoe);
    this.leftLeg.position.set(-0.24, 1.1, 0);
    this.group.add(this.leftLeg);

    // 6. Right Leg
    const rightThigh = new THREE.Mesh(legThighGeo, this.material);
    rightThigh.position.y = -0.28;
    const rightShin = new THREE.Mesh(legShinGeo, this.material);
    rightShin.position.y = -0.8;
    const rightShoe = new THREE.Mesh(shoeGeo, darkMaterial);
    rightShoe.position.set(0, -1.1, 0.08);

    this.rightLeg.add(rightThigh, rightShin, rightShoe);
    this.rightLeg.position.set(0.24, 1.1, 0);
    this.group.add(this.rightLeg);
  }

  public setColor(color: ColorType): void {
    const colorDef = COLOR_DEFINITIONS[color];
    this.material.color.setHex(colorDef.hex);
    this.material.emissive.setHex(colorDef.emissiveHex);
  }

  public triggerSquashStretch(): void {
    this.squashStretchTimer = 0.18;
  }

  public triggerPunch(): void {
    this.punchTimer = 0.75;
  }

  public update(delta: number, isRunning: boolean, currentScale: number): void {
    // 1. Dynamic Mesh Scaling with Squash & Stretch
    let scaleX = currentScale;
    let scaleY = currentScale;
    let scaleZ = currentScale;

    if (this.squashStretchTimer > 0) {
      this.squashStretchTimer -= delta;
      const progress = Math.max(0, this.squashStretchTimer / 0.18);
      // Squash & stretch pulse: expands tall, snaps back
      scaleY *= 1 + progress * 0.22;
      scaleX *= 1 - progress * 0.12;
      scaleZ *= 1 - progress * 0.12;
    }

    this.group.scale.set(scaleX, scaleY, scaleZ);

    // 2. Procedural Running Animation Loop
    if (isRunning && this.punchTimer <= 0) {
      this.runCycleTime += delta * 14.0;
      const swing = Math.sin(this.runCycleTime);

      // Legs swing back and forth
      this.leftLeg.rotation.x = swing * 0.85;
      this.rightLeg.rotation.x = -swing * 0.85;

      // Arms swing in opposite phase to legs
      this.leftArm.rotation.x = -swing * 0.85;
      this.rightArm.rotation.x = swing * 0.85;

      // Subtle torso bob & bounce
      this.torso.position.y = 1.35 + Math.abs(Math.sin(this.runCycleTime * 2)) * 0.06;
      this.head.position.y = 2.05 + Math.abs(Math.sin(this.runCycleTime * 2)) * 0.06;
    } else if (this.punchTimer > 0) {
      // 3. Titan Punch Animation
      this.punchTimer -= delta;
      const pRatio = 1 - Math.max(0, this.punchTimer / 0.75);

      if (pRatio < 0.35) {
        // Wind-up: pull right arm back, lean torso back
        const windProgress = pRatio / 0.35;
        this.rightArm.rotation.x = -Math.PI * 0.65 * windProgress;
        this.rightArm.rotation.z = Math.PI * 0.35 * windProgress;
        this.torso.rotation.y = -0.4 * windProgress;
      } else if (pRatio < 0.65) {
        // Slam forward: colossal punch straight ahead
        const strikeProgress = (pRatio - 0.35) / 0.3;
        this.rightArm.rotation.x = Math.PI * 0.55 * strikeProgress;
        this.rightArm.rotation.z = 0;
        this.torso.rotation.y = 0.5 * strikeProgress;
      } else {
        // Recovery
        const recProgress = (pRatio - 0.65) / 0.35;
        this.rightArm.rotation.x = Math.PI * 0.55 * (1 - recProgress);
        this.torso.rotation.y = 0.5 * (1 - recProgress);
      }
    } else {
      // Idle pose
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.leftArm.rotation.x = 0;
      this.rightArm.rotation.x = 0;
      this.torso.rotation.y = 0;
    }
  }
}
