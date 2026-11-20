import * as THREE from 'three';

interface SplashParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  scale: number;
}

export class ParticleManager {
  public scene: THREE.Group;
  private particles: SplashParticle[] = [];
  private instancedMesh: THREE.InstancedMesh;
  private maxParticles = 300;
  private dummy = new THREE.Object3D();

  constructor() {
    this.scene = new THREE.Group();

    const geom = new THREE.DodecahedronGeometry(0.08, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xE0F2FE,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85
    });

    this.instancedMesh = new THREE.InstancedMesh(geom, mat, this.maxParticles);
    this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(this.instancedMesh);

    // Initialize off-screen
    for (let i = 0; i < this.maxParticles; i++) {
      this.dummy.position.set(0, -999, 0);
      this.dummy.scale.set(0, 0, 0);
      this.dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }

  public emitWaterSplash(position: THREE.Vector3, count: number = 35) {
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift(); // Recycle oldest
      }

      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 4.5;
      const upSpeed = 3.5 + Math.random() * 5.5;

      this.particles.push({
        pos: position.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          0.1,
          (Math.random() - 0.5) * 0.4
        )),
        vel: new THREE.Vector3(
          Math.cos(angle) * speed,
          upSpeed,
          Math.sin(angle) * speed
        ),
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
        scale: 0.8 + Math.random() * 1.2
      });
    }
  }

  public emitDustPuff(position: THREE.Vector3) {
    if (this.particles.length >= this.maxParticles) return;

    for (let i = 0; i < 3; i++) {
      this.particles.push({
        pos: position.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.2,
          0.05,
          (Math.random() - 0.5) * 0.2
        )),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.8,
          0.5 + Math.random() * 0.8,
          (Math.random() - 0.5) * 0.8
        ),
        life: 0,
        maxLife: 0.25 + Math.random() * 0.15,
        scale: 0.4 + Math.random() * 0.3
      });
    }
  }

  public update(dt: number) {
    const gravity = -18.0;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      p.vel.y += gravity * dt;
      p.pos.addScaledVector(p.vel, dt);
    }

    // Update InstancedMesh matrices
    for (let i = 0; i < this.maxParticles; i++) {
      if (i < this.particles.length) {
        const p = this.particles[i];
        const progress = p.life / p.maxLife;
        const s = (1 - progress) * p.scale;

        this.dummy.position.copy(p.pos);
        this.dummy.scale.set(s, s, s);
        this.dummy.updateMatrix();
        this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
      } else {
        this.dummy.position.set(0, -999, 0);
        this.dummy.scale.set(0, 0, 0);
        this.dummy.updateMatrix();
        this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
      }
    }
    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }
}
