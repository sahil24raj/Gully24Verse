import * as THREE from 'three';

export interface CharacterRig {
  root: THREE.Group;
  head: THREE.Mesh;
  torso: THREE.Mesh;
  pelvis: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftForearm: THREE.Mesh;
  rightForearm: THREE.Mesh;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftShin: THREE.Mesh;
  rightShin: THREE.Mesh;
  color: THREE.Color;
  material: THREE.MeshStandardMaterial;
  runCycle: number;
  idleCycle: number;
}

export function createProceduralCharacter(colorHex: string, scale: number = 1.0): CharacterRig {
  const root = new THREE.Group();
  const color = new THREE.Color(colorHex);

  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.35,
    metalness: 0.1,
    flatShading: false
  });

  const jointMaterial = new THREE.MeshStandardMaterial({
    color: color.clone().offsetHSL(0, 0, -0.15),
    roughness: 0.4,
    metalness: 0.1
  });

  // 1. Pelvis / Hips (Center of character)
  const pelvis = new THREE.Group();
  pelvis.position.y = 0.85 * scale;
  root.add(pelvis);

  const hipMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.22 * scale, 16, 16),
    material
  );
  hipMesh.scale.set(1.1, 0.9, 0.9);
  pelvis.add(hipMesh);

  // 2. Torso (Spine)
  const torsoGeom = new THREE.CylinderGeometry(0.24 * scale, 0.19 * scale, 0.55 * scale, 16);
  const torso = new THREE.Mesh(torsoGeom, material);
  torso.position.y = 0.35 * scale;
  torso.castShadow = true;
  torso.receiveShadow = true;
  pelvis.add(torso);

  // 3. Head & Neck
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.48 * scale;
  torso.add(headGroup);

  const headMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.24 * scale, 18, 18),
    material
  );
  headMesh.scale.set(0.95, 1.05, 0.95);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Stylized headband / glasses visor accent
  const visorGeom = new THREE.BoxGeometry(0.32 * scale, 0.08 * scale, 0.15 * scale);
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.2,
    metalness: 0.8
  });
  const visor = new THREE.Mesh(visorGeom, visorMat);
  visor.position.set(0, 0.02 * scale, 0.16 * scale);
  headGroup.add(visor);

  // 4. Arms
  // Left Arm
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.32 * scale, 0.22 * scale, 0);
  torso.add(leftArm);

  const upperArmGeom = new THREE.CylinderGeometry(0.08 * scale, 0.07 * scale, 0.32 * scale, 12);
  const leftUpperArmMesh = new THREE.Mesh(upperArmGeom, material);
  leftUpperArmMesh.position.y = -0.16 * scale;
  leftArm.add(leftUpperArmMesh);

  const leftElbow = new THREE.Mesh(new THREE.SphereGeometry(0.08 * scale, 12, 12), jointMaterial);
  leftElbow.position.y = -0.32 * scale;
  leftArm.add(leftElbow);

  const forearmGeom = new THREE.CylinderGeometry(0.07 * scale, 0.06 * scale, 0.3 * scale, 12);
  const leftForearm = new THREE.Mesh(forearmGeom, material);
  leftForearm.position.y = -0.16 * scale;
  leftElbow.add(leftForearm);

  // Right Arm
  const rightArm = new THREE.Group();
  rightArm.position.set(0.32 * scale, 0.22 * scale, 0);
  torso.add(rightArm);

  const rightUpperArmMesh = new THREE.Mesh(upperArmGeom, material);
  rightUpperArmMesh.position.y = -0.16 * scale;
  rightArm.add(rightUpperArmMesh);

  const rightElbow = new THREE.Mesh(new THREE.SphereGeometry(0.08 * scale, 12, 12), jointMaterial);
  rightElbow.position.y = -0.32 * scale;
  rightArm.add(rightElbow);

  const rightForearm = new THREE.Mesh(forearmGeom, material);
  rightForearm.position.y = -0.16 * scale;
  rightElbow.add(rightForearm);

  // 5. Legs
  const legGeom = new THREE.CylinderGeometry(0.1 * scale, 0.08 * scale, 0.42 * scale, 12);
  const shinGeom = new THREE.CylinderGeometry(0.08 * scale, 0.06 * scale, 0.44 * scale, 12);
  const footGeom = new THREE.BoxGeometry(0.14 * scale, 0.1 * scale, 0.26 * scale);

  // Left Leg
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.16 * scale, -0.08 * scale, 0);
  pelvis.add(leftLeg);

  const leftThigh = new THREE.Mesh(legGeom, material);
  leftThigh.position.y = -0.21 * scale;
  leftThigh.castShadow = true;
  leftLeg.add(leftThigh);

  const leftKnee = new THREE.Group();
  leftKnee.position.y = -0.42 * scale;
  leftLeg.add(leftKnee);

  const leftShin = new THREE.Mesh(shinGeom, material);
  leftShin.position.y = -0.22 * scale;
  leftShin.castShadow = true;
  leftKnee.add(leftShin);

  const leftFoot = new THREE.Mesh(footGeom, jointMaterial);
  leftFoot.position.set(0, -0.24 * scale, 0.06 * scale);
  leftKnee.add(leftFoot);

  // Right Leg
  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.16 * scale, -0.08 * scale, 0);
  pelvis.add(rightLeg);

  const rightThigh = new THREE.Mesh(legGeom, material);
  rightThigh.position.y = -0.21 * scale;
  rightThigh.castShadow = true;
  rightLeg.add(rightThigh);

  const rightKnee = new THREE.Group();
  rightKnee.position.y = -0.42 * scale;
  rightLeg.add(rightKnee);

  const rightShin = new THREE.Mesh(shinGeom, material);
  rightShin.position.y = -0.22 * scale;
  rightShin.castShadow = true;
  rightKnee.add(rightShin);

  const rightFoot = new THREE.Mesh(footGeom, jointMaterial);
  rightFoot.position.set(0, -0.24 * scale, 0.06 * scale);
  rightKnee.add(rightFoot);

  // Shadow casting on all parts
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  return {
    root,
    head: headMesh,
    torso,
    pelvis,
    leftArm,
    rightArm,
    leftForearm,
    rightForearm,
    leftLeg,
    rightLeg,
    leftShin,
    rightShin,
    color,
    material,
    runCycle: 0,
    idleCycle: 0
  };
}

export function animateCharacter(
  rig: CharacterRig,
  state: 'IDLE' | 'RUNNING' | 'KNOCKED_OUT' | 'RESPAWNING' | 'FINISHED',
  dt: number,
  speed: number = 1.0
) {
  if (state === 'RUNNING') {
    rig.runCycle += dt * 14.0 * Math.max(0.4, speed);
    const cycle = rig.runCycle;

    // Pelvis bounce and slight roll
    rig.pelvis.position.y = 0.85 + Math.abs(Math.sin(cycle)) * 0.12;
    rig.torso.rotation.x = 0.22; // Lean forward
    rig.torso.rotation.y = Math.sin(cycle) * 0.12;

    // Leg stride swings
    const legAngle = Math.sin(cycle) * 0.85;
    rig.leftLeg.rotation.x = legAngle;
    rig.rightLeg.rotation.x = -legAngle;

    // Knees bend during backswing
    (rig.leftLeg.children[1] as THREE.Group).rotation.x = legAngle < 0 ? Math.abs(legAngle) * 1.2 : 0.1;
    (rig.rightLeg.children[1] as THREE.Group).rotation.x = -legAngle < 0 ? Math.abs(legAngle) * 1.2 : 0.1;

    // Counter-swinging arms
    rig.leftArm.rotation.x = -legAngle * 0.9;
    rig.rightArm.rotation.x = legAngle * 0.9;
    rig.leftArm.rotation.z = -0.15;
    rig.rightArm.rotation.z = 0.15;

    // Elbows bent at 70-90 degrees
    rig.leftForearm.parent!.rotation.x = 0.8;
    rig.rightForearm.parent!.rotation.x = 0.8;
  } else if (state === 'IDLE') {
    rig.idleCycle += dt * 3.5;
    const cycle = rig.idleCycle;

    // Gentle breathing
    rig.pelvis.position.y = 0.85 + Math.sin(cycle) * 0.02;
    rig.torso.rotation.x = 0.04;
    rig.torso.rotation.y = 0;

    // Arms relaxed at sides
    rig.leftArm.rotation.x = Math.sin(cycle) * 0.05;
    rig.rightArm.rotation.x = -Math.sin(cycle) * 0.05;
    rig.leftArm.rotation.z = -0.15;
    rig.rightArm.rotation.z = 0.15;
    rig.leftForearm.parent!.rotation.x = 0.2;
    rig.rightForearm.parent!.rotation.x = 0.2;

    // Legs straight
    rig.leftLeg.rotation.x = 0;
    rig.rightLeg.rotation.x = 0;
    (rig.leftLeg.children[1] as THREE.Group).rotation.x = 0;
    (rig.rightLeg.children[1] as THREE.Group).rotation.x = 0;
  } else if (state === 'FINISHED') {
    // Victory celebration dance
    rig.idleCycle += dt * 6.0;
    const cycle = rig.idleCycle;

    rig.pelvis.position.y = 0.85 + Math.abs(Math.sin(cycle)) * 0.25;
    rig.torso.rotation.x = -0.1;

    // Arms raised in victory V
    rig.leftArm.rotation.x = -2.6 + Math.sin(cycle) * 0.2;
    rig.rightArm.rotation.x = -2.6 - Math.sin(cycle) * 0.2;
    rig.leftArm.rotation.z = -0.6;
    rig.rightArm.rotation.z = 0.6;

    rig.leftLeg.rotation.x = Math.sin(cycle) * 0.3;
    rig.rightLeg.rotation.x = -Math.sin(cycle) * 0.3;
  } else if (state === 'KNOCKED_OUT') {
    // Limbs flailing in flight
    rig.torso.rotation.x = 0.4;
    rig.leftArm.rotation.x = 1.8;
    rig.rightArm.rotation.x = -1.8;
    rig.leftLeg.rotation.x = 0.9;
    rig.rightLeg.rotation.x = -0.9;
  }
}
