'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { JellyRunEngine } from './engine/JellyRunEngine';
import { GameState, GameStats } from './engine/types';
import { JellyRunHUD } from './ui/JellyRunHUD';
import { JellyRunControlsOverlay } from './ui/JellyRunControlsOverlay';
import { JellyRunVictoryModal } from './ui/JellyRunVictoryModal';
import { JellyRunDefeatModal } from './ui/JellyRunDefeatModal';
import { useAppStore } from '@/store/useAppStore';

export const JellyRunGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<JellyRunEngine | null>(null);

  const { submitGameScore, updateHighScore } = useAppStore();

  const [gameState, setGameState] = useState<GameState>('START');
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highestNumber: 2,
    mergesCount: 0,
    splitsCount: 0,
    level: 1,
    multiplier: 1.0,
    finalScore: 0
  });
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSplit, setIsSplit] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new JellyRunEngine(containerRef.current);
    engineRef.current = engine;

    engine.onStateChange = (newState) => {
      setGameState(newState);
      if (newState === 'VICTORY') {
        const finalScore = Math.round(engine.score * (engine.track.getMultiplierAtZ(engine.player.forwardZ) || 1));
        submitGameScore('jelly-run', finalScore, true).catch(() => {});
        updateHighScore('jelly-run', finalScore);
      }
    };

    engine.onStatsUpdate = (newStats) => {
      setStats({ ...newStats });
      setIsSplit(engine.player.isSplit);
    };

    engine.onProgressUpdate = (p) => {
      setProgress(p);
    };

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [submitGameScore, updateHighScore]);

  const handleStartGame = useCallback(() => {
    engineRef.current?.startGame();
  }, []);

  const handlePause = useCallback(() => {
    if (gameState === 'RUNNING') {
      engineRef.current?.pauseGame();
    } else if (gameState === 'PAUSED') {
      engineRef.current?.resumeGame();
    }
  }, [gameState]);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      engineRef.current?.audio.setMuted(next);
      return next;
    });
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const handleToggleSplit = useCallback(() => {
    engineRef.current?.toggleSplit();
    if (engineRef.current) {
      setIsSplit(engineRef.current.player.isSplit);
    }
  }, []);

  const handleSteer = useCallback((normX: number) => {
    engineRef.current?.setSteering(normX);
  }, []);

  const handleNextLevel = useCallback(() => {
    engineRef.current?.nextLevel();
    engineRef.current?.startGame();
  }, []);

  const handleRetry = useCallback(() => {
    engineRef.current?.restartLevel();
    engineRef.current?.startGame();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[85vh] rounded-3xl overflow-hidden bg-slate-950 border border-cyan-500/30 shadow-2xl select-none"
    >
      {/* 3D WebGL Canvas mounted here */}

      {/* Control Surface & Gesture Interaction */}
      <JellyRunControlsOverlay
        onSteer={handleSteer}
        onToggleSplit={handleToggleSplit}
        isGameRunning={gameState === 'RUNNING'}
        onStartGame={handleStartGame}
      />

      {/* Heads Up Display */}
      <JellyRunHUD
        stats={stats}
        progress={progress}
        isMuted={isMuted}
        isSplit={isSplit}
        onToggleMute={handleToggleMute}
        onPause={handlePause}
        onToggleFullscreen={handleToggleFullscreen}
        onToggleSplit={handleToggleSplit}
      />

      {/* Pause Screen */}
      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-[#0F172A] border border-cyan-500/30 text-center max-w-xs shadow-2xl">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">GAME PAUSED</h3>
            <p className="text-xs text-slate-300">Take a breath! Ready to merge?</p>
            <button
              onClick={handlePause}
              className="w-full py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-sm uppercase tracking-wider cursor-pointer active:scale-95 transition-all"
            >
              RESUME RUN
            </button>
            <button
              onClick={handleRetry}
              className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
            >
              RESTART LEVEL
            </button>
          </div>
        </div>
      )}

      {/* Victory Celebration */}
      {gameState === 'VICTORY' && (
        <JellyRunVictoryModal
          stats={stats}
          onNextLevel={handleNextLevel}
          onReplay={handleRetry}
        />
      )}

      {/* Defeat Splat */}
      {gameState === 'DEFEAT' && (
        <JellyRunDefeatModal
          stats={stats}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
};

export default JellyRunGame;
