# ROOT CAUSE REPORT: GIANT RUSH RUNTIME FAILURES

## Executive Summary

A deep investigation into the failure of the previous Giant Rush deployment on `https://gully24verse.vercel.app/game/giant-rush` revealed two fundamental root causes:
1. **Production Deployment Build Failure**: Commit `560e39b` failed to compile on Vercel with `Turbopack build failed with 1 error: ./src/components/games/giant-rush/engine/RunwayTrackManager.ts:228:20 Error: Expected a semicolon`. Because the build failed, Vercel never deployed the overhauled code and continued serving the initial broken build (`b56cdaf`).
2. **Three.js Screen-to-World Coordinate Inversion**: In Three.js, when the PerspectiveCamera is located at $Z < \text{target}$ looking forward down world $+Z$ with Up vector $(0, 1, 0)$, the camera's local $+X$ axis (Screen Right) projects to world $-X$, and Screen Left projects to world $+X$. Consequently, increasing world $X$ moved the character visually to the LEFT on screen, causing completely inverted controls!

---

## Detailed Root Cause Analysis

### 1. The Vercel Deployment Failure
- **Symptom**: User observed that none of the fixes took effect on production.
- **Investigation**: We queried GitHub commit statuses for commit `560e39b23a30d8f8ddab4189b60382de9abb51a1` via the GitHub API. The status returned `state: 'failure'` with description: `Deployment has failed — run this Vercel CLI command: npx vercel inspect dpl_7ttnWmkF2ZpLrNY9g3BE2D8zLqAo --logs`.
- **Reproduced Error**: By running a clean build outside of OneDrive in a temporary directory, we reproduced the exact Turbopack failure:
  ```
  Error: Turbopack build failed with 1 error:
  ./src/components/games/giant-rush/engine/RunwayTrackManager.ts:228:20
  Error: Expected a semicolon
  ```
- **Source Cause**: During the previous edit of `RunwayTrackManager.ts`, an orphaned remnant of a duplicate obstacle generator was left at lines 228–276.
- **Resolution**: Removed the orphaned block. Verified full build success locally (`✓ Compiled /game/[id] in 0 errors`).

---

### 2. Bug 1: A / D Keyboard Control Inversion & Snapping
- **Symptom**: Pressing `A` or `D` felt unresponsive, jerky, and steered in the opposite/incorrect direction.
- **Root Cause**:
  1. **Coordinate Inversion**:
     - Three.js Camera looks down world $+Z$.
     - Camera view matrix calculation:
       $$Z_{\text{camera}} = -F = (0, 0, -1)$$
       $$X_{\text{camera}} = U \times Z_{\text{camera}} = (0, 1, 0) \times (0, 0, -1) = (-1, 0, 0)$$
     - Therefore, world $+X$ projects to the **LEFT** of the screen, and world $-X$ projects to the **RIGHT** of the screen!
     - When `D` was pressed, code increased world $X$ (`+1`), causing the player to move visually **LEFT**!
     - When `A` was pressed, code decreased world $X$ (`-1`), causing the player to move visually **RIGHT**!
  2. **Stale React Closure**: In earlier iterations, `setPlayerState` called during collision updates reset `x` to the initial React state ($0$).
- **Resolution**:
  - Unified all lateral coordinates to human screen-space: `+` is Screen Right, `-` is Screen Left.
  - In Three.js rendering, player and meshes are positioned at `(-playerState.x, 0, playerState.z)`.
  - Camera follows at `targetX = -playerState.x * 0.45` and looks at `-playerState.x * 0.3`.
  - Pressing `A` / `ArrowLeft` decreases $X$ (moves smoothly LEFT).
  - Pressing `D` / `ArrowRight` increases $X$ (moves smoothly RIGHT).
  - Touch/mouse drag right increases $X$ (moves smoothly RIGHT).

---

### 3. Bug 2: Colour Lanes Too Short
- **Symptom**: Runway ended in 7 seconds; no distinct lanes or time to react.
- **Root Cause**:
  - Level 1 was configured at 130m with speed 17m/s ($130 / 17 = 7.6\text{s}$).
  - Gates were placed every 45m (2.5s per gate).
  - Collectibles were spawned randomly row-by-row without single-color lane clusters.
- **Resolution**:
  - Tripled track lengths: Level 1 is **360m**, Level 2 is **460m**, Level 3 is **560m** at 16m/s ($22.5\text{s}$–$35\text{s}$ run).
  - Spaced color gates every **90m** with dedicated 8m entry and 10m exit buffer zones.
  - Implemented procedural lane clustering: 5–7 rows ($18\text{m}$–$25\text{m}$) of continuous matching micro-runners per stream, with contrasting lanes to dodge.

---

### 4. Bug 3 & 4: Finish Line & Boss Battle Softlock
- **Symptom**: Player reached finish line and froze 24m before the boss; boss battle never started; screen softlocked at 100%.
- **Root Cause**:
  1. `useEffect` in `GiantRushGame.tsx` had `[phase]` in its dependency array. When phase changed to `BOSS_INTRO`, cleanup ran and set `isMounted = false`.
  2. The pending `setTimeout` for QTE aborted because `if (isMounted)` was false.
  3. Player forward movement stopped at the finish line arch ($z = 360\text{m}$), leaving the runner stranded 24m before the boss ($z = 384\text{m}$).
  4. QTE variables (`qteTimeRemaining`, `qteTaps`, `powerRatio`) were internal class properties that did not trigger React re-renders.
- **Resolution**:
  - Created `FINISH_APPROACH` state where runner sprints through the finish line arch into the arena, automatically centering to $x = 0$ and smoothly decelerating right up to confrontation distance ($z = \text{arenaZ} - 4.2\text{m}$).
  - All state transitions managed deterministically within the 60FPS loop with delta timers (`phaseTimerRef`), eliminating reliance on fragile React timeouts.
  - Connected reactive state hooks (`qteTime`, `qteTaps`, `qtePowerRatio`) to the engine update loop and tap handler.
  - Enabled Spacebar / Enter as secondary punch inputs for desktop players.
