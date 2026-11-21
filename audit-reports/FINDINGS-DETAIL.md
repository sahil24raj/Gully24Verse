# GullyVerse — Detailed Security Findings

### GV-001: Permissive Firestore Security Rules Allowing Complete Database Compromise
- **Severity:** Critical (CVSS 9.8)
- **Attack Class:** Access Control / Database Rules
- **Affected File:** `firestore.rules`
- **Root Cause:** All collections (`users`, `leaderboards`, `rooms`, `gameSessions`) were marked with `allow read, write: if true;`.
- **Security Impact:** Complete remote database compromise. Any attacker could overwrite user accounts, inject arbitrary XP/coins, delete profiles, or vandalize global leaderboards.
- **Remediation:** Rewrote `firestore.rules` to enforce document ownership (`request.auth.uid == userId`), protect administrative fields (`role`, `isAdmin`, `permissions`), restrict leaderboard updates to authenticated users with score ceilings (<= 100,000), prevent deletion, and establish default-deny rules.

### GV-002: Broken Object-Level Authorization (BOLA / IDOR) in Profile Update API
- **Severity:** High (CVSS 8.5)
- **Attack Class:** Broken Object-Level Authorization
- **Affected File:** `src/app/api/user/profile/route.ts`
- **Root Cause:** The endpoint trusted an unauthenticated `body.uid` parameter and applied profile changes to that user document.
- **Security Impact:** Any user or attacker could modify any other user's username, avatar, bio, or visual identity by sending their victim's `uid`.
- **Remediation:** Added caller identity enforcement (`x-user-id` header validation), strict field whitelisting, and disallowed any modifications to privileged fields.

### GV-003: Hardcoded Cryptographic Secret Fallback for Game Sessions & Round Tokens
- **Severity:** High (CVSS 7.5)
- **Attack Class:** Cryptographic Failure
- **Affected Files:** `src/app/api/session/start/route.ts`, `src/app/api/session/finish/route.ts`, `src/lib/games/escapeDoorCrypto.ts`
- **Root Cause:** Fallback secret defaulted to static string `'chill_arena_game_session_secret_key_2026'`.
- **Security Impact:** Attackers could decrypt Escape Door round tokens to see safe doors in advance (100% win rate) and forge session completion HMAC tokens for arbitrary high scores.
- **Remediation:** Created `src/lib/security/sessionSecret.ts` with `getGameSessionSecret()`, enforcing strong environment variables and generating runtime 256-bit cryptographically random keys if unconfigured.

### GV-004: Variable-Time Cryptographic Token Comparison Vulnerable to Timing Attack
- **Severity:** Medium (CVSS 5.3)
- **Attack Class:** Cryptographic Failure / Side-Channel
- **Affected File:** `src/app/api/session/finish/route.ts`
- **Root Cause:** `sessionToken !== expectedToken` used standard JavaScript string comparison.
- **Security Impact:** Side-channel timing discrepancies could allow attackers to infer valid HMAC digests character by character.
- **Remediation:** Replaced with constant-time comparison utility `timingSafeTokenCompare()` backed by `crypto.timingSafeEqual()`.

### GV-005: Missing Production HTTP Security Headers
- **Severity:** Medium (CVSS 6.5)
- **Attack Class:** Security Configuration
- **Affected File:** `next.config.ts`
- **Root Cause:** Omitted standard OWASP security headers.
- **Security Impact:** Vulnerable to Clickjacking (`X-Frame-Options`), MIME-confusion attacks (`X-Content-Type-Options`), Referrer leakage, and unconstrained device permissions.
- **Remediation:** Added global security headers in `next.config.ts`: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security`, and restrictive `Permissions-Policy`.

### GV-006: Unauthenticated Orphaned Score API Granting Arbitrary XP and Coin Calculations
- **Severity:** Medium (CVSS 6.5)
- **Attack Class:** Input Validation & Authorization
- **Affected File:** `src/app/api/scores/submit/route.ts`
- **Root Cause:** Public endpoint returning calculated reward tokens without session verification or proof of play.
- **Security Impact:** Automated bots could submit fake scores to harvest calculated rewards.
- **Remediation:** Enforced game score ceilings and documented migration to authoritative `/api/session/finish` pipeline.

### GV-007: Unbounded In-Memory Rate Limiting Map Prone to Memory Exhaustion
- **Severity:** Low (CVSS 4.3)
- **Attack Class:** Resource Exhaustion & Availability
- **Affected Files:** `src/app/api/contact/route.ts`, `src/app/api/rooms/route.ts`
- **Root Cause:** `rateLimitMap` stored IP timestamps without size bounds or TTL eviction.
- **Security Impact:** Sustained high-volume traffic with rotating IP headers could cause monotonic memory growth.
- **Remediation:** Added `pruneRateLimitMap()` to actively prune expired timestamps and enforce a maximum entry cap.
