'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, Flame, Volume2, Shield } from 'lucide-react';
import { PlayerControlsInput } from '../engine/types';

interface AutoRushMobileControlsProps {
  onControlChange: (patch: Partial<PlayerControlsInput>) => void;
  isNitroAvailable: boolean;
}

export const AutoRushMobileControls: React.FC<AutoRushMobileControlsProps> = ({
  onControlChange,
  isNitroAvailable
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex items-end justify-between p-2 sm:p-5 select-none md:hidden">
      {/* Left Steering Pad: Steer Left & Right */}
      <div className="pointer-events-auto flex gap-1.5 sm:gap-3 items-center">
        <button
          onTouchStart={() => onControlChange({ steer: -1 })}
          onTouchEnd={() => onControlChange({ steer: 0 })}
          onMouseDown={() => onControlChange({ steer: -1 })}
          onMouseUp={() => onControlChange({ steer: 0 })}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#0B1536]/85 border-2 border-white/30 text-white flex items-center justify-center text-xl shadow-2xl active:bg-[#FF9933] active:text-black active:scale-95 transition-all"
          aria-label="Steer Left"
        >
          <ArrowLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <button
          onTouchStart={() => onControlChange({ steer: 1 })}
          onTouchEnd={() => onControlChange({ steer: 0 })}
          onMouseDown={() => onControlChange({ steer: 1 })}
          onMouseUp={() => onControlChange({ steer: 0 })}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#0B1536]/85 border-2 border-white/30 text-white flex items-center justify-center text-xl shadow-2xl active:bg-[#FF9933] active:text-black active:scale-95 transition-all"
          aria-label="Steer Right"
        >
          <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Right Pedal Cluster: Gas, Brake, Nitro, Drift */}
      <div className="pointer-events-auto flex items-end gap-1.5 sm:gap-3">
        {/* Drift & Nitro Column */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {/* Drift Button */}
          <button
            onTouchStart={() => onControlChange({ drift: true })}
            onTouchEnd={() => onControlChange({ drift: false })}
            onMouseDown={() => onControlChange({ drift: true })}
            onMouseUp={() => onControlChange({ drift: false })}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-900/80 border border-purple-400 text-purple-200 flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all font-black text-[8px] sm:text-[9px]"
          >
            DRIFT
          </button>

          {/* Nitro Button */}
          <button
            onTouchStart={() => onControlChange({ nitro: true })}
            onTouchEnd={() => onControlChange({ nitro: false })}
            onMouseDown={() => onControlChange({ nitro: true })}
            onMouseUp={() => onControlChange({ nitro: false })}
            disabled={!isNitroAvailable}
            className={`w-10 h-12 sm:w-12 sm:h-14 rounded-xl border flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all ${
              isNitroAvailable
                ? 'bg-gradient-to-t from-cyan-600 to-blue-500 border-cyan-300 text-white animate-pulse'
                : 'bg-gray-800/60 border-gray-600 text-gray-500 opacity-50'
            }`}
          >
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            <span className="text-[7px] sm:text-[8px] font-black uppercase">NITRO</span>
          </button>
        </div>

        {/* Brake / Reverse Pedal */}
        <button
          onTouchStart={() => onControlChange({ brake: 1 })}
          onTouchEnd={() => onControlChange({ brake: 0 })}
          onMouseDown={() => onControlChange({ brake: 1 })}
          onMouseUp={() => onControlChange({ brake: 0 })}
          className="w-12 h-16 sm:w-16 sm:h-20 rounded-xl sm:rounded-2xl bg-red-900/80 border-2 border-red-500 text-white flex flex-col items-center justify-center shadow-xl active:bg-red-700 active:scale-95 transition-all font-black"
        >
          <span className="text-xs sm:text-sm">BRAKE</span>
          <span className="text-[8px] sm:text-[9px] text-red-200">REV</span>
        </button>

        {/* Gas Accelerator Pedal */}
        <button
          onTouchStart={() => onControlChange({ throttle: 1 })}
          onTouchEnd={() => onControlChange({ throttle: 0 })}
          onMouseDown={() => onControlChange({ throttle: 1 })}
          onMouseUp={() => onControlChange({ throttle: 0 })}
          className="w-14 h-22 sm:w-18 sm:h-28 rounded-xl sm:rounded-2xl bg-gradient-to-t from-[#10B981] to-[#059669] border-2 border-emerald-300 text-white flex flex-col items-center justify-center shadow-2xl active:from-emerald-400 active:to-emerald-600 active:scale-95 transition-all font-black"
        >
          <span className="text-base sm:text-xl">GAS</span>
          <span className="text-[9px] sm:text-[10px] text-emerald-100 uppercase tracking-widest">रेस</span>
        </button>
      </div>
    </div>
  );
};

