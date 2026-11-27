'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { soundFx } from '@/lib/audio';

export interface MastiverseLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'horizontal' | 'icon' | 'badge' | 'monochrome';
  theme?: 'dark' | 'light';
  showTagline?: boolean;
  useImage?: boolean;
  className?: string;
  onClick?: () => void;
}

export const MastiverseLogo: React.FC<MastiverseLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  theme = 'dark',
  showTagline = true,
  useImage = false, // SVG vector by default for razor-sharp rendering at all pixel densities
  className = '',
  onClick
}) => {
  const isDark = theme === 'dark';

  const sizeMetrics = {
    xs: { icon: 24, font: 'text-sm', badge: 'text-[9px] px-1.5 py-0.2', gap: 'gap-1.5' },
    sm: { icon: 32, font: 'text-base', badge: 'text-[10px] px-2 py-0.5', gap: 'gap-2' },
    md: { icon: 44, font: 'text-xl', badge: 'text-[10px] px-2.5 py-0.5', gap: 'gap-2.5' },
    lg: { icon: 56, font: 'text-2xl', badge: 'text-xs px-3 py-1', gap: 'gap-3' },
    xl: { icon: 72, font: 'text-4xl', badge: 'text-sm px-4 py-1.5', gap: 'gap-4' }
  };

  const current = sizeMetrics[size];

  const handleClick = () => {
    try {
      soundFx.playClick();
    } catch {}
    if (onClick) onClick();
  };

  // Dedicated M-Portal Celestial Vector Symbol
  const renderIcon = () => (
    <div
      className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
      style={{ width: current.icon, height: current.icon }}
    >
      <svg
        width={current.icon}
        height={current.icon}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_16px_rgba(49,92,255,0.45)]"
      >
        <defs>
          <radialGradient id="mvBg" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stop-color="#101A33" />
            <stop offset="70%" stop-color="#080D1B" />
          </radialGradient>
          <linearGradient id="mvPylonL" x1="100" y1="80" x2="256" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color={variant === 'monochrome' ? '#FFFFFF' : '#315CFF'} />
            <stop offset="100%" stop-color={variant === 'monochrome' ? '#94A3B8' : '#2446D8'} />
          </linearGradient>
          <linearGradient id="mvPylonR" x1="412" y1="80" x2="256" y2="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color={variant === 'monochrome' ? '#E2E8F0' : '#4C73FF'} />
            <stop offset="100%" stop-color={variant === 'monochrome' ? '#64748B' : '#315CFF'} />
          </linearGradient>
          <radialGradient id="mvSaffron" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color={variant === 'monochrome' ? '#FFFFFF' : '#FFA866'} />
            <stop offset="60%" stop-color={variant === 'monochrome' ? '#CBD5E1' : '#FF8A35'} />
            <stop offset="100%" stop-color={variant === 'monochrome' ? '#64748B' : '#E05F05'} />
          </radialGradient>
        </defs>

        {/* Hexagonal Portal Frame */}
        <path
          d="M256 32 L468 154 L468 358 L256 480 L44 358 L44 154 Z"
          fill="url(#mvBg)"
          stroke={variant === 'monochrome' ? '#FFFFFF' : '#315CFF'}
          strokeWidth="12"
          strokeLinejoin="round"
        />

        {/* Floating Celestial Crown / Crest */}
        <path
          d="M256 86 L284 128 L256 150 L228 128 Z"
          fill={variant === 'monochrome' ? '#FFFFFF' : '#FF8A35'}
        />

        {/* Geometric Left & Right M Wings */}
        <path
          d="M100 380 L100 162 L188 94 L256 244 L256 304 L176 178 L148 200 L148 380 Z"
          fill="url(#mvPylonL)"
          stroke={variant === 'monochrome' ? '#CBD5E1' : '#4C73FF'}
          strokeWidth="3"
        />
        <path
          d="M412 380 L412 162 L324 94 L256 244 L256 304 L336 178 L364 200 L364 380 Z"
          fill="url(#mvPylonR)"
          stroke={variant === 'monochrome' ? '#E2E8F0' : '#6E90FF'}
          strokeWidth="3"
        />

        {/* Celestial Saffron Core */}
        <circle cx="256" cy="336" r="44" fill="url(#mvSaffron)" />
        <path
          d="M256 296 L264 328 L296 336 L264 344 L256 376 L248 344 L216 336 L248 328 Z"
          fill="#FFFFFF"
        />
        <circle cx="256" cy="336" r="10" fill="#FFE5D1" />
      </svg>
    </div>
  );

  // If icon-only variant
  if (variant === 'icon') {
    return (
      <Link
        href="/"
        onClick={handleClick}
        className={`group inline-flex items-center justify-center select-none ${className}`}
        aria-label="MASTIVERSE — Apna Game. Apni Duniya."
      >
        {useImage ? (
          <div
            className="relative shrink-0 rounded-2xl overflow-hidden border border-[#315CFF]/30 shadow-[0_0_18px_rgba(49,92,255,0.35)]"
            style={{ width: current.icon, height: current.icon }}
          >
            <Image
              src="/brand/mastiverse-icon.png"
              alt="Mastiverse Symbol"
              fill
              sizes="96px"
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform"
              priority
            />
          </div>
        ) : (
          renderIcon()
        )}
      </Link>
    );
  }

  // Primary Vertical / Stacked Logo
  if (variant === 'primary') {
    return (
      <Link
        href="/"
        onClick={handleClick}
        className={`group flex flex-col items-center text-center select-none gap-2 ${className}`}
        aria-label="MASTIVERSE — Apna Game. Apni Duniya."
      >
        {renderIcon()}
        <div className="flex flex-col items-center">
          <div className="flex items-center tracking-tight font-black font-display uppercase leading-none">
            <span className={isDark ? 'text-white' : 'text-[#080D1B]'}>MASTI</span>
            <span className="bg-gradient-to-r from-[#315CFF] via-[#557BFF] to-[#FF8A35] bg-clip-text text-transparent">
              VERSE
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#FF8A35] uppercase mt-1">
              APNA GAME. APNI DUNIYA.
            </span>
          )}
        </div>
      </Link>
    );
  }

  // Default: Horizontal Logo (Icon + Wordmark + Tagline)
  return (
    <Link
      href="/"
      onClick={handleClick}
      className={`group flex items-center ${current.gap} select-none transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] ${className}`}
      aria-label="MASTIVERSE — Apna Game. Apni Duniya."
    >
      {renderIcon()}

      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center font-black font-display tracking-wide uppercase leading-none">
          <span className={`${current.font} ${isDark ? 'text-white' : 'text-[#080D1B]'}`}>
            MASTI
          </span>
          <span
            className={`${current.font} bg-gradient-to-r from-[#315CFF] to-[#FF8A35] bg-clip-text text-transparent`}
          >
            VERSE
          </span>
        </div>

        {showTagline && (
          <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.2em] text-[#FF8A35] uppercase mt-0.5 truncate">
            APNA GAME. APNI DUNIYA.
          </span>
        )}
      </div>
    </Link>
  );
};

export default MastiverseLogo;
