import * as THREE from 'three';
import { CollectibleItem, LevelConfig } from './types';
import { JELLY_BASE_SIZE, JELLY_Y_POS } from './constants';
import { JellyModelBuilder } from './JellyModelBuilder';

export class JellyCollectibleManager {
  private scene: THREE.Scene;
  public collectibles: CollectibleItem[] = [];
  private itemGroup: THREE.Group = new THREE.Group();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.scene.add(this.itemGroup);
  }

  public populate(config: LevelConfig) {
    this.clear();

    config.collectibles.forEach((item, idx) => {
      const mesh = JellyModelBuilder.createJellyMesh(item.value);
      mesh.scale.set(0.9, 0.9, 0.9);
      mesh.position.set(item.x, JELLY_Y_POS, item.z);

      const collectible: CollectibleItem = {
        id: `coll_${idx}_${item.value}`,
        value: item.value,
        position: new THREE.Vector3(item.x, JELLY_Y_POS, item.z),
        mesh,
        collected: false,
        baseY: JELLY_Y_POS,
        floatOffset: Math.random() * Math.PI * 2
      };

      this.collectibles.push(collectible);
      this.itemGroup.add(mesh);
    });
  }

  public update(delta: number, elapsed: number) {
    this.collectibles.forEach((c) => {
      if (c.collected) return;

      // Gentle floating animation
      c.mesh.position.y = c.baseY + Math.sin(elapsed * 3.0 + c.floatOffset) * 0.12;
      // Slow inviting rotation
      c.mesh.rotation.y += delta * 1.5;
    });
  }

  public checkCollisions(cubePos: THREE.Vector3, cubeRadius: number = 0.65): CollectibleItem | null {
    for (const c of this.collectibles) {
      if (c.collected) continue;

      const dx = cubePos.x - c.position.x;
      const dz = cubePos.z - c.position.z;
      const distSq = dx * dx + dz * dz;

      if (distSq < (cubeRadius + 0.5) * (cubeRadius + 0.5)) {
        return c;
      }
    }
    return null;
  }

  public removeCollectible(c: CollectibleItem) {
    c.collected = true;
    this.itemGroup.remove(c.mesh);
  }

  public clear() {
    while (this.itemGroup.children.length > 0) {
      const obj = this.itemGroup.children[0];
      this.itemGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
      }
    }
    this.collectibles = [];
  }

  public destroy() {
    this.clear();
    this.scene.remove(this.itemGroup);
  }
}
