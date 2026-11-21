/**
 * Cloudflare Turnstile Bot Verification Helper
 * Provides server-side siteverify token validation with graceful fallback.
 * Adheres to Cloudflare Free Plan specifications and does not interrupt Firebase Auth.
 */

export interface TurnstileVerificationResult {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
  action?: string;
  cdata?: string;
}

/**
 * Validates a Turnstile token against Cloudflare's siteverify API.
 * If CLOUDFLARE_TURNSTILE_SECRET_KEY is not configured, logs a notice and returns true
 * in development/non-blocking mode to ensure application continuity.
 */
export async function verifyTurnstileToken(
  token: string | undefined | null,
  remoteIp?: string
): Promise<{ valid: boolean; reason?: string }> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  // Graceful degradation if secret key is not set up yet
  if (!secretKey) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        '[Turnstile] CLOUDFLARE_TURNSTILE_SECRET_KEY not set. Allowing request through fallback.'
      );
    }
    return { valid: true, reason: 'unconfigured_passthrough' };
  }

  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    return { valid: false, reason: 'missing_token' };
  }

  // Sanity check token length (Cloudflare tokens are well under 2048 chars)
  if (token.length > 2048) {
    return { valid: false, reason: 'token_too_long' };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey.trim());
    formData.append('response', token.trim());
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!res.ok) {
      console.error(`[Turnstile] Verification HTTP error: ${res.status}`);
      return { valid: false, reason: `http_${res.status}` };
    }

    const outcome: TurnstileVerificationResult = await res.json();

    if (outcome.success) {
      return { valid: true };
    }

    console.warn('[Turnstile] Challenge verification failed:', outcome['error-codes']);
    return {
      valid: false,
      reason: outcome['error-codes']?.join(', ') || 'verification_failed',
    };
  } catch (err: any) {
    console.error('[Turnstile] Network error during siteverify:', err.message);
    // In event of network failure to Cloudflare, fail safe or log depending on risk profile
    return { valid: false, reason: 'network_error' };
  }
}
