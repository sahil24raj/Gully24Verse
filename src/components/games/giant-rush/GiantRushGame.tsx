'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { GamePhase, LevelConfig, PlayerState } from './engine/types';
import { LEVELS, PLAYER_LATERAL_LIMIT } from './engine/constants';
import { GiantRushEngine } from './engine/GiantRushEngine';
import { AudioEffects } from './engine/AudioEffects';
import { GiantRushHUD } from './ui/GiantRushHUD';
import { BossQTEOverlay } from './ui/BossQTEOverlay';
import { VictoryModal } from './ui/VictoryModal';
import { DefeatModal } from './ui/DefeatModal';
import { Play, RotateCcw, Volume2, VolumeX, Shield, Sparkles } from 'lucide-react';

export const GiantRushGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GiantRushEngine | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Store actions
  const { addCoins, addXP } = useAppStore();

  // Game Lifecycle State
  const [phase, setPhase] = useState<GamePhase>('MENU');
  const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [defeatReason, setDefeatReason] = useState<'CRUSHED' | 'BOSS_DEFEATED'>('CRUSHED');

  // Active Player State
  const [playerState, setPlayerState] = useState<PlayerState>({
    x: 0,
    y: 0,
    z: 0,
    scale: 1.0,
    targetScale: 1.0,
    color: 'red',
    power: 120,
    speedZ: 17,
    streakCount: 0,
    isInvulnerable: false,
    isPunching: false
  });

  const playerStateRef = useRef<PlayerState>(playerState);
  playerStateRef.current = playerState;

  const currentLevel: LevelConfig = LEVELS[currentLevelIdx % LEVELS.length];

  // Touch & Mouse Lateral Control State
  const isPointerDownRef = useRef<boolean>(false);
  const lastPointerXRef = useRef<number>(0);
  const keysDownRef = useRef<{ [key: string]: boolean }>({});

  // 1. Initialize Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.parentElement?.clientWidth || 1280;
    canvas.height = canvas.parentElement?.clientHeight || 720;

    const engine = new GiantRushEngine(canvas);
    engine.initLevel(currentLevel);
    engineRef.current = engine;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement || !engineRef.current) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      canvas.width = w;
      canvas.height = h;
      engineRef.current.resize(w, h);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentLevelIdx]);

  // 2. Keyboard & Touch Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysDownRef.current[e.key] = true;
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        setIsPaused((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDownRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Pointer Drag Handlers (Both Mouse and Touch)
  const handlePointerDown = (clientX: number) => {
    isPointerDownRef.current = true;
    lastPointerXRef.current = clientX;
  };

  const handlePointerMove = (clientX: number) => {
    if (!isPointerDownRef.current) return;
    const deltaX = clientX - lastPointerXRef.current;
    lastPointerXRef.current = clientX;

    // Lateral move factor
    const moveSensitivity = 0.022;
    setPlayerState((prev) => {
      const nextX = Math.max(
        -PLAYER_LATERAL_LIMIT,
        Math.min(PLAYER_LATERAL_LIMIT, prev.x + deltaX * moveSensitivity)
      );
      return { ...prev, x: nextX };
    });
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  // Start Run
  const handleStartRun = () => {
    setPhase('RUNNING');
    setPlayerState({
      x: 0,
      y: 0,
      z: 0,
      scale: 1.0,
      targetScale: 1.0,
      color: 'red',
      power: 120,
      speedZ: currentLevel.forwardSpeed,
      streakCount: 0,
      isInvulnerable: false,
      isPunching: false
    });
    if (engineRef.current) {
      engineRef.current.initLevel(currentLevel);
    }
  };

  // Boss QTE Tap Action
  const handleBossQteTap = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.boss.registerTap();
    AudioEffects.playCollectMatch(Math.floor(Math.random() * 6));
  }, []);

  // 3. Master 60FPS Game Loop
  useEffect(() => {
    let isMounted = true;

    const loop = (timestamp: number) => {
      if (!isMounted) return;

      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.08);
      lastTimeRef.current = timestamp;

      const engine = engineRef.current;
      const currentP = playerStateRef.current;

      if (engine && !isPaused) {
        // --- KEYBOARD LATERAL STEERING ---
        if (phase === 'RUNNING') {
          let steerDir = 0;
          if (keysDownRef.current['ArrowLeft'] || keysDownRef.current['a'] || keysDownRef.current['A']) {
            steerDir -= 1;
          }
          if (keysDownRef.current['ArrowRight'] || keysDownRef.current['d'] || keysDownRef.current['D']) {
            steerDir += 1;
          }

          if (steerDir !== 0) {
            const nextX = Math.max(
              -PLAYER_LATERAL_LIMIT,
              Math.min(PLAYER_LATERAL_LIMIT, currentP.x + steerDir * delta * 14.0)
            );
            playerStateRef.current.x = nextX;
          }

          // Smooth scale interpolation towards targetScale
          const nextScale = currentP.scale + (currentP.targetScale - currentP.scale) * Math.min(1, delta * 12);
          playerStateRef.current.scale = nextScale;

          // Forward locomotion
          playerStateRef.current.z += currentP.speedZ * delta;

          // Check if crushed (scale dropped below threshold)
          if (nextScale < 0.45) {
            setDefeatReason('CRUSHED');
            setPhase('DEFEAT');
            AudioEffects.playDefeat();
          }

          // 1. Check Collectible Collisions
          const colResult = engine.collectibles.checkCollisions(
            playerStateRef.current.x,
            playerStateRef.current.z,
            playerStateRef.current.scale,
            playerStateRef.current.color,
            playerStateRef.current.streakCount
          );

          if (colResult.collected) {
            engine.player.triggerSquashStretch();
            const nextTarget = Math.max(0.4, Math.min(3.8, currentP.targetScale + colResult.deltaScale));
            const nextPower = Math.max(20, currentP.power + colResult.deltaPower);
            const nextStreak = colResult.matched ? currentP.streakCount + 1 : 0;

            setPlayerState((prev) => ({
              ...prev,
              targetScale: nextTarget,
              power: nextPower,
              streakCount: nextStreak
            }));
          }

          // 2. Check Color Gate Crossings
          const crossedColor = engine.track.checkGateCrossings(playerStateRef.current.z);
          if (crossedColor) {
            engine.triggerScreenShake(0.35);
            setPlayerState((prev) => ({
              ...prev,
              color: crossedColor
            }));
          }

          // 3. Check Obstacle Hits
          const hitHazard = engine.track.checkObstacleCollisions(
            playerStateRef.current.x,
            playerStateRef.current.z,
            playerStateRef.current.scale
          );
          if (hitHazard) {
            engine.triggerScreenShake(0.6);
            setPlayerState((prev) => ({
              ...prev,
              targetScale: Math.max(0.4, prev.targetScale - 0.25),
              power: Math.max(20, prev.power - 40),
              streakCount: 0
            }));
          }

          // 4. Check Finish Line Crossing -> Transition to Boss Fight!
          if (playerStateRef.current.z >= engine.track.finishLineZ) {
            setPhase('BOSS_INTRO');
            // Stop lateral steer, guide to center
            playerStateRef.current.x = 0;
            playerStateRef.current.speedZ = 12;

            // Wait 1.2s for cinematic camera swing then start QTE
            setTimeout(() => {
              if (isMounted) {
                setPhase('BOSS_QTE');
                engine.boss.startQte();
              }
            }, 1200);
          }
        }

        // --- BOSS ARENA PHASES ---
        if (phase === 'BOSS_QTE') {
          // Check if QTE countdown expired -> Trigger punch!
          if (engine.boss.qteTimeRemaining <= 0) {
            setPhase('BOSS_PUNCH');
            engine.player.triggerPunch();

            // Hit-stop pause for maximum visual impact
            setTimeout(() => {
              if (!isMounted) return;
              engine.triggerScreenShake(0.85);
              const punchResult = engine.boss.executePunch(currentP.power);

              if (punchResult.isVictory) {
                setPhase('BOSS_LAUNCH');
                // Calculate rewards
                setTimeout(() => {
                  if (isMounted) {
                    const earned = engine.boss.getEarnedMultiplier();
                    const rewardCoins = Math.round(250 * earned.mult);
                    addCoins(rewardCoins);
                    addXP(400);
                    setPhase('VICTORY');
                  }
                }, 2200);
              } else {
                setDefeatReason('BOSS_DEFEATED');
                setPhase('DEFEAT');
                AudioEffects.playDefeat();
              }
            }, 300);
          }
        }

        // Update 3D Engine & Scene Graph
        engine.update(delta, phase, playerStateRef.current);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [phase, isPaused, addCoins, addXP]);

  const progressPercent = Math.min(
    100,
    Math.max(0, (playerState.z / currentLevel.trackLength) * 100)
  );

  return (
    <div
      className="relative w-full h-[620px] sm:h-[720px] xl:h-[800px] bg-[#0F172A] rounded-3xl overflow-hidden border border-white/10 shadow-2xl select-none"
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onMouseMove={(e) => handlePointerMove(e.clientX)}
      onMouseUp={handlePointerUp}
      onTouchStart={(e) => e.touches[0] && handlePointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => e.touches[0] && handlePointerMove(e.touches[0].clientX)}
      onTouchEnd={handlePointerUp}
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* IN-GAME HUD */}
      {(phase === 'RUNNING' || phase === 'BOSS_INTRO') && (
        <GiantRushHUD
          player={playerState}
          levelNum={currentLevel.levelNum}
          progressPercent={progressPercent}
          isMuted={isMuted}
          onToggleMute={() => {
            const next = !isMuted;
            setIsMuted(next);
            AudioEffects.setMuted(next);
          }}
          onPause={() => setIsPaused((prev) => !prev)}
        />
      )}

      {/* BOSS QTE OVERLAY */}
      {phase === 'BOSS_QTE' && engineRef.current?.boss.boss && (
        <BossQTEOverlay
          boss={engineRef.current.boss.boss}
          timeRemaining={engineRef.current.boss.qteTimeRemaining}
          powerRatio={engineRef.current.boss.powerRatio}
          tapCount={engineRef.current.boss.qteTaps}
          onTap={handleBossQteTap}
        />
      )}

      {/* MAIN MENU SCREEN */}
      {phase === 'MENU' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 bg-black/70 backdrop-blur-md text-center">
          <div className="w-full max-w-md flex flex-col items-center gap-5">
            {/* Title Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs uppercase tracking-widest shadow-md">
              <Sparkles className="w-4 h-4 fill-amber-300" />
              <span>3D CHROMA RUNNER &amp; BRAWLER</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl font-black uppercase text-white tracking-tight drop-shadow-[0_4px_24px_rgba(255,159,28,0.5)]">
              GIANT <span className="text-amber-400">RUSH!</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-sm">
              Absorb same-colored figures to grow colossal, cross color gates, avoid obstacles, and punch the Titan boss into the stratosphere!
            </p>

            {/* Play Button */}
            <button
              onClick={handleStartRun}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base uppercase tracking-wider shadow-[0_0_32px_rgba(255,159,28,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer mt-2"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>START RUN</span>
            </button>

            {/* Instructions */}
            <div className="flex items-center justify-center gap-6 text-[11px] font-bold text-slate-400 pt-2 border-t border-white/10 w-full">
              <span>🖱️ Drag to Steer</span>
              <span>↔️ Left / Right Keys</span>
              <span>👊 Tap Fast on Boss</span>
            </div>
          </div>
        </div>
      )}

      {/* VICTORY MODAL */}
      {phase === 'VICTORY' && engineRef.current?.boss && (
        <VictoryModal
          levelNum={currentLevel.levelNum}
          launchDistance={engineRef.current.boss.boss?.launchDistance || 150}
          multiplierLabel={engineRef.current.boss.getEarnedMultiplier().label}
          multiplierVal={engineRef.current.boss.getEarnedMultiplier().mult}
          baseCoins={250}
          onNextLevel={() => {
            setCurrentLevelIdx((prev) => prev + 1);
            handleStartRun();
          }}
          onReplay={handleStartRun}
        />
      )}

      {/* DEFEAT MODAL */}
      {phase === 'DEFEAT' && (
        <DefeatModal reason={defeatReason} onRetry={handleStartRun} />
      )}
    </div>
  );
};

export default GiantRushGame;
