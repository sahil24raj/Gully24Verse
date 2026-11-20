import React, { useEffect } from 'react';
import { GameStats } from '../engine/types';
import { JELLY_COLORS } from '../engine/constants';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';

interface JellyRunVictoryModalProps {
  stats: GameStats;
  onNextLevel: () => void;
  onReplay: () => void;
}

export const JellyRunVictoryModal: React.FC<JellyRunVictoryModalProps> = ({
  stats,
  onNextLevel,
  onReplay
}) => {
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const colorConfig = JELLY_COLORS[stats.highestNumber] || JELLY_COLORS[2];

  return (
    <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md rounded-3xl bg-[#0F172A] border border-amber-500/40 p-6 sm:p-8 flex flex-col items-center gap-6 shadow-[0_0_50px_rgba(251,191,36,0.3)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Trophy icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-3xl shadow-inner">
          <Trophy className="w-8 h-8 text-amber-400" />
        </div>

        {/* Title */}
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400">
            LEVEL {stats.level} COMPLETED
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1">
            RUNWAY CLEARED!
          </h2>
        </div>

        {/* Performance Showcase Card */}
        <div className="w-full rounded-2xl bg-black/40 border border-white/10 p-4 flex flex-col gap-3">
          
          {/* Highest Cube Badge */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Top Cube</span>
            <div
              className="px-3.5 py-1 rounded-xl font-black text-sm tracking-wide shadow-md"
              style={{
                backgroundColor: colorConfig.bg,
                color: colorConfig.text
              }}
            >
              {stats.highestNumber}
            </div>
          </div>

          {/* Multiplier Tag */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Runway Multiplier</span>
            <span className="text-sm font-black text-emerald-400">
              x{stats.multiplier.toFixed(1)} Bonus
            </span>
          </div>

          {/* Merges Count */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Successful Merges</span>
            <span className="text-sm font-bold text-slate-200">
              {stats.mergesCount}
            </span>
          </div>

          <div className="h-px w-full bg-white/10" />

          {/* Final Calculated Score */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Total Score</span>
            <span className="text-2xl font-black text-amber-400 font-mono">
              {stats.finalScore.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onReplay}
            className="flex-1 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REPLAY</span>
          </button>

          <button
            onClick={onNextLevel}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_24px_rgba(251,191,36,0.4)] active:scale-95"
          >
            <span>NEXT LEVEL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
