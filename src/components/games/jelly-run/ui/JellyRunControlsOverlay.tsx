import React, { useRef, useEffect } from 'react';

interface JellyRunControlsOverlayProps {
  onSteer: (normX: number) => void;
  onToggleSplit: () => void;
  isGameRunning: boolean;
  onStartGame: () => void;
}

export const JellyRunControlsOverlay: React.FC<JellyRunControlsOverlayProps> = ({
  onSteer,
  onToggleSplit,
  isGameRunning,
  onStartGame
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentNormXRef = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'KeyS' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
        if (!isGameRunning) {
          onStartGame();
        } else {
          onToggleSplit();
        }
      } else if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        currentNormXRef.current = Math.max(-1, currentNormXRef.current - 0.25);
        onSteer(currentNormXRef.current);
      } else if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        currentNormXRef.current = Math.min(1, currentNormXRef.current + 0.25);
        onSteer(currentNormXRef.current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameRunning, onStartGame, onToggleSplit, onSteer]);

  // Pointer drag events for smooth intuitive mouse & touch steering
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isGameRunning) {
      onStartGame();
      return;
    }
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width; // 0 to 1
    const normX = (relativeX - 0.5) * 2; // -1 to 1
    currentNormXRef.current = Math.max(-1, Math.min(1, normX));
    onSteer(currentNormXRef.current);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      const dist = Math.abs(e.clientX - startXRef.current);
      // If tiny movement, treat as a TAP to toggle split!
      if (dist < 10) {
        onToggleSplit();
      }
    }
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="absolute inset-0 z-10 touch-none select-none flex flex-col justify-end items-center pb-12 cursor-grab active:cursor-grabbing"
    >
      {/* Starting Overlay prompt */}
      {!isGameRunning && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center pointer-events-auto">
          <div className="flex flex-col items-center gap-4 max-w-sm p-6 rounded-3xl bg-[#0F172A]/90 border border-cyan-500/30 shadow-2xl">
            <span className="text-5xl animate-bounce">🍮</span>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                JELLY <span className="text-amber-400">JALWA</span>
              </h2>
              <p className="text-xs text-slate-300">
                Drag to steer • Split around center pillars • Merge to reach 2048!
              </p>
            </div>
            <button
              onClick={onStartGame}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_24px_rgba(34,211,238,0.5)] transition-all cursor-pointer active:scale-95"
            >
              TAP TO RUN 🏃💨
            </button>
          </div>
        </div>
      )}

      {/* Control hints pill */}
      {isGameRunning && (
        <div className="px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[11px] font-bold text-slate-300 shadow-lg pointer-events-none">
          <span>Drag / A-D to Steer • Tap or Space to Split/Merge</span>
        </div>
      )}
    </div>
  );
};
