'use client';

import React from 'react';
import { GamePhase, PlayerState, BossEntity } from '../engine/types';

interface GiantRushDebugOverlayProps {
  fps: number;
  phase: GamePhase;
  player: PlayerState;
  finishLineZ: number;
  bossArenaZ: number;
  boss: BossEntity | null;
  qteTime: number;
  qteTaps: number;
  powerRatio: number;
  transitionLog: string[];
}

export const GiantRushDebugOverlay: React.FC<GiantRushDebugOverlayProps> = ({
  fps,
  phase,
  player,
  finishLineZ,
  bossArenaZ,
  boss,
  qteTime,
  qteTaps,
  powerRatio,
  transitionLog
}) => {
  return (
    <div className="absolute top-16 left-3 z-50 p-3 rounded-2xl bg-black/85 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 backdrop-blur-md shadow-2xl pointer-events-none select-none max-w-xs space-y-1.5">
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1 font-bold text-cyan-400">
        <span>GIANT RUSH DEV MONITOR</span>
        <span className="text-amber-400">{fps} FPS</span>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
        <div>STATE: <span className="text-white font-bold">{phase}</span></div>
        <div>COLOR: <span className="uppercase font-bold" style={{ color: player.color }}>{player.color}</span></div>
        <div>POS X: <span className="text-white">{player.x.toFixed(2)}m</span></div>
        <div>POS Z: <span className="text-white">{player.z.toFixed(1)}m</span></div>
        <div>SCALE: <span className="text-white">{player.scale.toFixed(2)}x</span></div>
        <div>POWER: <span className="text-white">{player.power}</span></div>
        <div>FINISH Z: <span className="text-white">{finishLineZ}m</span></div>
        <div>ARENA Z: <span className="text-white">{bossArenaZ}m</span></div>
      </div>

      {boss && (
        <div className="border-t border-cyan-500/20 pt-1 space-y-0.5">
          <div className="text-red-400 font-bold">BOSS ENTITY:</div>
          <div className="flex justify-between">
            <span>HP: {boss.currentHp}/{boss.maxHp}</span>
            <span>QTE: {qteTime.toFixed(1)}s ({qteTaps} taps)</span>
          </div>
          <div>POWER BOOST: <span className="text-amber-300">{(powerRatio * 100).toFixed(0)}%</span></div>
          {boss.isKnockedOut && (
            <div className="text-lime-400">LAUNCH DIST: {boss.launchDistance.toFixed(1)}m</div>
          )}
        </div>
      )}

      {transitionLog.length > 0 && (
        <div className="border-t border-cyan-500/20 pt-1">
          <div className="text-slate-400 font-bold">FSM HISTORY:</div>
          <div className="text-[9px] text-slate-300 space-y-0.5">
            {transitionLog.slice(-3).map((log, idx) => (
              <div key={idx} className="truncate">• {log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
