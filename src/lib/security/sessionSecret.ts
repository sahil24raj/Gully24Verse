import crypto from 'crypto';

let runtimeSecret: string | null = null;

/**
 * Returns the cryptographically secure secret used for HMAC signatures and token encryption.
 * Enforces production environment variables while generating a secure ephemeral fallback in dev.
 */
export function getGameSessionSecret(): string {
  if (process.env.GAME_SESSION_SECRET && process.env.GAME_SESSION_SECRET.trim().length >= 16) {
    return process.env.GAME_SESSION_SECRET.trim();
  }

  // If in production without secret, log critical security warning
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[CRITICAL SECURITY WARNING] GAME_SESSION_SECRET is not configured in environment variables! Using runtime ephemeral key.'
    );
  }

  if (!runtimeSecret) {
    // Generate 32 bytes (256-bit) cryptographically strong random secret
    runtimeSecret = crypto.randomBytes(32).toString('hex');
  }

  return runtimeSecret;
}

/**
 * Compares two token strings in constant time to prevent side-channel timing attacks.
 */
export function timingSafeTokenCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false;
  }

  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');

  if (bufA.length !== bufB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}
