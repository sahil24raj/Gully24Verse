import React from 'react';
import { EngineTelemetry } from '../engine/types';
import { Trophy, Volume2, VolumeX, Flag, Sparkles } from 'lucide-react';
import { funRaceAudio } from '../engine/AudioManager';

interface FunRaceHUDProps {
  telemetry: EngineTelemetry | null;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
}

export const FunRaceHUD: React.FC<FunRaceHUDProps> = ({
  telemetry,
  isMuted,
  onToggleMute,
  onRestart
}) => {
  if (!telemetry) return null;

  const rankColor =
    telemetry.playerRank === 1
      ? 'from-amber-400 to-yellow-500 text-slate-950 border-amber-300'
      : telemetry.playerRank === 2
      ? 'from-slate-200 to-slate-400 text-slate-950 border-slate-300'
      : 'from-orange-500 to-rose-600 text-white border-rose-400';

  const rankSuffix =
    telemetry.playerRank === 1 ? 'st' : telemetry.playerRank === 2 ? 'nd' : 'rd';

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 select-none font-sans z-10">
      {/* --- TOP BAR --- */}
      <div className="w-full flex items-center justify-between gap-3">
        {/* Level Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            LEVEL {telemetry.level} / {telemetry.totalLevels}
          </span>
        </div>

        {/* Center Rank Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`px-5 py-2 rounded-2xl bg-gradient-to-r ${rankColor} border-2 shadow-xl font-black text-sm tracking-wider flex items-center gap-1.5 transition-all duration-300`}
          >
            <Trophy className="w-4 h-4 fill-current" />
            <span>
              {telemetry.playerRank}
              <sup>{rankSuffix}</sup> / {telemetry.totalRunners}
            </span>
          </div>
        </div>

        {/* Right Controls: Coins & Audio */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-400 font-black text-xs shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{telemetry.coinsEarned}</span>
          </div>

          <button
            onClick={() => {
              funRaceAudio.playCoin();
              onToggleMute();
            }}
            className="w-10 h-10 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            )}
          </button>
        </div>
      </div>

      {/* --- TRACK PROGRESS BAR --- */}
      <div className="w-full max-w-xl mx-auto px-4 pointer-events-auto">
        <div className="relative w-full h-4 bg-slate-950/70 backdrop-blur-md rounded-full border border-white/20 p-0.5 shadow-2xl flex items-center">
          {/* Progress fill */}
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(0,240,255,0.5)]"
            style={{ width: `${Math.max(4, telemetry.playerProgress)}%` }}
          />

          {/* Bot markers */}
          {telemetry.runners
            .filter((r) => !r.isPlayer)
            .map((bot) => (
              <div
                key={bot.id}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border border-white shadow-md transition-all duration-100"
                style={{
                  left: `${Math.max(2, Math.min(98, bot.progress * 100))}%`,
                  backgroundColor: `#${bot.color}`
                }}
                title={bot.name}
              />
            ))}

          {/* Player Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_15px_#00F0FF] flex items-center justify-center text-[10px] font-black text-slate-950 transition-all duration-100"
            style={{ left: `${Math.max(2, Math.min(98, telemetry.playerProgress))}%` }}
          >
            🏃
          </div>

          {/* Finish Line Flag */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-amber-400 border border-white flex items-center justify-center shadow-lg">
            <Flag className="w-3 h-3 text-slate-950 fill-slate-950" />
          </div>
        </div>
      </div>

      {/* --- BOTTOM PROMPT / HOLD-TO-RUN TUTORIAL --- */}
      <div className="w-full flex flex-col items-center gap-2 pb-2">
        {telemetry.gameState === 'RACING' && (
          <div
            className={`px-6 py-2.5 rounded-2xl backdrop-blur-md border text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 shadow-2xl flex items-center gap-2 ${
              telemetry.isHolding
                ? 'bg-emerald-500/80 border-emerald-300 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105'
                : 'bg-black/75 border-amber-400/60 text-amber-300 animate-pulse'
            }`}
          >
            <span>{telemetry.isHolding ? '⚡ RUNNING! RELEASE TO STOP' : '👆 HOLD SCREEN / CLICK / SPACE TO RUN'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
