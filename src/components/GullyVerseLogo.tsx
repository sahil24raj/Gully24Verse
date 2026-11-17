'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { soundFx } from '@/lib/audio';

export interface GullyVerseLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'badge' | 'banner';
  showTagline?: boolean;
  iconOnly?: boolean;
  useImage?: boolean;
  className?: string;
  onClick?: () => void;
}

export const GullyVerseLogo: React.FC<GullyVerseLogoProps> = ({
  size = 'md',
  variant = 'badge',
  showTagline = true,
  iconOnly = false,
  useImage = true,
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: { icon: 'w-9 h-9', fullW: 58, fullH: 42 },
    md: { icon: 'w-12 h-12', fullW: 72, fullH: 52 },
    lg: { icon: 'w-16 h-16', fullW: 110, fullH: 80 },
    xl: { icon: 'w-24 h-24', fullW: 165, fullH: 120 }
  };

  const current = sizeMap[size];
  const logoSrc = '/brand/gullyverse-badge-logo.png';

  const handleClick = () => {
    try {
      soundFx.playClick();
    } catch {
      // Audio safety
    }
    if (onClick) onClick();
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      className={`group flex items-center gap-2.5 select-none transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] ${className}`}
      aria-label="GullyVerse — Gully Se Gaming Tak"
    >
      {useImage ? (
        <div className="relative flex items-center">
          {iconOnly ? (
            <div
              className={`relative ${current.icon} rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(255,159,28,0.5)] border border-amber-500/40 shrink-0 bg-[#101014]`}
            >
              <Image
                src={logoSrc}
                alt="GullyVerse Icon"
                fill
                sizes="96px"
                className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                priority
              />
            </div>
          ) : (
            <div
              className="relative flex items-center justify-center shrink-0 drop-shadow-[0_0_22px_rgba(255,159,28,0.4)]"
              style={{ width: current.fullW, height: current.fullH }}
            >
              <Image
                src={logoSrc}
                alt="GullyVerse — Gully Se Gaming Tak"
                fill
                sizes="(max-width: 768px) 120px, 160px"
                className="object-contain object-center group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
                priority
              />
            </div>
          )}
        </div>
      ) : (
        /* Fallback SVG / Geometric vector badge */
        <div className="flex items-center gap-2.5">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-teal-400 p-[1.5px] shadow-[0_0_18px_rgba(255,159,28,0.5)]">
            <div className="w-full h-full bg-[#101014] rounded-[14px] flex items-center justify-center font-black text-amber-400 text-lg">
              G
            </div>
          </div>
          {!iconOnly && (
            <div className="flex flex-col">
              <span className="font-black text-xl text-white tracking-wider flex items-center">
                GULLY<span className="text-amber-400">VERSE</span>
              </span>
              {showTagline && (
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-widest -mt-1">
                  Gully Se Gaming Tak
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </Link>
  );
};

// Backward-compatible alias for any older component referencing VibeArenaLogo
export const VibeArenaLogo = GullyVerseLogo;
export default GullyVerseLogo;
