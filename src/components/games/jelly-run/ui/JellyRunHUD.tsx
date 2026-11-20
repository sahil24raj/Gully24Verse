import React from 'react';
import { GameStats } from '../engine/types';
import { JELLY_COLORS } from '../engine/constants';
import { Volume2, VolumeX, Pause, Maximize, Play, Split } from 'lucide-react';

interface JellyRunHUDProps {
  stats: GameStats;
  progress: number;
  isMuted: boolean;
  isSplit: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onToggleFullscreen: () => void;
  onToggleSplit: () => void;
}

export const JellyRunHUD: React.FC<JellyRunHUDProps> = ({
  stats,
  progress,
  isMuted,
  isSplit,
  onToggleMute,
  onPause,
  onToggleFullscreen,
  onToggleSplit
}) => {
  const colorConfig = JELLY_COLORS[stats.highestNumber] || JELLY_COLORS[2];

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none z-20">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 w-full">
        {/* Left: Level & Highest Number */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>LEVEL {stats.level}</span>
          </div>

          <div
            className="px-3 py-1.5 rounded-xl backdrop-blur-md border font-black text-xs tracking-wider flex items-center gap-1.5 shadow-lg transition-colors"
            style={{
              backgroundColor: `${colorConfig.bg}33`,
              borderColor: colorConfig.bg,
              color: colorConfig.bg
            }}
          >
            <span>CUBE:</span>
            <span className="font-extrabold text-sm">{stats.highestNumber}</span>
          </div>
        </div>

        {/* Center: Race Progress Bar */}
        <div className="flex-1 max-w-xs sm:max-w-md mx-2 pointer-events-auto">
          <div className="relative w-full h-3 sm:h-3.5 bg-black/60 rounded-full overflow-hidden border border-white/15 backdrop-blur-md shadow-inner p-0.5">
            <div
              className="h-full rounded-full transition-all duration-150 shadow-md"
              style={{
                width: `${Math.min(100, progress * 100)}%`,
                backgroundColor: colorConfig.bg
              }}
            />
          </div>
        </div>

        {/* Right: Score & System Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-300 font-mono font-black text-sm shadow-lg flex items-center gap-1.5">
            <span>⭐</span>
            <span>{stats.score.toLocaleString()}</span>
          </div>

          <button
            onClick={onToggleMute}
            className="w-9 h-9 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
          </button>

          <button
            onClick={onPause}
            className="w-9 h-9 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
            title="Pause"
          >
            <Pause className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={onToggleFullscreen}
            className="w-9 h-9 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
            title="Fullscreen"
          >
            <Maximize className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Bottom Center: Quick Split Action Pill */}
      <div className="w-full flex justify-center pb-2 pointer-events-auto">
        <button
          onClick={onToggleSplit}
          className="flex items-center gap-2.5 px-6 py-2.5 rounded-full backdrop-blur-lg border font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-xl active:scale-95 hover:scale-105"
          style={{
            backgroundColor: isSplit ? 'rgba(236, 72, 153, 0.85)' : 'rgba(14, 165, 233, 0.85)',
            borderColor: isSplit ? '#F472B6' : '#38BDF8',
            color: '#FFFFFF'
          }}
        >
          <Split className={`w-4 h-4 transition-transform ${isSplit ? 'rotate-180' : ''}`} />
          <span>{isSplit ? 'TAP TO MERGE 🔁' : 'TAP TO SPLIT ↔️'}</span>
        </button>
      </div>
    </div>
  );
};
