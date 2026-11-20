import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { funRaceAudio } from '../engine/AudioManager';

interface FunRaceDefeatModalProps {
  rank: number;
  onRetry: () => void;
}

export const FunRaceDefeatModal: React.FC<FunRaceDefeatModalProps> = ({
  rank,
  onRetry
}) => {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-30 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-rose-500/50 p-6 text-center space-y-5 shadow-[0_0_50px_rgba(244,63,94,0.3)]">
        {/* Defeat Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-red-400 mx-auto flex items-center justify-center shadow-2xl border-4 border-white/20">
          <AlertTriangle className="w-10 h-10 text-white" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">
            {rank}TH PLACE • WIPED OUT
          </span>
          <h2 className="text-2xl font-black text-white tracking-wide mt-1">
            RIVALS TOOK THE WIN!
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            💡 <strong>Pro Tip:</strong> Release your touch right before the sweeper or hammer swings across. Patience wins the race!
          </p>
        </div>

        {/* Retry Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              funRaceAudio.playCoin();
              onRetry();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-black text-sm tracking-wider uppercase shadow-xl hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TRY AGAIN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
