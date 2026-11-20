import * as THREE from 'three';
import { JELLY_COLORS, JELLY_BASE_SIZE } from './constants';
import { JellyTextureGenerator } from './TextureGenerator';

export class JellyModelBuilder {
  private static boxGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(
    JELLY_BASE_SIZE,
    JELLY_BASE_SIZE,
    JELLY_BASE_SIZE,
    4,
    4,
    4
  );

  private static shadowGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(
    JELLY_BASE_SIZE * 1.3,
    JELLY_BASE_SIZE * 1.3
  );

  private static shadowMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.35,
    depthWrite: false
  });

  public static createJellyMesh(value: number): THREE.Group {
    const group = new THREE.Group();
    const colorConfig = JELLY_COLORS[value] || JELLY_COLORS[2];
    const texture = JellyTextureGenerator.getCubeTexture(value);

    // Multi-material box so the numbers face front, back, top, left, right
    const faceMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      color: 0xffffff,
      roughness: 0.18,
      metalness: 0.08,
      emissive: new THREE.Color(colorConfig.hex),
      emissiveIntensity: 0.15
    });

    const bodyMesh = new THREE.Mesh(this.boxGeometry, faceMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = false;
    bodyMesh.name = 'jelly_body';
    group.add(bodyMesh);

    // Soft drop shadow plane on track
    const shadowMesh = new THREE.Mesh(this.shadowGeometry, this.shadowMaterial);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -JELLY_BASE_SIZE / 2 + 0.02;
    shadowMesh.name = 'jelly_shadow';
    group.add(shadowMesh);

    group.userData = { value };
    return group;
  }

  public static updateJellyValue(group: THREE.Group, newValue: number) {
    const bodyMesh = group.getObjectByName('jelly_body') as THREE.Mesh;
    if (!bodyMesh) return;

    const colorConfig = JELLY_COLORS[newValue] || JELLY_COLORS[2];
    const texture = JellyTextureGenerator.getCubeTexture(newValue);

    const mat = bodyMesh.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.map = texture;
      mat.emissive = new THREE.Color(colorConfig.hex);
      mat.needsUpdate = true;
    }

    group.userData.value = newValue;
  }
}
