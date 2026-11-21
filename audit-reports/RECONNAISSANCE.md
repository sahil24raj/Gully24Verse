# Phase 1: Reconnaissance Ledger & Attack Surface Map

### Target System Overview
- **Application Name:** GullyVerse (formerly MemeVerse / Chill Arena)
- **Framework:** Next.js 16.3 (App Router), React 19, TypeScript
- **Styling & UI:** Tailwind CSS, Framer Motion, Lucide Icons, Russo One typography
- **Cloud Backend:** Google Cloud Firebase (Authentication & Cloud Firestore)
- **Audio Architecture:** Howler.js & Web Audio API
- **Game Engines:** HTML5 Canvas, Matter.js Physics, Three.js 3D WebGL, Unity WebGL WASM

### Subsystem Boundaries
1. **Frontend Client Layer:** Next.js App Router, React Components, Zustand Local Store (`src/store/useAppStore.ts`).
2. **Server API Layer:** Route Handlers (`src/app/api/*`), Session HMAC Verification, Room Coordination.
3. **Database Tier:** Google Cloud Firestore collections:
   - `users/{userId}`: Player profiles, usernames, XP, coins, streak, preferences.
   - `leaderboards/{scoreId}`: Public leaderboard records by game and user.
   - `rooms/{roomCode}`: Active multiplayer room state.
   - `gameSessions/{sessionId}`: Match telemetry and anti-cheat timestamps.
   - `support_tickets/{ticketId}`: Support and contact form submissions.
4. **Third-Party Integrations:** Google Firebase Auth, Vercel Edge Hosting.
