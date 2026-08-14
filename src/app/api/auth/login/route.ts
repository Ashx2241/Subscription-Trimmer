import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { verifyPassword, setSessionCookie } from '@/lib/auth';
import { logAuditEvent } from '@/services/security/auditLogger';
import { applyRateLimitMiddleware } from '@/services/security/rateLimiter';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check (Brute-Force Defense: Max 5 attempts / min)
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimitError = applyRateLimitMiddleware(`login:${ip}`, 5, 60000);
    if (rateLimitError) return rateLimitError;

    // 2. Input Sanitization & Zod Validation
    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse('INVALID_INPUT', parseResult.error.issues[0].message, 400);
    }

    const { email, password } = parseResult.data;

    // 3. User Credentials Verification
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      await logAuditEvent({
        actorId: user.id,
        action: 'USER_LOGIN_FAILED',
        resource: '/api/auth/login',
        ipAddress: ip,
      });
      return errorResponse('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    // 4. Issue HttpOnly, Secure Session Cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await logAuditEvent({
      actorId: user.id,
      action: 'USER_LOGIN_SUCCESS',
      resource: '/api/auth/login',
      ipAddress: ip,
    });

    const { passwordHash: _, ...safeUser } = user;
    return successResponse(safeUser, 'Login successful');
  } catch (error) {
    console.error('Login Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to authenticate user', 500);
  }
}
