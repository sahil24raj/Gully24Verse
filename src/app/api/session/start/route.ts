import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { getGameSessionSecret } from '@/lib/security/sessionSecret';

const StartSessionSchema = z.object({
  gameId: z.string().min(1),
  uid: z.string().optional(),
  username: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = StartSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid start session payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { gameId, uid = 'guest', username = 'Gamer' } = parsed.data;
    const sessionId = `ses_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
    const startTime = Date.now();
    const seed = Math.floor(Math.random() * 1000000);

    // Create cryptographic HMAC signature using secure centralized secret
    const secret = getGameSessionSecret();
    const payload = `${sessionId}|${gameId}|${uid}|${startTime}|${seed}`;
    const sessionToken = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    return NextResponse.json({
      success: true,
      sessionId,
      sessionToken,
      gameId,
      startTime,
      seed,
    });
  } catch (error: any) {
    console.error('Session start error:', error);
    return NextResponse.json({ success: false, error: 'Failed to start game session' }, { status: 500 });
  }
}
