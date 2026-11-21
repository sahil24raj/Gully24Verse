'use client';

import React, { useEffect, useRef } from 'react';

export const GullySpotlightBackground: React.FC = () => {
  const brightLayerRef = useRef<HTMLDivElement>(null);
  const glowLightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const brightLayer = brightLayerRef.current;
    const glowLight = glowLightRef.current;
    if (!brightLayer) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let radius = Math.min(Math.max(window.innerWidth * 0.32, 380), 580);

    // Initial position: center of viewport
    let currentX = window.innerWidth * 0.5;
    let currentY = window.innerHeight * 0.36;
    let targetX = currentX;
    let targetY = currentY;
    let isUserActive = false;
    let lastActiveTime = Date.now();
    let animId: number;

    const handleResize = () => {
      radius = Math.min(Math.max(window.innerWidth * 0.32, 380), 580);
      if (glowLight) {
        glowLight.style.width = `${radius * 2}px`;
        glowLight.style.height = `${radius * 2}px`;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      isUserActive = true;
      lastActiveTime = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
        isUserActive = true;
        lastActiveTime = Date.now();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 60 FPS Render loop with smooth lerp physics
    const updateLoop = () => {
      const now = Date.now();
      const elapsed = now * 0.001;

      // Subtle ambient roving drift when user is idle or on touch device
      if (!isUserActive || now - lastActiveTime > 2500) {
        if (!prefersReducedMotion) {
          const cx = window.innerWidth * 0.5;
          const cy = window.innerHeight * 0.36;
          const rx = window.innerWidth * 0.16;
          const ry = window.innerHeight * 0.11;
          targetX = cx + Math.sin(elapsed * 0.75) * rx;
          targetY = cy + Math.cos(elapsed * 0.55) * ry;
        }
      }

      // Smooth interpolation factor
      const factor = isUserActive ? 0.15 : 0.06;
      currentX += (targetX - currentX) * factor;
      currentY += (targetY - currentY) * factor;

      // Update dynamic mask on bright layer
      const maskStr = `radial-gradient(circle ${radius}px at ${currentX.toFixed(1)}px ${currentY.toFixed(1)}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)`;
      brightLayer.style.maskImage = maskStr;
      brightLayer.style.webkitMaskImage = maskStr;

      // Update warm accent glow overlay ring
      if (glowLight) {
        glowLight.style.transform = `translate3d(${(currentX - radius).toFixed(1)}px, ${(currentY - radius).toFixed(1)}px, 0)`;
      }

      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden"
    >
      {/* 
        LAYER 1: The 3D Indian Gully Mohalla artwork clearly visible everywhere
        with enhanced base clarity, vibrancy, and cinematic contrast (Chai Tapri, Neon Arcade, Auto, Cycle, Street).
      */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat scale-[1.01]"
        style={{
          backgroundImage: "url('/brand/gully-environment.jpg')",
          filter: 'brightness(0.72) contrast(1.1) saturate(1.08)'
        }}
      />

      {/* 
        Subtle Cinematic Scrim (Keeps header & dock readable while letting 70%+ center background shine through unclouded)
      */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#101014]/40 via-transparent to-[#101014]/45" />

      {/* 
        LAYER 2 (SPOTLIGHT REVEAL):
        Super-saturated, glowing original Gully artwork revealed under the cursor spotlight.
      */}
      <div
        ref={brightLayerRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat scale-[1.01] will-change-[mask-image]"
        style={{
          backgroundImage: "url('/brand/gully-environment.jpg')",
          filter: 'brightness(1.32) contrast(1.2) saturate(1.4)',
          WebkitMaskImage:
            'radial-gradient(circle 380px at 50% 36%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(circle 380px at 50% 36%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)'
        }}
      />

      {/* 
        ACCENT CURSOR LIGHT GLOW (Soft warm Saffron & Teal street-arcade halo)
      */}
      <div
        ref={glowLightRef}
        className="absolute top-0 left-0 rounded-full pointer-events-none mix-blend-screen opacity-70 will-change-transform"
        style={{
          width: '760px',
          height: '760px',
          transform: 'translate3d(calc(50vw - 380px), calc(36vh - 380px), 0)',
          background:
            'radial-gradient(circle, rgba(255, 159, 28, 0.28) 0%, rgba(0, 191, 166, 0.16) 40%, rgba(0,0,0,0) 70%)'
        }}
      />
    </div>
  );
};

export default GullySpotlightBackground;
