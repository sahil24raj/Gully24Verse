import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { funRaceAudio } from '../engine/AudioManager';

interface FunRaceVictoryModalProps {
  level: number;
  coins: number;
  onNextLevel: () => void;
  onReplay: () => void;
}

export const FunRaceVictoryModal: React.FC<FunRaceVictoryModalProps> = ({
  level,
  coins,
  onNextLevel,
  onReplay
}) => {
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F0FF', '#FFB703', '#FF4D6D', '#10B981']
    });
  }, []);

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-30 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-amber-400/60 p-6 text-center space-y-5 shadow-[0_0_50px_rgba(251,191,36,0.3)]">
        {/* Trophy Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 mx-auto flex items-center justify-center shadow-2xl border-4 border-white/20 animate-bounce">
          <Trophy className="w-10 h-10 text-slate-950 fill-slate-950" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            VICTORY! 1ST PLACE
          </span>
          <h2 className="text-2xl font-black text-white tracking-wide mt-1">
            LEVEL {level} COMPLETED!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Masterful obstacle evasion! You outpaced all rivals to cross the line first.
          </p>
        </div>

        {/* Coins Reward */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center gap-2 text-amber-300 font-black text-lg">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>+{coins} COINS EARNED</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => {
              funRaceAudio.playCoin();
              onNextLevel();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm tracking-wider uppercase shadow-xl hover:shadow-[0_0_25px_rgba(251,191,36,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <span>NEXT LEVEL</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={() => {
              funRaceAudio.playCoin();
              onReplay();
            }}
            className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>REPLAY LEVEL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
