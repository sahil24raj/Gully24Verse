import React from 'react';
import { EngineTelemetry } from '../engine/types';
import { Trophy, Volume2, VolumeX, Flag, Sparkles, Maximize, Minimize, ChevronLeft, ChevronRight } from 'lucide-react';
import { funRaceAudio } from '../engine/AudioManager';

interface FunRaceHUDProps {
  telemetry: EngineTelemetry | null;
  isMuted: boolean;
  isFullscreen: boolean;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onRestart: () => void;
  onSteer?: (dir: number) => void;
}

export const FunRaceHUD: React.FC<FunRaceHUDProps> = ({
  telemetry,
  isMuted,
  isFullscreen,
  onToggleMute,
  onToggleFullscreen,
  onRestart,
  onSteer
}) => {
  if (!telemetry) return null;

  const rankColor =
    telemetry.playerRank === 1
      ? 'from-amber-400 to-yellow-500 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
      : telemetry.playerRank === 2
      ? 'from-slate-200 to-slate-400 text-slate-950 border-slate-300'
      : 'from-orange-500 to-rose-600 text-white border-rose-400';

  const rankSuffix =
    telemetry.playerRank === 1 ? 'st' : telemetry.playerRank === 2 ? 'nd' : 'rd';

  return (
    <div className="absolute inset-0 pointer-events-none select-none font-sans z-10">
      {/* ========================================================= */}
      {/* --- TOP SECTION: BADGES + COMPACT TRACK PROGRESS BAR --- */}
      {/* (Permanently pinned to the very top, 100% clear of track!) */}
      {/* ========================================================= */}
      <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-3 sm:right-3 max-w-xl mx-auto flex flex-col items-center gap-1.5 pointer-events-auto" data-hud-control="true">
        {/* Top Header Row */}
        <div className="w-full flex items-center justify-between gap-2 sm:gap-3">
          {/* Level Indicator */}
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 shadow-xl">
            <span className="text-xs font-mono font-black text-cyan-400 uppercase tracking-wider">
              LVL {telemetry.level}/{telemetry.totalLevels}
            </span>
          </div>

          {/* Center Rank Badge */}
          <div className="flex items-center gap-2">
            <div
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r ${rankColor} border-2 font-black text-xs sm:text-sm tracking-wider flex items-center gap-1.5 transition-all duration-300 shadow-xl`}
            >
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
              <span>
                {telemetry.playerRank}
                <sup>{rankSuffix}</sup> / {telemetry.totalRunners}
              </span>
            </div>
          </div>

          {/* Right Controls: Coins, Audio & Fullscreen */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Coin Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-2xl bg-black/75 backdrop-blur-md border border-amber-500/30 text-amber-400 font-black text-xs shadow-xl">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{telemetry.coinsEarned}</span>
            </div>

            {/* Sound Mute Toggle */}
            <button
              onClick={() => {
                funRaceAudio.playCoin();
                onToggleMute();
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-95"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={onToggleFullscreen}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 hover:border-amber-400/60 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-95"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 text-amber-400" />
              ) : (
                <Maximize className="w-4 h-4 text-amber-400" />
              )}
            </button>
          </div>
        </div>

        {/* Compact Race Progress Bar (PINNED AT THE TOP UNDER BADGES) */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto pt-0.5">
          <div className="relative w-full h-3 sm:h-3.5 bg-black/85 backdrop-blur-md rounded-full border border-white/20 p-0.5 shadow-2xl flex items-center">
            {/* Progress Fill */}
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-amber-400 rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(0,240,255,0.7)]"
              style={{ width: `${Math.max(4, telemetry.playerProgress)}%` }}
            />

            {/* Bot Markers */}
            {telemetry.runners
              .filter((r) => !r.isPlayer)
              .map((bot) => (
                <div
                  key={bot.id}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-white shadow-md transition-all duration-100"
                  style={{
                    left: `${Math.max(2, Math.min(98, bot.progress * 100))}%`,
                    backgroundColor: `#${bot.color}`
                  }}
                  title={bot.name}
                />
              ))}

            {/* Player Marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_15px_#00F0FF] flex items-center justify-center text-[10px] font-black text-slate-950 transition-all duration-100"
              style={{ left: `${Math.max(2, Math.min(98, telemetry.playerProgress))}%` }}
            >
              🏃
            </div>

            {/* Finish Line Flag */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full bg-amber-400 border border-white flex items-center justify-center shadow-lg">
              <Flag className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* --- CENTER: COUNTDOWN OVERLAY ONLY (TRACK VIEW 100% CLEAR!) --- */}
      {/* ========================================================= */}
      {telemetry.gameState === 'COUNTDOWN' && telemetry.countdown && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center justify-center">
            <span
              key={String(telemetry.countdown)}
              className="text-8xl sm:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-amber-400 to-yellow-600 drop-shadow-[0_0_40px_rgba(251,191,36,0.8)] animate-in zoom-in-50 duration-300"
            >
              {telemetry.countdown}
            </span>
            <span className="text-xs sm:text-sm font-mono font-bold text-cyan-300 uppercase tracking-widest mt-2 bg-black/60 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
              GET READY TO RUN!
            </span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* --- BOTTOM SECTION: DEDICATED STEERING & SPRINT ACTIONS --- */}
      {/* ========================================================= */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-3 sm:right-3 flex flex-col items-center gap-2 pointer-events-none">
        {telemetry.gameState === 'RACING' && (
          <div className="w-full max-w-sm sm:max-w-md flex items-center justify-between gap-2 px-2 pointer-events-auto" data-hud-control="true">
            {/* Tactile Left Steer Button */}
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                onSteer?.(-1);
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                onSteer?.(0);
              }}
              onPointerLeave={() => onSteer?.(0)}
              className="flex-1 py-2.5 sm:py-3 px-2 sm:px-3 rounded-2xl bg-black/80 hover:bg-black/95 active:bg-cyan-500/20 backdrop-blur-md border-2 border-cyan-400/40 active:border-cyan-400 text-cyan-300 font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-1 shadow-xl transition-all cursor-pointer active:scale-95"
              title="Steer Left (A / Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span>LEFT</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] bg-white/10 rounded font-mono text-cyan-200">A</kbd>
            </button>

            {/* SPRINTING Status Pill */}
            <div
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl backdrop-blur-md border text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-300 shadow-2xl flex items-center justify-center gap-2 ${
                telemetry.isHolding
                  ? 'bg-emerald-500/95 border-emerald-300 text-white shadow-[0_0_25px_rgba(16,185,129,0.5)] scale-105'
                  : 'bg-black/80 border-amber-400/60 text-amber-300 animate-pulse'
              }`}
            >
              {telemetry.isHolding ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span>RUNNING!</span>
                </>
              ) : (
                <span>HOLD SCREEN</span>
              )}
            </div>

            {/* Tactile Right Steer Button */}
            <button
              onPointerDown={(e) => {
                e.stopPropagation();
                onSteer?.(1);
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                onSteer?.(0);
              }}
              onPointerLeave={() => onSteer?.(0)}
              className="flex-1 py-2.5 sm:py-3 px-2 sm:px-3 rounded-2xl bg-black/80 hover:bg-black/95 active:bg-cyan-500/20 backdrop-blur-md border-2 border-cyan-400/40 active:border-cyan-400 text-cyan-300 font-black text-xs sm:text-sm tracking-wider flex items-center justify-center gap-1 shadow-xl transition-all cursor-pointer active:scale-95"
              title="Steer Right (D / Right Arrow)"
            >
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] bg-white/10 rounded font-mono text-cyan-200">D</kbd>
              <span>RIGHT</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        )}

        {/* Global Controls Tip Banner */}
        {telemetry.gameState === 'RACING' && (
          <div className="text-[10px] sm:text-[11px] font-mono text-slate-300 bg-black/80 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg pointer-events-auto">
            🎮 Hold Click/Touch/Space to Run • [A / D] or Touch Arrows to Steer Left & Right
          </div>
        )}
      </div>
    </div>
  );
};
