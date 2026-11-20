'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FunRaceEngine } from './engine/FunRaceEngine';
import { EngineTelemetry } from './engine/types';
import { FunRaceHUD } from './ui/FunRaceHUD';
import { FunRaceVictoryModal } from './ui/FunRaceVictoryModal';
import { FunRaceDefeatModal } from './ui/FunRaceDefeatModal';
import { funRaceAudio } from './engine/AudioManager';

export const FunRaceGame: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<FunRaceEngine | null>(null);

  const [telemetry, setTelemetry] = useState<EngineTelemetry | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [victoryData, setVictoryData] = useState<{ level: number; coins: number } | null>(null);
  const [defeatRank, setDefeatRank] = useState<number | null>(null);

  // Initialize Three.js Engine with Centralized Input Manager
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const engine = new FunRaceEngine(canvasMountRef.current);
    engineRef.current = engine;

    engine.setCallbacks(
      (tel) => {
        setTelemetry({ ...tel });
      },
      (coins, rank) => {
        setVictoryData({
          level: engine.currentLevelIndex + 1,
          coins
        });
      },
      (rank) => {
        setDefeatRank(rank);
      }
    );

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // Fullscreen Management
  const handleToggleFullscreen = useCallback(() => {
    if (!gameContainerRef.current) return;

    if (!document.fullscreenElement) {
      gameContainerRef.current.requestFullscreen().catch((err) => {
        console.warn('[FunRace Fullscreen] Failed to enter fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      setTimeout(() => {
        if (engineRef.current) {
          engineRef.current.handleResize();
        }
      }, 50);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      funRaceAudio.setMuted(next);
      return next;
    });
  };

  const handleNextLevel = () => {
    setVictoryData(null);
    setDefeatRank(null);
    if (engineRef.current) {
      engineRef.current.nextLevel();
    }
  };

  const handleRetryLevel = () => {
    setVictoryData(null);
    setDefeatRank(null);
    if (engineRef.current) {
      engineRef.current.retryLevel();
    }
  };

  return (
    <div
      ref={gameContainerRef}
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border-2 border-cyan-500/30 touch-none select-none ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-none w-screen h-screen'
          : 'aspect-[16/10] min-h-[480px] max-h-[82vh]'
      }`}
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full cursor-pointer" />

      {/* Reactive HUD Overlay */}
      <FunRaceHUD
        telemetry={telemetry}
        isMuted={isMuted}
        isFullscreen={isFullscreen}
        onToggleMute={handleToggleMute}
        onToggleFullscreen={handleToggleFullscreen}
        onRestart={handleRetryLevel}
      />

      {/* Victory Celebration Modal */}
      {victoryData && (
        <FunRaceVictoryModal
          level={victoryData.level}
          coins={victoryData.coins}
          onNextLevel={handleNextLevel}
          onReplay={handleRetryLevel}
        />
      )}

      {/* Defeat / Elimination Modal */}
      {defeatRank !== null && (
        <FunRaceDefeatModal rank={defeatRank} onRetry={handleRetryLevel} />
      )}
    </div>
  );
};

export default FunRaceGame;
