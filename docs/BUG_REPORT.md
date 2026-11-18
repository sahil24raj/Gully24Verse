# BUG_REPORT.md — Giant Rush Re-engineering

## Active Tracking & QA Audit Log

| Bug ID | Severity | Description | System | Status | Resolution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BR-001** | High | Reference web target requires client-side WebGL canvas emulation | Reverse Eng | Closed | Decompiled web distribution and asset mechanics |
| **BR-002** | Medium | Character scale change can cause camera clipping through player head | Camera | Closed | Implemented dynamic FOV and adaptive camera pull-back formula |
| **BR-003** | High | Lateral rapid swipes can cause runners to pop through track edges | Physics | Closed | Implemented strict hard-clamped lateral boundary enforcement |
| **BR-004** | Low | Collectible pop audio overlapping during high-density clusters | Audio | Closed | Added pitch-shifted ascending queue and polyphonic limiter |
