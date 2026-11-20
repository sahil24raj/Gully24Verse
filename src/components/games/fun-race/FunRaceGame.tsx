'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FunRaceEngine } from './engine/FunRaceEngine';
import { EngineTelemetry } from './engine/types';
import { FunRaceHUD } from './ui/FunRaceHUD';
import { FunRaceVictoryModal } from './ui/FunRaceVictoryModal';
import { FunRaceDefeatModal } from './ui/FunRaceDefeatModal';
import { funRaceAudio } from './engine/AudioManager';

export const FunRaceGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<FunRaceEngine | null>(null);

  const [telemetry, setTelemetry] = useState<EngineTelemetry | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [victoryData, setVictoryData] = useState<{ level: number; coins: number } | null>(null);
  const [defeatRank, setDefeatRank] = useState<number | null>(null);

  // Initialize Three.js Engine
  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new FunRaceEngine(containerRef.current);
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

  // Input Handlers: Pointer & Keyboard (Spacebar)
  const handlePointerDown = useCallback((e: React.PointerEvent | React.MouseEvent | React.TouchEvent) => {
    // Only trigger if not clicking HUD buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    if (engineRef.current) {
      engineRef.current.setHolding(true);
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.setHolding(false);
    }
  }, []);

  // Global window listeners to catch pointerup outside canvas
  useEffect(() => {
    const onWindowPointerUp = () => {
      if (engineRef.current) {
        engineRef.current.setHolding(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        if (engineRef.current) {
          engineRef.current.setHolding(true);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (engineRef.current) {
          engineRef.current.setHolding(false);
        }
      }
    };

    window.addEventListener('pointerup', onWindowPointerUp);
    window.addEventListener('touchend', onWindowPointerUp);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('touchend', onWindowPointerUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
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
      className="relative w-full aspect-[16/10] min-h-[480px] max-h-[82vh] rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border-2 border-cyan-500/30 touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
      onTouchCancel={handlePointerUp}
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-pointer" />

      {/* Reactive HUD Overlay */}
      <FunRaceHUD
        telemetry={telemetry}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
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
