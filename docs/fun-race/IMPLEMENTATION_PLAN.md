# FUN RACE 3D – IMPLEMENTATION PLAN

## Phase Roadmap & Milestones

| Phase | Description | Deliverables | Status |
|:---:|---|---|:---:|
| **1** | Reverse Engineering & Documentation | System analysis, mechanical audit, 6 doc files | **Completed** |
| **2** | Core 3D Scene & Camera | Three.js scene, stylized lighting, water plane, smooth chase camera | **In Progress** |
| **3** | Parametric Track Generator | Spline-based track with pillars, straightaways, 90° curves, finish line | **Pending** |
| **4** | Stylized Procedural Character | Minimalist mannequin mesh with running/idle/fall procedural rigging | **Pending** |
| **5** | Player Controller & Input | Hold-to-run, instant brake, touch/mouse/spacebar bindings | **Pending** |
| **6** | Dynamic Obstacle Engine | 5 hazard archetypes (Sweepers, Hammers, Rollers, Pushers, Gates) | **Pending** |
| **7** | Collision & Water Splash Physics | Capsule-OBB intersection, knockback impulse, water plunge, checkpoint respawn | **Pending** |
| **8** | Opponent AI System | 2 autonomous AI bots with sensory anticipation and error variance | **Pending** |
| **9** | Multi-Level Track Progression | 3 distinct levels with increasing hazard complexity and layout variety | **Pending** |
| **10** | Audio System (Web Audio / Howler) | Rhythmic footsteps, whooshes, bonks, water splashes, victory fanfare | **Pending** |
| **11** | React HUD & Modal Overlays | Rank pill, track progress bar, level header, victory/defeat modal | **Pending** |
| **12** | Catalog Registration & QA Push | GullyVerse routing (`/game/fun-race`), zero error validation, git push | **Pending** |

---

## Technical Stack & Constraints
* **Rendering**: Three.js (r128+ compatible) with imperative animation loop to ensure maximum 60 FPS performance on both mobile and desktop.
* **Audio**: Native Web Audio API procedural synthesizer + soundFx integration (zero external mp3 download dependency).
* **State Management**: React state bridge with high-frequency decoupling (HUD reads engine telemetry via `requestAnimationFrame` polling/callbacks).
* **Code Standard**: TypeScript strict mode, clean modular file organization, no memory leaks or unbounded listeners.
