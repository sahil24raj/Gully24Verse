# GAME_ARCHITECTURE.md — Giant Rush 3D Re-engineering

## 1. Architectural Philosophy
- **Modular Component Isolation**: Separate pure 3D rendering and physics math (`engine/`) from UI state and React component rendering (`ui/` & `GiantRushGame.tsx`).
- **Zero-Allocation 60FPS Game Loop**: Reuse vectors, quaternions, and matrices in animation and collision loops to prevent V8 garbage collection stutter.
- **Anti-Slop Design Language**: Rich, tactile feedback, consistent visual hierarchy, dark arcade glass styling, and responsive mobile/desktop touch controls.

## 2. Directory Structure
```
memeverse/src/components/games/giant-rush/
├── GiantRushGame.tsx            # Main game controller, screen state, loop runner
├── engine/
│   ├── types.ts                 # Full TypeScript interfaces & game state types
│   ├── constants.ts             # Level configurations, color palettes, physics constants
│   ├── GiantRushEngine.ts       # Three.js scene, camera, lights, particle systems
│   ├── PlayerCharacter.ts       # Dynamic 3D runner mesh with real-time vertex/bone scaling
│   ├── RunwayTrackManager.ts    # Procedural runway, color gates, moving obstacles, finish line
│   ├── CollectiblesManager.ts   # Instanced micro-runners, collection detection, particle bursts
│   ├── BossCombatManager.ts     # Giant Boss Titan, QTE tap frenzy, ragdoll launch physics
│   └── AudioEffects.ts          # Synthesized Web Audio / Howler procedural soundscapes
└── ui/
    ├── GiantRushHUD.tsx         # Power gauge, scale meter, level progress bar
    ├── BossQTEOverlay.tsx       # Rapid-tap power meter & punch button
    ├── VictoryModal.tsx         # Score multiplier payout & upgrades
    └── DefeatModal.tsx          # Level retry screen
```

## 3. Mathematical Foundations
- **Dynamic Scale Formula**:
  $$S(t) = S_{\text{base}} + (N_{\text{matched}} \times 0.055) - (N_{\text{mismatched}} \times 0.09)$$
- **Lateral Track Containment (Strict Clamping)**:
  $$X_{\text{clamped}} = \max(-\text{halfWidth} + r, \min(\text{halfWidth} - r, X_{\text{player}}))$$
- **Ragdoll Launch Trajectory**:
  $$V_x = 0, \quad V_y = V_0 \sin(38^\circ), \quad V_z = V_0 \cos(38^\circ)$$
  $$\text{Distance} = \frac{V_0^2 \sin(2 \times 38^\circ)}{g}$$
