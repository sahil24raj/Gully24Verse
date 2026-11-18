'use client';

import React from 'react';
import { BossEntity } from '../engine/types';
import { Zap, Flame } from 'lucide-react';

interface BossQTEOverlayProps {
  boss: BossEntity;
  timeRemaining: number;
  powerRatio: number;
  tapCount: number;
  onTap: () => void;
}

export const BossQTEOverlay: React.FC<BossQTEOverlayProps> = ({
  boss,
  timeRemaining,
  powerRatio,
  tapCount,
  onTap
}) => {
  const hpPercent = Math.max(0, Math.min(100, (boss.currentHp / boss.maxHp) * 100));
  const powerPercent = Math.round(powerRatio * 100);

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-between items-center p-4 sm:p-8 select-none pointer-events-none">
      {/* Top: Boss Boss Bar */}
      <div className="w-full max-w-xl flex flex-col items-center gap-2 mt-4 pointer-events-auto">
        <div className="flex items-center justify-between w-full text-xs font-black uppercase text-slate-200">
          <span className="flex items-center gap-1.5 text-red-400">
            <Flame className="w-4 h-4 fill-red-400" />
            <span>{boss.name}</span>
          </span>
          <span className="font-mono text-red-300">
            {boss.currentHp} / {boss.maxHp} HP
          </span>
        </div>

        <div className="w-full h-4 rounded-full bg-black/80 border-2 border-red-500/40 p-0.5 overflow-hidden shadow-2xl">
          <div
            className="h-full rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 transition-all duration-150"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* Center: Tap Frenzy Button */}
      <div className="flex flex-col items-center gap-4 my-auto pointer-events-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-black text-xs uppercase tracking-widest shadow-lg animate-pulse mb-2">
            <Zap className="w-4 h-4 fill-amber-300" />
            <span>TIME REMAINING: {timeRemaining.toFixed(1)}s</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            TAP RAPIDLY TO CHARGE PUNCH!
          </h2>
        </div>

        {/* Big Juicy Tap Button */}
        <button
          onClick={onTap}
          onTouchStart={onTap}
          className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-slate-950 font-black text-2xl sm:text-3xl uppercase tracking-wider shadow-[0_0_50px_rgba(255,159,28,0.7)] hover:scale-105 active:scale-90 transition-transform cursor-pointer border-4 border-amber-300 flex flex-col items-center justify-center gap-1"
        >
          <span className="text-3xl sm:text-4xl">👊</span>
          <span>PUNCH!</span>
          <span className="text-xs font-extrabold text-slate-900 bg-black/20 px-2 py-0.5 rounded-md mt-1">
            {tapCount} TAPS
          </span>
        </button>

        {/* Power Charge Bar */}
        <div className="flex flex-col items-center gap-1 w-64 sm:w-80">
          <div className="flex items-center justify-between w-full text-xs font-black uppercase text-amber-400">
            <span>RUSH POWER</span>
            <span className="text-sm font-mono text-white">{powerPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-black/70 border border-amber-500/30 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-teal-400 transition-all duration-75"
              style={{ width: `${Math.min(100, (powerRatio / 2.2) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="text-xs text-slate-400 font-bold bg-black/50 px-4 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
        Click or Tap as fast as you can before the timer runs out!
      </div>
    </div>
  );
};
