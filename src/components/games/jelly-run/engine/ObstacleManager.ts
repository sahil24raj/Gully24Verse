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
      // Sleek center dividing pillar that forces split
      const postGeo = new THREE.CylinderGeometry(0.24, 0.24, 2.8, 16);
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
      const stripeGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.6, 16);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xFACC15 });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.y = 1.4;
      group.add(stripe);

      // Tight, realistic bounds: leaves massive space on left (down to -3.9) and right (up to +3.9)
      bounds = {
        minX: x - 0.26,
        maxX: x + 0.26,
        minZ: z - 0.35,
        maxZ: z + 0.35
      };
    } else if (type === 'SPINNING_SAW') {
      // Rotating circular saw blade
      const baseGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.2, 8);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.6;
      group.add(base);

      const sawGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.08, 16);
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
        minX: x - 0.82,
        maxX: x + 0.82,
        minZ: z - 0.82,
        maxZ: z + 0.82
      };
    } else if (type === 'SPIKE_BARRIER') {
      // Row of dangerous spikes with clear corridor
      const barGeo = new THREE.BoxGeometry(1.4, 0.2, 0.5);
      const barMat = new THREE.MeshStandardMaterial({ color: 0x0F172A });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.y = 0.1;
      group.add(bar);

      const coneGeo = new THREE.ConeGeometry(0.2, 0.7, 8);
      const coneMat = new THREE.MeshStandardMaterial({
        color: 0xDC2626,
        metalness: 0.6,
        roughness: 0.3
      });

      for (let i = -1; i <= 1; i++) {
        const spike = new THREE.Mesh(coneGeo, coneMat);
        spike.position.set(i * 0.4, 0.45, 0);
        spike.castShadow = true;
        group.add(spike);
      }

      bounds = {
        minX: x - 0.68,
        maxX: x + 0.68,
        minZ: z - 0.4,
        maxZ: z + 0.4
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

  public checkCollisions(cubePos: THREE.Vector3, cubeRadius: number = 0.45): TrackObstacle | null {
    // Forgiving arcade margin (82% of visual radius) for satisfying near-misses
    const r = cubeRadius * 0.82;
    for (const obs of this.obstacles) {
      if (
        cubePos.x + r > obs.bounds.minX &&
        cubePos.x - r < obs.bounds.maxX &&
        cubePos.z + r > obs.bounds.minZ &&
        cubePos.z - r < obs.bounds.maxZ
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
