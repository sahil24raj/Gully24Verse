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
import { GiantRushDebugOverlay } from './ui/GiantRushDebugOverlay';
import { Play, Sparkles, Terminal } from 'lucide-react';

export const GiantRushGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GiantRushEngine | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Store actions
  const { addCoins, addXP } = useAppStore();

  // Game Lifecycle State
  const [phase, setPhase] = useState<GamePhase>('MENU');
  const phaseRef = useRef<GamePhase>('MENU');
  phaseRef.current = phase;

  const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  isPausedRef.current = isPaused;

  const [defeatReason, setDefeatReason] = useState<'CRUSHED' | 'BOSS_DEFEATED'>('CRUSHED');

  // Reactive Boss QTE state for fluid 60FPS UI feedback
  const [qteTime, setQteTime] = useState<number>(3.0);
  const [qteTaps, setQteTaps] = useState<number>(0);
  const [qtePowerRatio, setQtePowerRatio] = useState<number>(1.0);

  // Development Debug Monitor State
  const [isDebugOpen, setIsDebugOpen] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);
  const [transitionLog, setTransitionLog] = useState<string[]>([]);

  // Active Player State
  const [playerState, setPlayerState] = useState<PlayerState>({
    x: 0,
    y: 0,
    z: 0,
    scale: 1.0,
    targetScale: 1.0,
    color: 'red',
    power: 120,
    speedZ: 16,
    streakCount: 0,
    isInvulnerable: false,
    isPunching: false
  });

  // Single Source of Truth for Physics and Locomotion
  const playerStateRef = useRef<PlayerState>(playerState);
  const playerVxRef = useRef<number>(0); // Velocity interpolation

  // FSM Timers & punch result
  const phaseTimerRef = useRef<number>(0);
  const punchExecutedRef = useRef<boolean>(false);
  const punchVictoryRef = useRef<boolean>(false);

  const currentLevel: LevelConfig = LEVELS[currentLevelIdx % LEVELS.length];
  const currentLevelRef = useRef<LevelConfig>(currentLevel);
  currentLevelRef.current = currentLevel;

  // Touch & Mouse Lateral Control State
  const isPointerDownRef = useRef<boolean>(false);
  const lastPointerXRef = useRef<number>(0);
  const keysDownRef = useRef<{ [key: string]: boolean }>({});

  const logTransition = useCallback((from: GamePhase, to: GamePhase, reason?: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `${from} -> ${to}${reason ? ` (${reason})` : ''}`;
    setTransitionLog((prev) => [...prev.slice(-6), `${timestamp}: ${entry}`]);
    console.log(`[GiantRush FSM ${timestamp}] ${entry}`);
  }, []);

  // Boss QTE Tap Action (Responsive & Real-time)
  const handleBossQteTap = useCallback(() => {
    if (!engineRef.current || phaseRef.current !== 'BOSS_QTE') return;
    engineRef.current.boss.registerTap();
    setQteTaps(engineRef.current.boss.qteTaps);
    setQtePowerRatio(engineRef.current.boss.powerRatio);
    AudioEffects.playCollectMatch(Math.floor(Math.random() * 6));
  }, []);

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
    };
  }, [currentLevelIdx]);

  // 2. Continuous Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in text inputs
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      keysDownRef.current[e.key] = true;
      keysDownRef.current[e.code] = true;

      // Prevent default page scrolling for gameplay keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Space', 'KeyA', 'KeyD'].includes(e.code) ||
          ['a', 'A', 'd', 'D', ' '].includes(e.key)) {
        e.preventDefault();
      }

      // Toggle Debug Monitor
      if (e.key === '`' || e.code === 'Backquote' || e.key === 'F3') {
        setIsDebugOpen((prev) => !prev);
      }

      // Space / Enter can also tap in QTE mode!
      if (phaseRef.current === 'BOSS_QTE' && (e.code === 'Space' || e.key === ' ' || e.code === 'Enter')) {
        handleBossQteTap();
      }

      // Pause toggle
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        setIsPaused((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDownRef.current[e.key] = false;
      keysDownRef.current[e.code] = false;
    };

    const handleBlur = () => {
      // Clear key states so player doesn't keep running when window loses focus
      keysDownRef.current = {};
      isPointerDownRef.current = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleBossQteTap]);

  // Pointer Drag Handlers (Both Mouse and Touch)
  const handlePointerDown = (clientX: number) => {
    isPointerDownRef.current = true;
    lastPointerXRef.current = clientX;

    // Direct tap in QTE mode
    if (phaseRef.current === 'BOSS_QTE') {
      handleBossQteTap();
    }
  };

  const handlePointerMove = (clientX: number) => {
    if (!isPointerDownRef.current || phaseRef.current !== 'RUNNING') return;
    const deltaX = clientX - lastPointerXRef.current;
    lastPointerXRef.current = clientX;

    // Smooth lateral movement directly into playerStateRef
    const moveSensitivity = 0.024;
    const nextX = Math.max(
      -PLAYER_LATERAL_LIMIT,
      Math.min(PLAYER_LATERAL_LIMIT, playerStateRef.current.x + deltaX * moveSensitivity)
    );
    playerStateRef.current.x = nextX;
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  // Start / Restart Run
  const handleStartRun = () => {
    const freshState: PlayerState = {
      x: 0,
      y: 0,
      z: 0,
      scale: 1.0,
      targetScale: 1.0,
      color: 'red',
      power: 120,
      speedZ: currentLevelRef.current.forwardSpeed,
      streakCount: 0,
      isInvulnerable: false,
      isPunching: false
    };

    playerStateRef.current = freshState;
    playerVxRef.current = 0;
    phaseTimerRef.current = 0;
    punchExecutedRef.current = false;
    punchVictoryRef.current = false;

    setPlayerState(freshState);
    setQteTime(3.0);
    setQteTaps(0);
    setQtePowerRatio(1.0);

    if (engineRef.current) {
      engineRef.current.initLevel(currentLevelRef.current);
      engineRef.current.boss.resetBoss();
    }

    logTransition(phaseRef.current, 'RUNNING', 'User started run');
    phaseRef.current = 'RUNNING';
    setPhase('RUNNING');
  };

  // 3. MASTER 60FPS GAMEPLAY & PHYSICS LOOP
  useEffect(() => {
    let isMounted = true;
    let hudSyncCounter = 0;
    let framesThisSec = 0;
    let lastFpsCalc = performance.now();

    const loop = (timestamp: number) => {
      if (!isMounted) return;

      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.08);
      lastTimeRef.current = timestamp;

      // Track FPS
      framesThisSec++;
      if (timestamp - lastFpsCalc >= 500) {
        setFps(Math.round((framesThisSec * 1000) / (timestamp - lastFpsCalc)));
        framesThisSec = 0;
        lastFpsCalc = timestamp;
      }

      const engine = engineRef.current;
      const currentPhase = phaseRef.current;
      const paused = isPausedRef.current;

      if (engine && !paused) {
        // ==========================================
        // 1. RUNNING PHASE
        // ==========================================
        if (currentPhase === 'RUNNING') {
          // Continuous Lateral Keyboard Steering
          // A / Left Arrow = Move Left (decreases screen X)
          // D / Right Arrow = Move Right (increases screen X)
          let targetSteerDir = 0;
          const k = keysDownRef.current;
          if (k['ArrowLeft'] || k['a'] || k['A'] || k['KeyA']) {
            targetSteerDir -= 1;
          }
          if (k['ArrowRight'] || k['d'] || k['D'] || k['KeyD']) {
            targetSteerDir += 1;
          }

          // Acceleration and velocity smoothing
          const maxLateralSpeed = 15.0; // m/s
          const targetVx = targetSteerDir * maxLateralSpeed;
          playerVxRef.current += (targetVx - playerVxRef.current) * Math.min(1, delta * 22);

          const nextX = Math.max(
            -PLAYER_LATERAL_LIMIT,
            Math.min(PLAYER_LATERAL_LIMIT, playerStateRef.current.x + playerVxRef.current * delta)
          );
          playerStateRef.current.x = nextX;

          // Smooth scale lerp towards targetScale
          const nextScale = playerStateRef.current.scale + 
            (playerStateRef.current.targetScale - playerStateRef.current.scale) * Math.min(1, delta * 12);
          playerStateRef.current.scale = nextScale;

          // Constant forward runner speed
          playerStateRef.current.z += playerStateRef.current.speedZ * delta;

          // Check Crushed Defeat Condition
          if (nextScale < 0.42) {
            logTransition('RUNNING', 'DEFEAT', 'Scale dropped below 0.42');
            phaseRef.current = 'DEFEAT';
            setDefeatReason('CRUSHED');
            setPhase('DEFEAT');
            AudioEffects.playDefeat();
          }

          // A. Collectible Pickups
          const colResult = engine.collectibles.checkCollisions(
            playerStateRef.current.x,
            playerStateRef.current.z,
            playerStateRef.current.scale,
            playerStateRef.current.color,
            playerStateRef.current.streakCount
          );

          if (colResult.collected) {
            engine.player.triggerSquashStretch();
            playerStateRef.current.targetScale = Math.max(0.4, Math.min(3.8, playerStateRef.current.targetScale + colResult.deltaScale));
            playerStateRef.current.power = Math.max(20, playerStateRef.current.power + colResult.deltaPower);
            playerStateRef.current.streakCount = colResult.matched ? playerStateRef.current.streakCount + 1 : 0;
          }

          // B. Color Gate Crossings
          const crossedColor = engine.track.checkGateCrossings(playerStateRef.current.z);
          if (crossedColor) {
            engine.triggerScreenShake(0.35);
            playerStateRef.current.color = crossedColor;
          }

          // C. Obstacle Hazard Hits
          const hitHazard = engine.track.checkObstacleCollisions(
            playerStateRef.current.x,
            playerStateRef.current.z,
            playerStateRef.current.scale
          );
          if (hitHazard) {
            engine.triggerScreenShake(0.6);
            playerStateRef.current.targetScale = Math.max(0.4, playerStateRef.current.targetScale - 0.25);
            playerStateRef.current.power = Math.max(20, playerStateRef.current.power - 45);
            playerStateRef.current.streakCount = 0;
          }

          // D. Finish Line Detection -> Transition to Arena Approach
          if (playerStateRef.current.z >= engine.track.finishLineZ) {
            logTransition('RUNNING', 'FINISH_APPROACH', `Passed finish line ${engine.track.finishLineZ}m`);
            phaseRef.current = 'FINISH_APPROACH';
            setPhase('FINISH_APPROACH');
            AudioEffects.playColorGate();
          }
        }

        // ==========================================
        // 2. FINISH APPROACH (Sprint into Arena)
        // ==========================================
        else if (currentPhase === 'FINISH_APPROACH') {
          // Guide player automatically to center runway
          playerStateRef.current.x += (0 - playerStateRef.current.x) * Math.min(1, delta * 6);
          // Decelerate smoothly as runner enters arena
          playerStateRef.current.z += playerStateRef.current.speedZ * 0.75 * delta;

          const arenaConfrontZ = engine.track.bossArenaZ - 4.2;
          if (playerStateRef.current.z >= arenaConfrontZ) {
            playerStateRef.current.z = arenaConfrontZ;
            playerStateRef.current.x = 0;

            logTransition('FINISH_APPROACH', 'BOSS_INTRO', 'Arrived at arena confront distance');
            phaseRef.current = 'BOSS_INTRO';
            phaseTimerRef.current = 1.4; // 1.4s dramatic camera swing
            setPhase('BOSS_INTRO');
          }
        }

        // ==========================================
        // 3. BOSS INTRO (Dramatic Confrontation)
        // ==========================================
        else if (currentPhase === 'BOSS_INTRO') {
          phaseTimerRef.current -= delta;
          if (phaseTimerRef.current <= 0) {
            logTransition('BOSS_INTRO', 'BOSS_QTE', 'Camera swing finished');
            phaseRef.current = 'BOSS_QTE';
            engine.boss.startQte();
            setQteTime(3.0);
            setQteTaps(0);
            setQtePowerRatio(1.0);
            setPhase('BOSS_QTE');
          }
        }

        // ==========================================
        // 4. BOSS QTE (Rapid-Tap Rush Frenzy)
        // ==========================================
        else if (currentPhase === 'BOSS_QTE') {
          setQteTime(engine.boss.qteTimeRemaining);
          setQtePowerRatio(engine.boss.powerRatio);

          if (engine.boss.qteTimeRemaining <= 0) {
            logTransition('BOSS_QTE', 'BOSS_PUNCH', '3.0s QTE expired');
            phaseRef.current = 'BOSS_PUNCH';
            phaseTimerRef.current = 0.9;
            punchExecutedRef.current = false;
            punchVictoryRef.current = false;
            engine.player.triggerPunch();
            setPhase('BOSS_PUNCH');
          }
        }

        // ==========================================
        // 5. BOSS PUNCH (Colossal Titan Strike)
        // ==========================================
        else if (currentPhase === 'BOSS_PUNCH') {
          phaseTimerRef.current -= delta;

          // Impact at peak of windup (0.45s)
          if (!punchExecutedRef.current && phaseTimerRef.current <= 0.45) {
            punchExecutedRef.current = true;
            engine.triggerScreenShake(0.85);

            const punchResult = engine.boss.executePunch(playerStateRef.current.power);
            punchVictoryRef.current = punchResult.isVictory;
          }

          // Complete punch follow-through and transition
          if (phaseTimerRef.current <= 0) {
            if (punchVictoryRef.current) {
              logTransition('BOSS_PUNCH', 'BOSS_LAUNCH', 'Punch connected! Boss launched');
              phaseRef.current = 'BOSS_LAUNCH';
              phaseTimerRef.current = 2.6; // 2.6s tracking launch
              setPhase('BOSS_LAUNCH');
            } else {
              logTransition('BOSS_PUNCH', 'DEFEAT', 'Boss defeated player');
              phaseRef.current = 'DEFEAT';
              setDefeatReason('BOSS_DEFEATED');
              setPhase('DEFEAT');
              AudioEffects.playDefeat();
            }
          }
        }

        // ==========================================
        // 6. BOSS LAUNCH (Multiplier Track Flight)
        // ==========================================
        else if (currentPhase === 'BOSS_LAUNCH') {
          phaseTimerRef.current -= delta;

          if (phaseTimerRef.current <= 0 || !engine.boss.isLaunching) {
            logTransition('BOSS_LAUNCH', 'VICTORY', 'Boss landed on multiplier');
            phaseRef.current = 'VICTORY';
            const earned = engine.boss.getEarnedMultiplier();
            const rewardCoins = Math.round(250 * earned.mult);
            addCoins(rewardCoins);
            addXP(400);
            setPhase('VICTORY');
          }
        }

        // 3D Scene Update
        engine.update(delta, phaseRef.current, playerStateRef.current);

        // Sync React HUD state at ~15FPS without clobbering position
        hudSyncCounter++;
        if (hudSyncCounter % 4 === 0) {
          setPlayerState({ ...playerStateRef.current });
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [addCoins, addXP, logTransition]);

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

      {/* DEV DEBUG MONITOR TOGGLE PILL */}
      <button
        onClick={() => setIsDebugOpen((prev) => !prev)}
        className="absolute top-3 left-3 z-50 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/90 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
        title="Toggle Dev Debug Monitor (Press ~ or F3)"
      >
        <Terminal className="w-3 h-3 text-cyan-400" />
        <span>{isDebugOpen ? 'HIDE DEBUG' : 'DEBUG'}</span>
      </button>

      {/* DEV DEBUG OVERLAY */}
      {isDebugOpen && (
        <GiantRushDebugOverlay
          fps={fps}
          phase={phase}
          player={playerState}
          finishLineZ={engineRef.current?.track.finishLineZ || currentLevel.trackLength}
          bossArenaZ={engineRef.current?.track.bossArenaZ || currentLevel.trackLength + 24}
          boss={engineRef.current?.boss.boss || null}
          qteTime={qteTime}
          qteTaps={qteTaps}
          powerRatio={qtePowerRatio}
          transitionLog={transitionLog}
        />
      )}

      {/* IN-GAME HUD */}
      {(phase === 'RUNNING' || phase === 'FINISH_APPROACH' || phase === 'BOSS_INTRO') && (
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

      {/* BOSS QTE OVERLAY (Reactive state bindings) */}
      {phase === 'BOSS_QTE' && engineRef.current?.boss.boss && (
        <BossQTEOverlay
          boss={engineRef.current.boss.boss}
          timeRemaining={qteTime}
          powerRatio={qtePowerRatio}
          tapCount={qteTaps}
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
              <span>↔️ A / D or Arrows</span>
              <span>👊 Space / Tap to Punch</span>
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
            setTimeout(() => {
              handleStartRun();
            }, 50);
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
