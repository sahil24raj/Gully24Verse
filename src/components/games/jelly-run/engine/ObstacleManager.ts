import * as THREE from 'three';
import { TrackObstacle, ObstacleType, LevelConfig } from './types';

export class JellyObstacleManager {
  private scene: THREE.Scene;
  public obstacles: TrackObstacle[] = [];
  private obstacleGroup: THREE.Group = new THREE.Group();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.scene.add(this.obstacleGroup);
  }

  public populate(config: LevelConfig) {
    this.clear();

    config.obstacles.forEach((obsData, idx) => {
      const obstacle = this.createObstacle(obsData.type, obsData.x, obsData.z, `obs_${idx}`);
      this.obstacles.push(obstacle);
      this.obstacleGroup.add(obstacle.mesh);
    });
  }

  private createObstacle(type: ObstacleType, x: number, z: number, id: string): TrackObstacle {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    let bounds = { minX: x - 0.5, maxX: x + 0.5, minZ: z - 0.5, maxZ: z + 0.5 };
    let rotationSpeed = 0;

    if (type === 'DIVIDER') {
      // Center dividing post that requires splitting
      const postGeo = new THREE.CylinderGeometry(0.45, 0.45, 2.8, 16);
      const postMat = new THREE.MeshStandardMaterial({
        color: 0x1E293B,
        roughness: 0.3,
        metalness: 0.7
      });
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.y = 1.4;
      post.castShadow = true;
      group.add(post);

      // Warning hazard stripes on divider
      const stripeGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.6, 16);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xFACC15 });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.y = 1.4;
      group.add(stripe);

      bounds = {
        minX: x - 0.5,
        maxX: x + 0.5,
        minZ: z - 0.6,
        maxZ: z + 0.6
      };
    } else if (type === 'SPINNING_SAW') {
      // Rotating circular saw blade
      const baseGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 8);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.6;
      group.add(base);

      const sawGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.08, 16);
      const sawMat = new THREE.MeshStandardMaterial({
        color: 0xEF4444,
        roughness: 0.2,
        metalness: 0.9,
        emissive: 0x991B1B,
        emissiveIntensity: 0.4
      });
      const saw = new THREE.Mesh(sawGeo, sawMat);
      saw.name = 'rotating_saw';
      saw.position.y = 0.8;
      group.add(saw);

      rotationSpeed = 8.0;
      bounds = {
        minX: x - 1.05,
        maxX: x + 1.05,
        minZ: z - 1.05,
        maxZ: z + 1.05
      };
    } else if (type === 'SPIKE_BARRIER') {
      // Row of dangerous spikes
      const barGeo = new THREE.BoxGeometry(1.8, 0.2, 0.6);
      const barMat = new THREE.MeshStandardMaterial({ color: 0x0F172A });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.y = 0.1;
      group.add(bar);

      const coneGeo = new THREE.ConeGeometry(0.25, 0.8, 8);
      const coneMat = new THREE.MeshStandardMaterial({
        color: 0xDC2626,
        metalness: 0.6,
        roughness: 0.3
      });

      for (let i = -2; i <= 2; i++) {
        const spike = new THREE.Mesh(coneGeo, coneMat);
        spike.position.set(i * 0.38, 0.5, 0);
        spike.castShadow = true;
        group.add(spike);
      }

      bounds = {
        minX: x - 0.95,
        maxX: x + 0.95,
        minZ: z - 0.5,
        maxZ: z + 0.5
      };
    }

    return {
      id,
      type,
      position: new THREE.Vector3(x, 0, z),
      mesh: group,
      rotationSpeed,
      bounds
    };
  }

  public update(delta: number) {
    this.obstacles.forEach((obs) => {
      if (obs.rotationSpeed) {
        const saw = obs.mesh.getObjectByName('rotating_saw');
        if (saw) {
          saw.rotation.y += obs.rotationSpeed * delta;
        }
      }
    });
  }

  public checkCollisions(cubePos: THREE.Vector3, cubeRadius: number = 0.55): TrackObstacle | null {
    for (const obs of this.obstacles) {
      if (
        cubePos.x + cubeRadius > obs.bounds.minX &&
        cubePos.x - cubeRadius < obs.bounds.maxX &&
        cubePos.z + cubeRadius > obs.bounds.minZ &&
        cubePos.z - cubeRadius < obs.bounds.maxZ
      ) {
        return obs;
      }
    }
    return null;
  }

  public clear() {
    while (this.obstacleGroup.children.length > 0) {
      const obj = this.obstacleGroup.children[0];
      this.obstacleGroup.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
      }
    }
    this.obstacles = [];
  }

  public destroy() {
    this.clear();
    this.scene.remove(this.obstacleGroup);
  }
}
