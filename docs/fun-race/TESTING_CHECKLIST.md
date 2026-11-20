# FUN RACE 3D – TESTING & QA CHECKLIST

## 1. Input & Controls Verification
- [ ] **Hold to Run**: Pressing and holding Left Mouse Button / Touch / Spacebar causes player to run smoothly along track.
- [ ] **Release to Stop**: Releasing input brings player to immediate halt within 0.05s.
- [ ] **Global Pointer Capture**: Moving pointer outside canvas while holding and then releasing properly triggers stop.
- [ ] **Mobile Touch**: Touchstart and touchend register reliably without pinch-zoom or scrolling interference.

## 2. Obstacle System & Collision Verification
- [ ] **Rotating Sweepers**: Rotate smoothly, arm hitboxes match visual geometry.
- [ ] **Swinging Hammers**: Pendulum swings with natural sinusoidal acceleration; contact knocks player sideways.
- [ ] **Pushers**: Piston blocks extend and retract with solid collision faces.
- [ ] **Spinning Rollers**: Rotating drums rotate with clear directional cues.
- [ ] **Hitbox Accuracy**: Collision occurs precisely when character mesh overlaps obstacle collider.

## 3. Physics & Ragdoll Plunge
- [ ] **Knockback Trajectory**: Runner launches upward and outward away from obstacle impact normal.
- [ ] **Tumbling Animation**: Character rotates dynamically along pitch and roll axes while falling.
- [ ] **Water Splash**: Splash particle ring bursts upon reaching water level ($y < -2.0$).
- [ ] **Respawn Flow**: Runner fades out, reappears at checkpoint after 1.2s with brief invincibility blink.

## 4. Opponent AI Verification
- [ ] **AI Movement**: 2 AI runners run along parallel lanes without overlapping or phasing through each other.
- [ ] **Obstacle Avoidance**: AI evaluates swing phase and pauses before dangerous zones.
- [ ] **Mistake Probability**: AI bots occasionally mistime their runs and take hits, enhancing competitive realism.
- [ ] **Dynamic Rank**: 1st, 2nd, 3rd position badges update accurately based on arc-length distance.

## 5. UI, Audio & Polish
- [ ] **Track Progress Bar**: Reflects true percentage completion for player and both AI bots.
- [ ] **Victory Modal**: Displays placement, coins earned, confetti burst, and "Next Level" button.
- [ ] **Defeat Modal**: Triggers if bot finishes first with option to "Try Again".
- [ ] **Audio Feedback**: Footsteps, whooshes, impacts, water splashes, and chimes fire crisply with no audio clipping.
- [ ] **60 FPS Performance**: Steady 60 FPS verified on desktop and mobile viewports with minimal draw calls.
