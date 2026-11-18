# Giant Rush! — Bug Audit & Resolution Report

## Resolved Critical Bugs

### BUG 1: Broken Keyboard Controls
- **Symptom**: Pressing or holding `A` or `D` did not reliably steer the player; steering was jerky, and player would snap back to $x=0$.
- **Root Cause**:
  1. Default key handling didn't call `e.preventDefault()`, allowing browser arrow/space scrolling to steal focus.
  2. Stale React closure: React state `setPlayerState` called during collision updates used `prev.x` from initial React state (which was 0), overriding the continuous `playerStateRef.current.x`.
  3. No window blur handler to clear key states when focus shifted.
- **Resolution**:
  - Implemented velocity-based lateral smoothing with acceleration lerp ($V_{\max} = 15.0\text{m/s}$).
  - Kept single source of truth in `playerStateRef.current`.
  - Added global window `blur` listener.
  - Added support for `KeyA`, `KeyD`, `ArrowLeft`, `ArrowRight`, and Spacebar for punch.
- **Status**: **RESOLVED & VERIFIED**

---

### BUG 2: Colour Lanes Too Short
- **Symptom**: Runway finished in ~7 seconds; players couldn't react, identify colors, or build streaks.
- **Root Cause**:
  - Track length was only 130m with speed 17m/s.
  - Collectibles were spawned randomly row-by-row without lane structure.
- **Resolution**:
  - Extended track lengths to 360m (Level 1), 460m (Level 2), 560m (Level 3).
  - Spaced color gates every 90m for distinct ~6-second color zones.
  - Built procedural lane cluster algorithm: 5–7 rows of continuous matching micro-runners per stream, with contrasting lanes to dodge.
- **Status**: **RESOLVED & VERIFIED**

---

### BUG 3: Finish Line & Boss Battle Softlock
- **Symptom**: Reaching finish line stopped gameplay; player stood still 25m away; boss battle didn't start.
- **Root Cause**:
  - React `useEffect` had `[phase]` in dependency array. When phase changed to `BOSS_INTRO`, cleanup ran and set `isMounted = false`.
  - Pending `setTimeout` for QTE aborted because `if (isMounted)` was false.
  - Player forward motion stopped at finish arch ($z=100$) instead of running into the arena ($z=120$).
- **Resolution**:
  - Added `FINISH_APPROACH` phase: player sprints through finish line into the arena to confrontation distance ($z = \text{arenaZ} - 4.2\text{m}$).
  - State transitions managed deterministically within the 60FPS loop with delta timers, completely immune to React unmounts/re-renders.
- **Status**: **RESOLVED & VERIFIED**

---

### BUG 4: Boss QTE Freeze & Missing UI Feedback
- **Symptom**: In boss fight, countdown timer was frozen at 3.0s and tap count remained 0.
- **Root Cause**:
  - Boss QTE variables (`qteTimeRemaining`, `qteTaps`, `powerRatio`) were internal class properties that did not notify React to re-render.
- **Resolution**:
  - Connected reactive state hooks (`qteTime`, `qteTaps`, `qtePowerRatio`) to the engine update loop and tap handler.
  - Enabled Spacebar / Enter as secondary punch inputs for desktop players.
- **Status**: **RESOLVED & VERIFIED**
