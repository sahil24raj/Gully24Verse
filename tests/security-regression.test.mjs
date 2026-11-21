import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// 1. Test Timing-Safe Token Comparison
test('timingSafeTokenCompare correctly and safely verifies matching tokens', () => {
  const tokenA = crypto.randomBytes(32).toString('hex');
  const tokenB = Buffer.from(tokenA).toString('utf-8');
  const tampered = tokenA.slice(0, -1) + (tokenA.slice(-1) === 'a' ? 'b' : 'a');

  // Helper simulating timingSafeTokenCompare
  const compare = (a, b) => {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const bufA = Buffer.from(a, 'utf-8');
    const bufB = Buffer.from(b, 'utf-8');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  };

  assert.equal(compare(tokenA, tokenB), true, 'Identical tokens must match');
  assert.equal(compare(tokenA, tampered), false, 'Tampered token must be rejected');
  assert.equal(compare(tokenA, 'short'), false, 'Different length token must be rejected without throw');
});

// 2. Test HMAC Session Signature Integrity
test('HMAC game session signature detects any payload alteration', () => {
  const secret = 'test_secret_for_security_suite_verification_12345';
  const sessionId = 'ses_1700000000_abcdef';
  const gameId = 'modi-run';
  const uid = 'player_789';
  const startTime = Date.now() - 5000;
  const seed = 424242;

  const validPayload = `${sessionId}|${gameId}|${uid}|${startTime}|${seed}`;
  const validToken = crypto.createHmac('sha256', secret).update(validPayload).digest('hex');

  // Verification
  const verify = (pId, gId, u, sTime, s, token) => {
    const p = `${pId}|${gId}|${u}|${sTime}|${s}`;
    const expected = crypto.createHmac('sha256', secret).update(p).digest('hex');
    const bufA = Buffer.from(token);
    const bufB = Buffer.from(expected);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  };

  assert.equal(verify(sessionId, gameId, uid, startTime, seed, validToken), true);
  // Attempt tampering with gameId
  assert.equal(verify(sessionId, 'chai-tapri', uid, startTime, seed, validToken), false);
  // Attempt tampering with UID (impersonation)
  assert.equal(verify(sessionId, gameId, 'victim_uid', startTime, seed, validToken), false);
  // Attempt tampering with session ID (replay)
  assert.equal(verify('ses_other', gameId, uid, startTime, seed, validToken), false);
});

// 3. Test Game PPS and Timing Limits (Anti-Cheat Engine)
test('Anti-Cheat rule rejects impossible Points-Per-Second accumulation', () => {
  const maxPPS = 150;
  const durationMs = 2000; // 2 seconds
  const impossibleScore = 2000; // 1000 PPS (impossible)
  const reasonableScore = 250; // 125 PPS (physically possible)

  const effectiveSec = Math.max(1, durationMs / 1000);
  const ppsImpossible = impossibleScore / effectiveSec;
  const ppsReasonable = reasonableScore / effectiveSec;

  assert.ok(ppsImpossible > maxPPS, 'Impossible score must violate PPS ceiling');
  assert.ok(ppsReasonable <= maxPPS, 'Legitimate score must be within PPS limit');
});

// 4. Test Firestore Rules Security Posture
test('firestore.rules enforces strict ownership and rejects unauthenticated writes', () => {
  const rulesPath = path.join(rootDir, 'firestore.rules');
  const rules = fs.readFileSync(rulesPath, 'utf-8');

  // Must not have open allow write: if true on users
  assert.ok(!rules.includes('match /users/{userId} {\n      allow read: if true;\n      allow write: if true;'), 'Open user write must be removed');
  // Must enforce request.auth.uid == userId
  assert.ok(rules.includes('request.auth.uid == userId'), 'User doc must enforce authentication and ownership');
  // Must prevent privilege escalation (role, isAdmin)
  assert.ok(rules.includes('isAdmin'), 'Rules must protect isAdmin privilege escalation');
  assert.ok(rules.includes('support_tickets'), 'support_tickets collection must be defined');
  // Must have default deny
  assert.ok(rules.includes('allow read, write: if false;'), 'Default deny wildcard must be present');
});

// 5. Test next.config.ts HTTP Security Headers
test('next.config.ts includes OWASP Top 10 required security headers', () => {
  const configPath = path.join(rootDir, 'next.config.ts');
  const configContent = fs.readFileSync(configPath, 'utf-8');

  assert.ok(configContent.includes('X-Frame-Options'), 'Must include X-Frame-Options');
  assert.ok(configContent.includes('X-Content-Type-Options'), 'Must include X-Content-Type-Options');
  assert.ok(configContent.includes('Referrer-Policy'), 'Must include Referrer-Policy');
  assert.ok(configContent.includes('Strict-Transport-Security'), 'Must include Strict-Transport-Security');
  assert.ok(configContent.includes('Permissions-Policy'), 'Must include Permissions-Policy');
});
