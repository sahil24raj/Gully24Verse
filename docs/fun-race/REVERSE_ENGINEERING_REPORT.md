# FUN RACE 3D – DEEP REVERSE ENGINEERING REPORT

## 1. Executive Summary & Provenance
* **Target Game**: Fun Race 3D
* **Reference URL**: `https://www.msn.com/en-in/play/games/fun-race-3d/cg-9ngskk1zcf60`
* **Original Publisher/Developer**: Good Job Games (Hyper-casual 3D parkour racing phenomenon)
* **Target Engine for Re-creation**: React 19 + TypeScript + Three.js + Web Audio / Howler.js Architecture
* **Target Platform**: Desktop (Mouse/Keyboard) & Mobile (Single-touch responsive canvas) on GullyVerse

---

## 2. Core Gameplay Loop & Mechanics Decomposition

### 2.1 The Single-Touch Movement Paradigm
* **Input Schema**:
  * **PointerDown / TouchStart / Space Down**: Triggers running state (`RUNNING`). Player character accelerates along the track spline toward the finish line at a constant speed ($v = 7.5\text{ m/s}$).
  * **PointerUp / TouchEnd / Space Up**: Triggers instant deceleration / braking into idle stance (`IDLE`). The character stops firmly within $0.05\text{s}$, allowing precise stop-and-go navigation between high-speed obstacles.
* **Track Trajectory**:
  * The runner is bound to a predefined 3D path (spline / waypoints).
  * Rather than manual left/right steering, the player controls *velocity through time*, converting obstacle evasion into a rhythmic timing puzzle.

### 2.2 Dynamic Obstacle Systems
The reference game relies on modular, cyclic kinetic hazards:
1. **Rotating Windmills / Crossbar Sweepers**:
   * Rotate around a central horizontal or vertical axis at angular speed $\omega$ ($1.5 - 3.5\text{ rad/s}$).
   * Sweeps across the track plane; timing requires dashing right behind a passing spoke.
2. **Sinusoidal Pendulum Hammers**:
   * Heavy mallets swinging across the path: $\theta(t) = \theta_{\max} \cdot \sin(2\pi f t + \phi)$.
   * High knockback velocity when struck at peak swing speed.
3. **Spinning Rollers / Conveyor Drums**:
   * Cylindrical surface platforms rotating around their track axis.
   * If running against rotation, progress slows; if struck by protruding fins, the runner is ejected sideways.
4. **Pneumatic Wall Pushers / Crushers**:
   * Square or rectangular pistons extending horizontally across the lane with trapezoidal motion curves (fast extend, pause, slow retract).
5. **Rotating Turnstiles / Spindle Gates**:
   * Multi-wing turnstile gates positioned directly in the corridor requiring runners to match rotation direction.

### 2.3 Physics, Collision Detection & Knockback
* **Hitbox Archetypes**:
  * Player & Opponents: Oriented Bounding Capsule ($r = 0.4\text{m}, h = 1.6\text{m}$).
  * Obstacle Arms & Spikes: Oriented Bounding Boxes (OBB) or Sphere trees updated each frame.
* **Collision Response**:
  * When collision occurs:
    1. Calculate contact normal $\vec{n}$ and obstacle linear velocity $\vec{v}_{\text{obs}}$.
    2. Apply knockback impulse: $\vec{v}_{\text{knock}} = 8.0 \cdot \vec{n} + 6.0 \cdot \hat{y}$.
    3. Transition character state from `RUNNING` to `KNOCKED_OUT`.
    4. Ragdoll / tumble physics simulation: character rotates along pitch/roll axes while being launched into the water below ($y < -2.0$).
    5. Trigger water splash particle emitter and audio splash sound.
    6. After $1.2\text{s}$ delay, dissolve/fade and respawn at the previous checkpoint with invulnerability flash ($0.8\text{s}$).

### 2.4 Opponent AI Behavior Model
* **Racers**: 1 to 2 autonomous AI bots racing on the same course.
* **Perception & Decision Cycle**:
  * Look-ahead ray/spline distance ($d_{\text{look}} = 4.0\text{m}$).
  * Hazard phase prediction: If an upcoming obstacle will intersect the character's bounding volume within $t_{\text{transit}} = d / v_{\text{bot}}$, the bot executes a brake (`IDLE`).
  * Bot Personality Profiles:
    * *Bot 1 (Balanced/Rival)*: $92\%$ timing accuracy, reacts quickly, maintains competitive distance.
    * *Bot 2 (Aggressive/Risky)*: $78\%$ timing accuracy, gambles on close clearances, occasionally gets wiped out by hammers.
* **Dynamic Position Sorting**:
  * Track distance completed $s(t)$ is continuously compared: $s_{\text{player}}$ vs $s_{\text{bot1}}$ vs $s_{\text{bot2}}$.
  * Ranks (1st, 2nd, 3rd) update dynamically on HUD in real-time.

---

## 3. Visual & Aesthetic Architecture
* **Environment**:
  * Stylized minimalist ocean/lagoon setting with sun-bleached coastal atmosphere.
  * Turquoise animated water surface with specular ripples, shoreline foam, and subtle floating buoys.
  * Track materials: Vibrant pastel/matte polymer tubes and platforms (Cyan, Coral Orange, Mint Green, Sunny Yellow) with dark rubberized lane borders.
* **Character Aesthetic**:
  * Stylized humanoid runner (clean minimalist faceless mannequin aesthetic).
  * Procedural running animation (sine-based leg swings, arm pumping, leaning into turns).
  * Smooth transition between sprint lean, abrupt braking stance, and tumbling ragdoll flight.
* **Camera System**:
  * Isometric / Elevated Third-Person Chase Camera.
  * Follow distance: $\Delta z = -7.0\text{m}, \Delta y = 5.5\text{m}, \Delta x = 0\text{m}$.
  * LookAt target positioned slightly ahead of player ($\vec{p}_{\text{target}} = \vec{p}_{\text{player}} + 3.0 \cdot \vec{d}_{\text{forward}}$).
  * Smooth dampening / lerp ($s = 0.12$) to avoid jarring motions during sudden stops.
  * Camera zooms out and orbits slightly upon victory.

---

## 4. Audio Landscape & Sound Design
* **Interactive SFX**:
  * Continuous rhythmic footstep audio while running ($3.5\text{ Hz}$).
  * Brake skid audio cue upon release.
  * Whoosh audio when passing within $2\text{m}$ of swinging hazards.
  * Heavy impact "BONK/THUD" on collision.
  * Water plunge "SPLASH" with sub-bass drop when hitting water.
  * Checkpoint activation chime.
  * Finish line airhorn / victory fanfare + crowd cheer.
* **Dynamic Audio Engine**:
  * Synthesized via Web Audio API oscillators + noise buffers with `Howler.js` fallback, ensuring instant zero-latency loading with zero external network asset dependencies.

---

## 5. Reverse Engineering Findings Summary
| System | Reference Observation | Recreation Strategy |
|---|---|---|
| Input | Hold to run, release to stop | Multi-event listener (`pointerdown`, `pointerup`, `keydown`, `keyup`) |
| Movement | Spline waypoint interpolation | Parametric Catmull-Rom / segmented arc-length track spline |
| Physics | Kinematic running + dynamic knockback ragdoll | Fixed-timestep ($60\text{Hz}$) Euler integration with tumbling impulse |
| Obstacles | 5 distinct hazard types | Modular `Obstacle` base class with polymorphic `update()` & collision bounds |
| Opponents | 2 AI runners with imperfect timing | Predictive phase-window sensory AI with error-variance models |
| Visuals | Clean stylized 3D over water | PBR stylized Three.js shaders, animated vertex water, particle splash |
| UI/HUD | Progress bar, rank indicator, victory modal | Glassmorphic React overlay synchronized with Three.js state bus |
