import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { initFirebase } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Zod schema for validating contact and support submissions
const ContactSubmissionSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  category: z.enum([
    'general',
    'bug_report',
    'account_help',
    'legal_inquiry',
    'fair_play_violation',
    'feedback'
  ]),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(120, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message cannot exceed 2000 characters')
});

// In-memory rate limiting map (IP -> timestamps array)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Prune expired entries to prevent unbounded memory growth
const pruneRateLimitMap = (now: number) => {
  if (rateLimitMap.size > 200) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const active = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, active);
      }
    }
  }
};

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  pruneRateLimitMap(now);
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous_client';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before submitting again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = ContactSubmissionSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: parseResult.error.issues.map((i) => i.message)
        },
        { status: 400 }
      );
    }

    const { name, email, category, subject, message } = parseResult.data;

    // Sanitize fields (basic HTML escape)
    const sanitizedData = {
      name: name.replace(/[<>]/g, ''),
      email: email.trim().toLowerCase(),
      category,
      subject: subject.replace(/[<>]/g, ''),
      message: message.replace(/[<>]/g, ''),
      ipAddress: ip,
      submittedAt: new Date().toISOString(),
      status: 'new'
    };

    // Store in Firestore if available
    try {
      const { db } = initFirebase();
      if (db) {
        await addDoc(collection(db, 'support_tickets'), {
          ...sanitizedData,
          createdAt: serverTimestamp()
        });
      }
    } catch (dbError) {
      console.warn('Firestore support_tickets write warning (continuing with success ack):', dbError);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been received by GullyVerse Support.',
      ticketId: `GV-${Date.now().toString(36).toUpperCase()}`
    });
  } catch (err: unknown) {
    console.error('Contact API Error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
