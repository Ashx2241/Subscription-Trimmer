import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { hashPassword, setSessionCookie } from '@/lib/auth';
import { logAuditEvent } from '@/services/security/auditLogger';
import { applyRateLimitMiddleware } from '@/services/security/rateLimiter';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const rawIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const ip = rawIp.split(',')[0].trim();

    // 1. Rate limiting (10 registrations per minute per IP)
    const rateLimitResult = applyRateLimitMiddleware(`register:${ip}`, 10, 60000);
    if (rateLimitResult) return rateLimitResult;

    // 2. Input Validation
    const body = await req.json();
    const parseResult = registerSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse('INVALID_INPUT', parseResult.error.issues[0].message, 400);
    }

    const { name, email, password } = parseResult.data;

    // 3. Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse('EMAIL_EXISTS', 'An account with this email already exists', 409);
    }

    // 4. Create user with hashed password
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'USER',
        profile: {
          create: {
            currency: 'USD',
            timezone: 'America/New_York',
          },
        },
      },
    });

    // 5. Set Session Cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: 'USER',
    });

    // 6. Audit log
    await logAuditEvent({
      actorId: user.id,
      action: 'USER_REGISTERED',
      resource: '/api/auth/register',
      ipAddress: ip,
    });

    return successResponse(
      { id: user.id, name, email, role: 'USER' },
      'Account registered successfully',
      201
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to register account', 500);
  }
}
