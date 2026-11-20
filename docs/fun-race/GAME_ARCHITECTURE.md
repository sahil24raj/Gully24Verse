# FUN RACE 3D – GAME ARCHITECTURE & SYSTEM DESIGN

## 1. High-Level Architecture Overview

The recreation is architected around a strict decoupled Entity-Component-System (ECS) and state-machine pattern built on Three.js:

```
+-------------------------------------------------------------------------+
|                              REACT SHELL                                |
|  - FunRaceGame.tsx (Container, Mount/Unmount lifecycle, Suspense)       |
|  - FunRaceHUD.tsx (Rank badge, Level counter, Track progress bar, Coins)|
|  - FunRaceVictoryModal.tsx (Celebration, Coin multiplier, Next Level)   |
|  - FunRaceDefeatModal.tsx (Retry option, Obstacle tip)                  |
+------------------------------------+------------------------------------+
                                     | Event Callbacks / State Bridge
+------------------------------------v------------------------------------+
|                         FUN RACE ENGINE CORE                            |
|                     (FunRaceEngine.ts - 60 FPS)                         |
|  - Fixed Timestep Loop (dt = 1/60s) with accumulator                    |
|  - Camera Controller (Smooth isometric 3rd person follow & orbit)       |
|  - Track Manager (Spline coordinate space, Segment builder)             |
|  - Obstacle System (Dynamic hazards, collision bounds, phase sync)      |
|  - Particle System (Water splashes, dust puffs, victory confetti)       |
|  - Audio Manager (Zero-latency Web Audio sound synthesizer)             |
+-------------------+--------------------------------+--------------------+
                    |                                |
+-------------------v----------------+ +-------------v--------------------+
|       PLAYER CHARACTER CONTROLLER  | |       AI OPPONENT RUNNERS        |
|  - Input Listener (Hold/Release)   | |  - Predictive Sensory System     |
|  - Spline Interpolator (s(t))      | |  - Timing Window Evaluator       |
|  - Procedural Animator (Run/Idle)  | |  - Personality Variance Model    |
|  - Knockback & Ragdoll Tumble      | |  - Auto-Respawn & Splashing      |
|  - Checkpoint & Respawn FSM        | |  - Track Position Tracker        |
+------------------------------------+ +----------------------------------+
```

---

## 2. Mathematical Formulations & Coordinate System

### 2.1 Track Spline Parametrization
The track trajectory is defined as a 3D piecewise parametric curve $\vec{C}(s)$ where $s \in [0, L]$ is the cumulative arc length from start ($s = 0$) to finish ($s = L$):
$$\vec{p}(s) = \vec{C}(s), \quad \hat{T}(s) = \frac{\vec{C}'(s)}{\|\vec{C}'(s)\|}, \quad \hat{N}(s) = \hat{T}(s) \times \hat{U}$$
Where $\hat{T}$ is the forward tangent vector, $\hat{U} = (0, 1, 0)$ is the global up vector, and $\hat{N}$ is the lateral normal (perpendicular to track direction).

### 2.2 Character Kinematics & States
A runner entity holds state $S \in \{\text{IDLE}, \text{RUNNING}, \text{KNOCKED_OUT}, \text{RESPAWNING}, \text{FINISHED}\}$:
* In `RUNNING`:
  $$s(t + \Delta t) = s(t) + v_{\text{run}} \cdot \Delta t$$
  $$\vec{p}(t) = \vec{C}(s(t)) + \text{lateralOffset} \cdot \hat{N}(s(t))$$
* In `KNOCKED_OUT` (Dynamic Ragdoll Flight):
  $$\vec{p}(t + \Delta t) = \vec{p}(t) + \vec{v}_{\text{ragdoll}}(t) \cdot \Delta t$$
  $$\vec{v}_{\text{ragdoll}}(t + \Delta t) = \vec{v}_{\text{ragdoll}}(t) + \vec{g} \cdot \Delta t \quad (\vec{g} = (0, -18.0, 0)\text{ m/s}^2)$$
  $$\vec{\theta}_{\text{rot}}(t + \Delta t) = \vec{\theta}_{\text{rot}}(t) + \vec{\omega}_{\text{tumble}} \cdot \Delta t$$

### 2.3 Obstacle Collision Dynamics
Each obstacle $i$ updates its spatial transform each tick:
* **Rotating Sweeper**:
  $$\theta_i(t) = \theta_{0, i} + \omega_i \cdot t$$
* **Pendulum Hammer**:
  $$\theta_i(t) = A_i \cdot \sin(2\pi f_i \cdot t + \phi_i)$$
  $$\vec{v}_{\text{tangential}} = L_i \cdot \frac{d\theta_i}{dt} \cdot \hat{T}_{\text{swing}}$$
* **Collision Check**:
  Raycast & Bounding Sphere/Capsule distance check:
  $$\text{dist}(\vec{p}_{\text{runner}}, \vec{p}_{\text{hazard\_arm}}) < r_{\text{runner}} + r_{\text{hazard}}$$
  If true, impact velocity $\vec{v}_{\text{impact}} = \vec{v}_{\text{hazard}} - \vec{v}_{\text{runner}}$ is applied with knockback multiplier $k = 1.35$.

---

## 3. Class Specifications

1. `FunRaceEngine`: Master game container; manages scene, camera, lights, materials, tick lifecycle, and state broadcast.
2. `TrackManager`: Builds and renders procedural track geometry with customizable rails, pillars, checkpoints, and water basin.
3. `ObstacleManager`: Instantiates, animates, and performs collision detection for all 5 hazard archetypes.
4. `PlayerRunner`: Human-controlled runner with responsive pointer/keyboard bindings and procedural animation.
5. `OpponentRunner`: Autonomous AI runner that scans upcoming obstacles and modulates velocity dynamically.
6. `ProceduralCharacterMesh`: Generates optimized stylized humanoid character with articulated head, torso, arms, and legs.
7. `WaterShader`: Animated procedural water plane with sine-wave normal distortion and specular highlights.
8. `ParticleManager`: High-performance pooled particle system for water splashes, dust clouds, and finish confetti.
9. `AudioManager`: Zero-asset procedural Web Audio synthesizer for all gameplay sound effects.
