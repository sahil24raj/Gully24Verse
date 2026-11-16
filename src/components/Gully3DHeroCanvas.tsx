'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const Gully3DHeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x101014, 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.8, 7.5);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      container.appendChild(renderer.domElement);
    } catch {
      setWebGlSupported(false);
      return;
    }

    // 2. Lighting setup (Desi Street Glow)
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.6);
    scene.add(ambientLight);

    // Warm Saffron street lantern light
    const saffronPoint = new THREE.PointLight(0xff9f1c, 4.5, 18);
    saffronPoint.position.set(-2.5, 3.2, 2.5);
    scene.add(saffronPoint);

    // Desi Teal cyber fill light
    const tealPoint = new THREE.PointLight(0x00bfa6, 4.0, 18);
    tealPoint.position.set(2.8, 2.5, 1.8);
    scene.add(tealPoint);

    // Moonlight / Sunset overhead rim
    const dirLight = new THREE.DirectionalLight(0xffb84d, 1.8);
    dirLight.position.set(4, 6, 4);
    scene.add(dirLight);

    // 3. Indian Street Arcade Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Ground platform (Street pavement with asphalt texture look)
    const roadGeo = new THREE.PlaneGeometry(16, 12);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x14141a,
      roughness: 0.85,
      metalness: 0.15
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.y = -1.2;
    rootGroup.add(road);

    // Yellow highway lane markings
    for (let i = -6; i <= 6; i += 3) {
      const stripeGeo = new THREE.PlaneGeometry(0.25, 1.6);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(0, -1.19, i);
      rootGroup.add(stripe);
    }

    // --- Object A: The Desi Arcade Machine ---
    const arcadeGroup = new THREE.Group();
    arcadeGroup.position.set(-1.8, -0.1, 0.4);
    arcadeGroup.rotation.y = 0.35;
    rootGroup.add(arcadeGroup);

    // Arcade Body
    const cabGeo = new THREE.BoxGeometry(1.2, 2.2, 1.1);
    const cabMat = new THREE.MeshStandardMaterial({
      color: 0x181822,
      roughness: 0.4,
      metalness: 0.6
    });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.y = 0;
    arcadeGroup.add(cab);

    // Arcade Screen
    const screenGeo = new THREE.PlaneGeometry(0.9, 0.7);
    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x00bfa6
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.35, 0.56);
    arcadeGroup.add(screen);

    // Glowing Marquee
    const marqueeGeo = new THREE.BoxGeometry(1.1, 0.35, 0.2);
    const marqueeMat = new THREE.MeshBasicMaterial({
      color: 0xff9f1c
    });
    const marquee = new THREE.Mesh(marqueeGeo, marqueeMat);
    marquee.position.set(0, 1.0, 0.5);
    arcadeGroup.add(marquee);

    // Joystick & Buttons
    const stickGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 8);
    const stickMat = new THREE.MeshStandardMaterial({ color: 0xee2222, metalness: 0.8 });
    const stick = new THREE.Mesh(stickGeo, stickMat);
    stick.position.set(-0.25, -0.05, 0.65);
    stick.rotation.x = 0.2;
    arcadeGroup.add(stick);

    // Mini D-Pad Buttons
    const btnMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
    for (let b = 0; b < 4; b++) {
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 8), btnMat);
      btn.position.set(0.12 + (b % 2) * 0.15, -0.1 + Math.floor(b / 2) * 0.12, 0.65);
      btn.rotation.x = Math.PI / 2;
      arcadeGroup.add(btn);
    }

    // --- Object B: Stylized Indian Tata 1613 Truck Model ---
    const truckGroup = new THREE.Group();
    truckGroup.position.set(1.9, -0.15, -0.2);
    truckGroup.rotation.y = -0.45;
    rootGroup.add(truckGroup);

    // Main Cabin (Bright saffron/orange with truck art decals)
    const cabinGeo = new THREE.BoxGeometry(1.6, 1.4, 1.8);
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0xff9f1c,
      roughness: 0.35,
      metalness: 0.4
    });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.y = 0.1;
    truckGroup.add(cabin);

    // Truck Bonnet Nose
    const noseGeo = new THREE.BoxGeometry(1.5, 0.8, 1.1);
    const noseMat = new THREE.MeshStandardMaterial({
      color: 0x00bfa6,
      roughness: 0.4,
      metalness: 0.3
    });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, -0.2, 1.1);
    truckGroup.add(nose);

    // Chrome Bumper
    const bumperGeo = new THREE.BoxGeometry(1.8, 0.3, 0.35);
    const bumperMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeee,
      metalness: 0.9,
      roughness: 0.1
    });
    const bumper = new THREE.Mesh(bumperGeo, bumperMat);
    bumper.position.set(0, -0.55, 1.7);
    truckGroup.add(bumper);

    // Dual Headlights (Glow)
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffea88 });
    const hlLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 12), hlMat);
    hlLeft.rotation.x = Math.PI / 2;
    hlLeft.position.set(-0.55, -0.25, 1.68);
    truckGroup.add(hlLeft);

    const hlRight = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 12), hlMat);
    hlRight.rotation.x = Math.PI / 2;
    hlRight.position.set(0.55, -0.25, 1.68);
    truckGroup.add(hlRight);

    // Windshield (Reflective glass)
    const wsGeo = new THREE.PlaneGeometry(1.4, 0.6);
    const wsMat = new THREE.MeshStandardMaterial({
      color: 0x112233,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85
    });
    const ws = new THREE.Mesh(wsGeo, wsMat);
    ws.position.set(0, 0.45, 0.91);
    truckGroup.add(ws);

    // Wheels (4 visible)
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.9 });
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.35, 16);
    const wheelPos = [
      [-0.9, -0.65, 0.8],
      [0.9, -0.65, 0.8],
      [-0.9, -0.65, -0.7],
      [0.9, -0.65, -0.7]
    ];
    wheelPos.forEach(([x, y, z]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, y, z);
      truckGroup.add(w);
    });

    // --- Object C: Floating Desi Gamepad & Neon Symbols ---
    const floatGroup = new THREE.Group();
    floatGroup.position.set(0, 2.2, 0);
    rootGroup.add(floatGroup);

    // Controller cross d-pad
    const crossMat = new THREE.MeshBasicMaterial({ color: 0x00bfa6 });
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.22, 0.15), crossMat);
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.65, 0.15), crossMat);
    floatGroup.add(crossH);
    floatGroup.add(crossV);

    // Floating gold coin / token
    const coinGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 16);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.85,
      roughness: 0.25
    });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI / 3;
    coin.position.set(1.4, 0.3, 0.8);
    floatGroup.add(coin);

    // --- Interactive Mouse Movement ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.4;
      targetY = y * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- Animation Loop ---
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse damping
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      if (!prefersReducedMotion) {
        // Subtle environmental idling
        rootGroup.rotation.y = mouseX;
        rootGroup.rotation.x = -mouseY * 0.5;

        // Floating gamepad bobbing
        floatGroup.position.y = 2.2 + Math.sin(elapsed * 2.2) * 0.14;
        floatGroup.rotation.y = elapsed * 0.6;
        floatGroup.rotation.z = Math.sin(elapsed * 1.5) * 0.08;

        // Coin spin
        coin.rotation.y += delta * 2.5;

        // Subtle truck suspension breathing
        truckGroup.position.y = -0.15 + Math.sin(elapsed * 3.5) * 0.02;

        // Screen color pulsing
        screenMat.color.setHSL(0.48 + Math.sin(elapsed * 1.5) * 0.06, 0.9, 0.5);
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }

      // Dispose geometries & materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    };
  }, []);

  if (!webGlSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#101014] rounded-3xl border border-amber-500/20">
        <div className="text-center p-6">
          <span className="text-4xl">🕹️ 🚛</span>
          <p className="text-amber-400 font-bold mt-2">GullyVerse Indian Street Arcade</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[360px] sm:h-[420px] lg:h-[480px] relative rounded-3xl overflow-hidden pointer-events-auto"
      style={{ touchAction: 'pan-y' }}
    />
  );
};

export default Gully3DHeroCanvas;
