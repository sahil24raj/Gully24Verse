import * as THREE from 'three';
import { JellyParticle } from './types';

export class JellyParticleManager {
  private particles: JellyParticle[] = [];
  private pointGeometry: THREE.BufferGeometry;
  private pointMaterial: THREE.PointsMaterial;
  private pointsMesh: THREE.Points;
  private maxParticles: number = 250;
  private positions: Float32Array;
  private colors: Float32Array;

  constructor(scene: THREE.Scene) {
    this.positions = new Float32Array(this.maxParticles * 3);
    this.colors = new Float32Array(this.maxParticles * 3);

    this.pointGeometry = new THREE.BufferGeometry();
    this.pointGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.pointGeometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    this.pointMaterial = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.pointsMesh = new THREE.Points(this.pointGeometry, this.pointMaterial);
    scene.add(this.pointsMesh);
  }

  public emitMergeBurst(origin: THREE.Vector3, hexColor: number, count: number = 30) {
    const baseColor = new THREE.Color(hexColor);
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 2.5 + Math.random() * 4.0;

      this.particles.push({
        position: origin.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        )),
        velocity: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.abs(Math.cos(phi)) * speed + 1.5,
          Math.sin(phi) * Math.sin(theta) * speed
        ),
        color: baseColor.getHexString(),
        size: 0.25 + Math.random() * 0.2,
        alpha: 1.0,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4
      });
    }
  }

  public emitSplitBurst(origin: THREE.Vector3, count: number = 15) {
    const cyan = new THREE.Color(0x38BDF8);
    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }
      this.particles.push({
        position: origin.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 4.0,
          Math.random() * 2.5 + 0.5,
          (Math.random() - 0.5) * 2.0
        ),
        color: cyan.getHexString(),
        size: 0.2,
        alpha: 0.85,
        life: 0,
        maxLife: 0.45
      });
    }
  }

  public emitHazardBurst(origin: THREE.Vector3) {
    const red = new THREE.Color(0xEF4444);
    for (let i = 0; i < 25; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift();
      }
      this.particles.push({
        position: origin.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 6.0,
          Math.random() * 5.0 + 1.0,
          (Math.random() - 0.5) * 6.0
        ),
        color: red.getHexString(),
        size: 0.3,
        alpha: 1.0,
        life: 0,
        maxLife: 0.5
      });
    }
  }

  public update(delta: number) {
    let activeCount = 0;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += delta;

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      // Physics
      p.velocity.y -= 9.8 * delta; // gravity
      p.position.addScaledVector(p.velocity, delta);

      const color = new THREE.Color(`#${p.color}`);
      const fade = 1 - p.life / p.maxLife;

      this.positions[activeCount * 3] = p.position.x;
      this.positions[activeCount * 3 + 1] = p.position.y;
      this.positions[activeCount * 3 + 2] = p.position.z;

      this.colors[activeCount * 3] = color.r * fade;
      this.colors[activeCount * 3 + 1] = color.g * fade;
      this.colors[activeCount * 3 + 2] = color.b * fade;

      activeCount++;
    }

    // Zero out unused slots
    for (let i = activeCount; i < this.maxParticles; i++) {
      this.positions[i * 3] = 0;
      this.positions[i * 3 + 1] = -999;
      this.positions[i * 3 + 2] = 0;
    }

    this.pointGeometry.attributes.position.needsUpdate = true;
    this.pointGeometry.attributes.color.needsUpdate = true;
  }

  public destroy(scene: THREE.Scene) {
    scene.remove(this.pointsMesh);
    this.pointGeometry.dispose();
    this.pointMaterial.dispose();
    this.particles = [];
  }
}
