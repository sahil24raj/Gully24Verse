'use client';

import React from 'react';
import { Trophy, Coins, ArrowRight, RotateCcw } from 'lucide-react';

interface VictoryModalProps {
  levelNum: number;
  launchDistance: number;
  multiplierLabel: string;
  multiplierVal: number;
  baseCoins: number;
  onNextLevel: () => void;
  onReplay: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelNum,
  launchDistance,
  multiplierLabel,
  multiplierVal,
  baseCoins,
  onNextLevel,
  onReplay
}) => {
  const totalCoins = Math.round(baseCoins * multiplierVal);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl select-none animate-in fade-in duration-300">
      <div className="w-full max-w-md rounded-3xl bg-[#1B1B22] border-2 border-amber-500/40 p-6 sm:p-8 flex flex-col items-center gap-6 shadow-[0_0_60px_rgba(255,159,28,0.35)] text-center">
        {/* Trophy Icon */}
        <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center shadow-lg -mt-12 text-amber-400">
          <Trophy className="w-10 h-10 fill-amber-400 text-amber-400" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-black uppercase text-amber-400 tracking-widest">
            LEVEL {levelNum} COMPLETED
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
            TITAN KNOCKOUT!
          </h2>
          <p className="text-xs text-slate-300">
            You sent the Titan boss flying across the score strip!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center">
            <span className="text-[10px] font-black uppercase text-slate-400">
              LAUNCH DISTANCE
            </span>
            <span className="text-xl font-black text-teal-400 font-mono">
              {Math.round(launchDistance)}m
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center">
            <span className="text-[10px] font-black uppercase text-slate-400">
              MULTIPLIER
            </span>
            <span className="text-xl font-black text-amber-400 font-mono">
              {multiplierLabel}
            </span>
          </div>
        </div>

        {/* Total Coins Earned */}
        <div className="flex items-center justify-between w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border border-amber-500/30">
          <div className="flex items-center gap-2.5">
            <Coins className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span className="text-xs font-black text-slate-200 uppercase">COINS REWARD</span>
          </div>
          <span className="text-2xl font-black text-amber-300 font-mono">
            +{totalCoins.toLocaleString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full pt-2">
          <button
            onClick={onNextLevel}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>NEXT LEVEL</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={onReplay}
            className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-extrabold text-xs uppercase tracking-wider border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
