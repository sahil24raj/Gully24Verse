'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { soundFx } from '@/lib/audio';

export interface GullyVerseLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  iconOnly?: boolean;
  useImage?: boolean;
  className?: string;
  onClick?: () => void;
}

export const GullyVerseLogo: React.FC<GullyVerseLogoProps> = ({
  size = 'md',
  showTagline = true,
  iconOnly = false,
  useImage = true,
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', imgW: 130, imgH: 42, fullW: 130, fullH: 42 },
    md: { icon: 'w-10 h-10', imgW: 180, imgH: 56, fullW: 180, fullH: 56 },
    lg: { icon: 'w-14 h-14', imgW: 240, imgH: 76, fullW: 240, fullH: 76 },
    xl: { icon: 'w-20 h-20', imgW: 340, imgH: 108, fullW: 340, fullH: 108 }
  };

  const current = sizeMap[size];

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
      className={`group flex items-center gap-2 select-none transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] ${className}`}
      aria-label="GullyVerse — Gully Se Gaming Tak"
    >
      {useImage ? (
        <div className="relative flex items-center">
          {iconOnly ? (
            <div className={`relative ${current.icon} rounded-xl overflow-hidden shadow-[0_0_15px_rgba(255,159,28,0.45)] border border-amber-500/30 shrink-0 bg-[#101014]`}>
              <Image
                src="/brand/gullyverse-logo.png"
                alt="GullyVerse Icon"
                fill
                sizes="80px"
                className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                priority
              />
            </div>
          ) : (
            <div
              className="relative flex items-center justify-center shrink-0 drop-shadow-[0_0_18px_rgba(255,159,28,0.35)]"
              style={{ width: current.fullW, height: current.fullH }}
            >
              <Image
                src="/brand/gullyverse-logo.png"
                alt="GullyVerse — Gully Se Gaming Tak"
                fill
                sizes="(max-width: 768px) 150px, 240px"
                className="object-contain object-left group-hover:brightness-110 transition-all duration-300"
                priority
              />
            </div>
          )}
        </div>
      ) : (
        /* Fallback SVG / Geometric vector badge */
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-teal-400 p-[1.5px] shadow-[0_0_15px_rgba(255,159,28,0.45)]">
            <div className="w-full h-full bg-[#101014] rounded-[10px] flex items-center justify-center font-black text-amber-400 text-base">
              G
            </div>
          </div>
          {!iconOnly && (
            <div className="flex flex-col">
              <span className="font-black text-lg text-white tracking-wider flex items-center">
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
