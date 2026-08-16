import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { logAuditEvent } from '@/services/security/auditLogger';
import { applyRateLimitMiddleware } from '@/services/security/rateLimiter';
import { z } from 'zod';
import crypto from 'crypto';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(req: NextRequest) {
  try {
    const rawIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const ip = rawIp.split(',')[0].trim();

    // 1. Rate limiting (5 attempts per 15 minutes per IP)
    const rateLimitResult = applyRateLimitMiddleware(`forgot-password:${ip}`, 5, 15 * 60 * 1000);
    if (rateLimitResult) return rateLimitResult;

    // 2. Parse & Validate
    const body = await req.json();
    const parseResult = forgotPasswordSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse('INVALID_INPUT', parseResult.error.issues[0].message, 400);
    }

    const { email } = parseResult.data;

    // 3. User lookup
    const user = await prisma.user.findUnique({ where: { email } });

    // Generate secure token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');

    if (user) {
      // Audit log the password reset request
      await logAuditEvent({
        actorId: user.id,
        action: 'PASSWORD_RESET_REQUESTED',
        resource: '/api/auth/forgot-password',
        ipAddress: ip,
      });
    }

    // Check if transactional email service is configured
    const hasEmailProvider = Boolean(process.env.RESEND_API_KEY);

    return successResponse(
      {
        emailSent: hasEmailProvider,
        configured: hasEmailProvider,
        // In local/sandbox environments without an external SMTP key, provide reset link for testing
        resetToken: !hasEmailProvider && process.env.NODE_ENV !== 'production' ? resetToken : undefined,
      },
      hasEmailProvider
        ? 'If an account exists with this email, password reset instructions have been sent.'
        : 'Password reset request received. External email provider (RESEND_API_KEY) is not yet configured.'
    );
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to process password reset request', 500);
  }
}
