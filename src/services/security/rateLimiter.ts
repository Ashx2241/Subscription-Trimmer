import { NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: { count: number; expiresAt: number };
}

const memoryStore: RateLimitStore = {};

export function checkRateLimit(
  identifier: string,
  limit: number = 20,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const record = memoryStore[identifier];

  if (!record || now > record.expiresAt) {
    memoryStore[identifier] = {
      count: 1,
      expiresAt: now + windowMs,
    };
    return { allowed: true, remaining: limit - 1, resetMs: windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetMs: record.expiresAt - now };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetMs: record.expiresAt - now };
}

export function applyRateLimitMiddleware(identifier: string, limit = 20, windowMs = 60000) {
  const result = checkRateLimit(identifier, limit, windowMs);
  if (!result.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
        },
      },
      { status: 429 }
    );
  }
  return null;
}
