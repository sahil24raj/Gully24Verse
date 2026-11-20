import React from 'react';
import { GameStats } from '../engine/types';
import { RotateCcw, AlertOctagon } from 'lucide-react';

interface JellyRunDefeatModalProps {
  stats: GameStats;
  onRetry: () => void;
}

export const JellyRunDefeatModal: React.FC<JellyRunDefeatModalProps> = ({
  stats,
  onRetry
}) => {
  return (
    <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm rounded-3xl bg-[#0F172A] border border-rose-500/40 p-6 sm:p-8 flex flex-col items-center gap-5 shadow-[0_0_50px_rgba(244,63,94,0.3)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Splat hazard icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-3xl shadow-inner">
          <AlertOctagon className="w-8 h-8 text-rose-400" />
        </div>

        {/* Title */}
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-widest text-rose-400">
            ALL JELLIES SLICED
          </span>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
            SPLATTED!
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Tip: Tap screen or press Space to <span className="text-cyan-400 font-bold">SPLIT</span> your cube around center pillars!
          </p>
        </div>

        {/* Stats */}
        <div className="w-full rounded-2xl bg-black/40 border border-white/10 p-3.5 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase">Score Earned</span>
          <span className="text-lg font-black text-amber-400 font-mono">
            {stats.score.toLocaleString()}
          </span>
        </div>

        {/* Retry button */}
        <button
          onClick={onRetry}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(244,63,94,0.4)] transition-all cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>TRY AGAIN</span>
        </button>

      </div>
    </div>
  );
};
