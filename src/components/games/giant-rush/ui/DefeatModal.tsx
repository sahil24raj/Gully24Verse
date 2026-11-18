'use client';

import React from 'react';
import { Skull, RotateCcw, AlertTriangle } from 'lucide-react';

interface DefeatModalProps {
  reason: 'CRUSHED' | 'BOSS_DEFEATED';
  onRetry: () => void;
}

export const DefeatModal: React.FC<DefeatModalProps> = ({ reason, onRetry }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none animate-in fade-in duration-300">
      <div className="w-full max-w-md rounded-3xl bg-[#1B1B22] border-2 border-red-500/40 p-6 sm:p-8 flex flex-col items-center gap-6 shadow-[0_0_60px_rgba(239,68,68,0.35)] text-center">
        {/* Skull Icon */}
        <div className="w-20 h-20 rounded-3xl bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center shadow-lg -mt-12 text-red-400">
          <Skull className="w-10 h-10" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-black uppercase text-red-400 tracking-widest">
            RUN FAILED
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            {reason === 'CRUSHED' ? 'CRUSHED TO PIECES!' : 'TITAN WAS STRONGER!'}
          </h2>
          <p className="text-xs text-slate-300">
            {reason === 'CRUSHED'
              ? 'You absorbed too many wrong colors and shrank below the minimum size!'
              : 'Your punch power was not enough to knock out the Titan boss!'}
          </p>
        </div>

        {/* Pro Tip Box */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/30 flex items-start gap-3 text-left w-full">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex flex-col text-xs text-slate-300">
            <span className="font-bold text-amber-300">PRO TIP:</span>
            <span>
              Always steer into figures that match your active color and avoid opposite colors to grow huge before the boss!
            </span>
          </div>
        </div>

        {/* Retry Button */}
        <button
          onClick={onRetry}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>TRY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
