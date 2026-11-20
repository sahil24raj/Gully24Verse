# JELLY RUN 2048 – DEEP REVERSE ENGINEERING & TECHNICAL SPECIFICATION

## 1. Executive Summary & Gameplay Core
**Reference Game:** [MSN Jelly Run 2048](https://www.msn.com/en-in/play/games/jelly-run-2048/cg-9nbckjw55fsv)  
**Genre:** 3D Hypercasual Runner + 2048 Number Merging Puzzle  
**Primary Loop:**
1. Player jelly cube runs automatically forward on an elevated aquatic track.
2. Steer laterally (drag/touch/mouse/keyboard) to line up with matching number cubes and dodge hazards.
3. **Split & Merge Mechanic (Signature Innovation):**
   - Tap/click or press `Space` to **Split** a single cube into two twin cubes that diverge laterally.
   - Tap again to **Merge** the twins back together.
   - Essential for bypassing center pillars/dividers and navigating bifurcated obstacle layouts.
4. **2048 Progression:**
   - Hitting matching numbered cubes ($2+2 \to 4$, $4+4 \to 8 \dots 1024+1024 \to 2048$) merges them, doubling the value and altering the jelly's color and mass.
   - Merging twin cubes together doubles their value.
5. **Finish Runway & Multipliers:**
   - Crossing the finish line launches the jelly down a high-multiplier runway ($1.5\times$ to $50\times$), scoring based on momentum and highest number achieved.

---

## 2. Mathematical & Mechanics Model

### Number Tiers & Color Palette
| Number | Base Color | Hex Code | Specular/Glow | Mass/Scale Multiplier |
|---|---|---|---|---|
| **2** | Sky Cyan | `#22D3EE` | Bright Cyan | 1.00x |
| **4** | Mint Green | `#4ADE80` | Neon Green | 1.05x |
| **8** | Warm Amber | `#FB923C` | Golden Orange | 1.10x |
| **16** | Vibrant Tangerine | `#F97316` | Deep Orange | 1.15x |
| **32** | Coral Red | `#EF4444` | Fiery Crimson | 1.20x |
| **64** | Neon Magenta | `#F43F5E` | Hot Pink | 1.25x |
| **128** | Sunflower Gold | `#FACC15` | Electric Yellow | 1.30x |
| **256** | Acid Lime | `#A3E635` | Lime Radiance | 1.35x |
| **512** | Emerald | `#10B981` | Deep Mint | 1.40x |
| **1024** | Royal Purple | `#8B5CF6` | Ultra Violet | 1.45x |
| **2048** | Cyber Gold / Rainbow | `#FFD700` | Prismatic Iridescence | 1.50x |
| **4096+** | Cosmic Indigo | `#6366F1` | Supernova Sparkle | 1.55x |

---

## 3. Technical Architecture (Three.js + React)

```
src/components/games/jelly-run/
├── JellyRunGame.tsx            # Main React wrapper, HUD & lifecycle manager
├── engine/
│   ├── types.ts                # TypeScript interfaces and game state models
│   ├── constants.ts            # 2048 color map, track dimensions, physics params
│   ├── AudioManager.ts         # Procedural Web Audio API sound generator
│   ├── TextureGenerator.ts     # Canvas 2D dynamic texture generator for cube faces
│   ├── JellyModelBuilder.ts    # Procedural squishy rounded box with gloss shaders
│   ├── PlayerJellyController.ts# Lateral lerp, split/merge spring state, squash & stretch
│   ├── TrackManager.ts         # Elevated neon highway, rails, pylons, multiplier runway
│   ├── ObstacleManager.ts      # Center dividers, rotating sawblades, spike barriers
│   ├── CollectibleManager.ts   # Number cubes with floating animations and hitboxes
│   ├── ParticleManager.ts      # Merge confetti, burst particles, speed ribbons
│   └── JellyRunEngine.ts       # Central game loop, collision matrix, camera follower
└── ui/
    ├── JellyRunHUD.tsx         # Score, highest number badge, progress bar, split indicator
    ├── JellyRunControlsOverlay.tsx # Interactive on-screen steer & split/merge toggles
    ├── JellyRunVictoryModal.tsx# Level complete celebration, multiplier showcase, stats
    └── JellyRunDefeatModal.tsx # Splat game over screen with instant retry
```
