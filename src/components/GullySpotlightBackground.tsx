'use client';

import React, { useEffect, useRef } from 'react';

export const GullySpotlightBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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

    // Target and current interpolated coordinates
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight * 0.35;
    let targetX = currentX;
    let targetY = currentY;
    let isUserActive = false;
    let lastActiveTime = Date.now();
    let animId: number;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      isUserActive = true;
      lastActiveTime = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetX = e.touches[0].clientX;
        targetY = e.touches[0].clientY;
        isUserActive = true;
        lastActiveTime = Date.now();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Render loop with smooth damping (lerp)
    const radius = Math.min(Math.max(window.innerWidth * 0.3, 340), 520);

    const updateLoop = () => {
      const now = Date.now();
      const elapsed = now * 0.001;

      // If idle for more than 2 seconds or on touch device, subtly glide spotlight
      if (!isUserActive || now - lastActiveTime > 2500) {
        if (!prefersReducedMotion) {
          const cx = window.innerWidth * 0.5;
          const cy = window.innerHeight * 0.4;
          const rx = window.innerWidth * 0.22;
          const ry = window.innerHeight * 0.15;
          targetX = cx + Math.sin(elapsed * 0.8) * rx;
          targetY = cy + Math.cos(elapsed * 0.6) * ry;
        }
      }

      // Smooth interpolation factor
      const factor = isUserActive ? 0.12 : 0.05;
      currentX += (targetX - currentX) * factor;
      currentY += (targetY - currentY) * factor;

      // Update mask position on Layer B (bright layer)
      const maskStr = `radial-gradient(circle ${radius}px at ${currentX.toFixed(1)}px ${currentY.toFixed(1)}px, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 42%, rgba(0,0,0,0) 100%)`;
      brightLayer.style.maskImage = maskStr;
      brightLayer.style.webkitMaskImage = maskStr;

      // Update ambient glow overlay ring
      if (glowLight) {
        glowLight.style.transform = `translate3d(${(currentX - radius).toFixed(1)}px, ${(currentY - radius).toFixed(1)}px, 0)`;
        glowLight.style.width = `${radius * 2}px`;
        glowLight.style.height = `${radius * 2}px`;
      }

      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none select-none -z-20 overflow-hidden bg-[#101014]"
    >
      {/* LAYER A: Darkened / Cinematic Gully Environment Base */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 scale-[1.02]"
        style={{
          backgroundImage: "url('/brand/gully-environment.jpg')",
          filter: 'brightness(0.32) contrast(1.15) saturate(0.65)'
        }}
      />

      {/* Atmospheric Vignette & Midnight Gradient Overlays */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-[#101014] via-[#101014]/60 to-transparent opacity-90" />
      <div className="absolute inset-0 w-full h-full bg-radial-vignette opacity-70" />

      {/* LAYER B: Original Vibrant Full-Brightness Gully Environment (Revealed via Cursor Spotlight Mask) */}
      <div
        ref={brightLayerRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat scale-[1.02] will-change-[mask-image]"
        style={{
          backgroundImage: "url('/brand/gully-environment.jpg')",
          filter: 'brightness(1.12) saturate(1.2) contrast(1.05)'
        }}
      />

      {/* AMBIENT CURSOR LIGHT GLOW (Soft warm Saffron & Teal halo) */}
      <div
        ref={glowLightRef}
        className="absolute top-0 left-0 rounded-full pointer-events-none opacity-60 mix-blend-screen will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 159, 28, 0.22) 0%, rgba(0, 191, 166, 0.12) 45%, rgba(0,0,0,0) 75%)'
        }}
      />

      {/* Micro-Ember Ambient Floating Lighting */}
      <div className="absolute inset-0 w-full h-full opacity-30 mix-blend-screen pointer-events-none bg-[radial-gradient(#ff9f1c_1px,transparent_1px)] [background-size:48px_48px]" />
    </div>
  );
};

export default GullySpotlightBackground;
