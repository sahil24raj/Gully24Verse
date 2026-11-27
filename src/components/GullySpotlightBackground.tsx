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

    let radius = Math.min(Math.max(window.innerWidth * 0.35, 260), 960);

    // Initial position: center of viewport
    let currentX = window.innerWidth * 0.5;
    let currentY = window.innerHeight * 0.36;
    let targetX = currentX;
    let targetY = currentY;
    let isUserActive = false;
    let lastActiveTime = Date.now();
    let animId: number;

    const handleResize = () => {
      radius = Math.min(Math.max(window.innerWidth * 0.35, 260), 960);
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
        LAYER 1: Base Indian gaming street environment with cinematic navy contrast
      */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat scale-[1.01]"
        style={{
          backgroundImage: "url('/brand/gully-environment.jpg')",
          filter: 'brightness(0.68) contrast(1.15) saturate(1.05)'
        }}
      />

      {/* 
        Subtle Cinematic Scrim in Midnight Navy (Keeps header & dock readable while letting center scene breathe)
      */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#080D1B]/60 via-[#101A33]/25 to-[#080D1B]/85" />

      {/* 
        LAYER 2 (SPOTLIGHT REVEAL):
        Vibrant, atmospheric environment revealed under the interactive cursor spotlight.
      */}
      <div
        ref={brightLayerRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat scale-[1.01] will-change-[mask-image]"
        style={{
          backgroundImage: "url('/brand/gully-environment.jpg')",
          filter: 'brightness(1.28) contrast(1.2) saturate(1.35)',
          WebkitMaskImage:
            'radial-gradient(circle 380px at 50% 36%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(circle 380px at 50% 36%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)'
        }}
      />

      {/* 
        ACCENT CURSOR LIGHT GLOW (Atmospheric Electric Blue #315CFF & Saffron #FF8A35 halo)
      */}
      <div
        ref={glowLightRef}
        className="absolute top-0 left-0 rounded-full pointer-events-none mix-blend-screen opacity-75 will-change-transform"
        style={{
          width: '760px',
          height: '760px',
          transform: 'translate3d(calc(50vw - 380px), calc(36vh - 380px), 0)',
          background:
            'radial-gradient(circle, rgba(49, 92, 255, 0.26) 0%, rgba(255, 138, 53, 0.16) 38%, rgba(16, 26, 51, 0.08) 55%, rgba(0,0,0,0) 72%)'
        }}
      />
    </div>
  );
};

export default GullySpotlightBackground;
