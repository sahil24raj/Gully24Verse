'use client';

import React from 'react';
import { PlayerState } from '../engine/types';
import { COLOR_DEFINITIONS } from '../engine/constants';
import { Volume2, VolumeX, Pause, Sparkles, Zap, Award } from 'lucide-react';

interface GiantRushHUDProps {
  player: PlayerState;
  levelNum: number;
  progressPercent: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
}

export const GiantRushHUD: React.FC<GiantRushHUDProps> = ({
  player,
  levelNum,
  progressPercent,
  isMuted,
  onToggleMute,
  onPause
}) => {
  const activeColorDef = COLOR_DEFINITIONS[player.color];

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-6 select-none">
      {/* Top Header Row */}
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
        {/* Left: Active Color & Scale Pill */}
        <div className="flex items-center gap-2.5">
          {/* Color Indicator */}
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-black/70 border backdrop-blur-md shadow-xl"
            style={{ borderColor: activeColorDef.cssHex }}
          >
            <span
              className="w-3.5 h-3.5 rounded-full animate-pulse shadow-md"
              style={{ backgroundColor: activeColorDef.cssHex }}
            />
            <span className="text-xs font-black uppercase text-white tracking-wider">
              {activeColorDef.name}
            </span>
          </div>

          {/* Scale Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-black text-amber-400">
              {player.scale.toFixed(1)}x SIZE
            </span>
          </div>
        </div>

        {/* Center: Level Progress Bar */}
        <div className="hidden sm:flex flex-col items-center gap-1 w-48">
          <div className="flex items-center justify-between w-full text-[11px] font-black uppercase text-slate-300">
            <span>LEVEL {levelNum}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/60 border border-white/10 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-teal-400 transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onToggleMute}
            className="w-10 h-10 rounded-xl bg-black/60 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all active:scale-95 cursor-pointer backdrop-blur-md"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-200" />}
          </button>

          <button
            onClick={onPause}
            className="w-10 h-10 rounded-xl bg-black/60 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all active:scale-95 cursor-pointer backdrop-blur-md"
            title="Pause"
          >
            <Pause className="w-4 h-4 text-slate-200" />
          </button>
        </div>
      </div>

      {/* Center Streak Banner (Appears when building a streak) */}
      {player.streakCount >= 4 && (
        <div className="self-center animate-bounce">
          <div className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(255,159,28,0.6)] flex items-center gap-2">
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{player.streakCount}x COMBO RUSH!</span>
          </div>
        </div>
      )}

      {/* Bottom Info Bar: Combat Power */}
      <div className="flex items-end justify-between w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/70 border border-white/15 backdrop-blur-md shadow-xl">
          <Award className="w-5 h-5 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-extrabold text-slate-400">
              TITAN STRENGTH
            </span>
            <span className="text-xl font-black text-white font-mono leading-none">
              {player.power} PTS
            </span>
          </div>
        </div>

        <div className="text-[11px] font-bold text-slate-300 bg-black/60 px-3.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-md hidden sm:block">
          ↔️ A / D or Arrow Keys to Steer
        </div>
      </div>
    </div>
  );
};
