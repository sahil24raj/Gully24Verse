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

  // Iconic M-Portal Vector Symbol matching the Mastiverse Portal Cover
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
        className="w-full h-full drop-shadow-[0_0_16px_rgba(49,92,255,0.55)]"
      >
        <defs>
          <radialGradient id="mvBg" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#14275C" />
            <stop offset="75%" stopColor="#080D1B" />
          </radialGradient>
          <linearGradient id="mvPortalRim" x1="64" y1="64" x2="448" y2="448" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={variant === 'monochrome' ? '#FFFFFF' : '#60A5FA'} />
            <stop offset="50%" stopColor={variant === 'monochrome' ? '#CBD5E1' : '#315CFF'} />
            <stop offset="100%" stopColor={variant === 'monochrome' ? '#94A3B8' : '#2446D8'} />
          </linearGradient>
          <linearGradient id="mvMLetter" x1="256" y1="120" x2="256" y2="390" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor={variant === 'monochrome' ? '#E2E8F0' : '#BAE6FD'} />
          </linearGradient>
        </defs>

        {/* Chamfered Octagonal Portal Frame (Matches Cover Archway) */}
        <path
          d="M148 48 L364 48 L464 148 L464 364 L364 464 L148 464 L48 364 L48 148 Z"
          fill="url(#mvBg)"
          stroke="url(#mvPortalRim)"
          strokeWidth="18"
          strokeLinejoin="round"
        />

        {/* Inner Electric-Blue Glowing Portal Ring */}
        <path
          d="M168 88 L344 88 L424 168 L424 344 L344 424 L168 424 L88 344 L88 168 Z"
          fill="#0B1536"
          stroke={variant === 'monochrome' ? '#FFFFFF' : '#60A5FA'}
          strokeOpacity="0.45"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Saffron Accent Brackets (Left & Right Portal Energy) */}
        <path
          d="M32 200 L32 312 M480 200 L480 312"
          stroke={variant === 'monochrome' ? '#FFFFFF' : '#FF8A35'}
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Bold Split-Wing "M" + Nested "V" Portal Emblem (Matches Cover Portal) */}
        {/* Left Outer Wing */}
        <path
          d="M126 374 L126 144 L218 232 L218 308 L184 274 L184 374 Z"
          fill="url(#mvMLetter)"
        />
        {/* Right Outer Wing */}
        <path
          d="M386 374 L386 144 L294 232 L294 308 L328 274 L328 374 Z"
          fill="url(#mvMLetter)"
        />
        {/* Floating Center "V" Chevron */}
        <path
          d="M174 134 L256 218 L338 134 L338 194 L256 278 L174 194 Z"
          fill={variant === 'monochrome' ? '#FFFFFF' : '#FFFFFF'}
        />
        {/* Subtle Saffron Core Spark at Bottom of V */}
        <path
          d="M256 294 L276 322 L256 350 L236 322 Z"
          fill={variant === 'monochrome' ? '#E2E8F0' : '#FF8A35'}
        />
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
