# FUN RACE 3D – BUG REPORT & DEFECT LOG

## Defect Tracking Register

| Bug ID | Severity | System | Description | Status | Resolution |
|:---:|:---:|:---:|---|:---:|---|
| **FR-01** | High | Input | Pointer release event lost when dragging cursor outside canvas | Resolved | Added global `window.addEventListener('pointerup')` listener |
| **FR-02** | Medium | Physics | Knockback impulse causing character to penetrate track geometry | Resolved | Restricted ground collision during `KNOCKED_OUT` state until water entry |
| **FR-03** | Low | Camera | Camera jitter during rapid tap-to-run micro inputs | Resolved | Implemented exponential smoothing with velocity-dependent lookahead |
| **FR-04** | Medium | AI | Bots occasionally getting stuck in infinite waiting loop in front of fast rotator | Resolved | Added safety timeout: bot forces aggressive slip-through after 3 full cycles |
| **FR-05** | Low | Audio | Web Audio context suspended on first click in modern Chromium | Resolved | Added `audioCtx.resume()` on first user pointerdown interaction |
