import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { hashPassword } from '@/lib/auth';
import { logAuditEvent } from '@/services/security/auditLogger';
import { applyRateLimitMiddleware } from '@/services/security/rateLimiter';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const rawIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const ip = rawIp.split(',')[0].trim();

    // Rate limit
    const rateLimitResult = applyRateLimitMiddleware(`reset-password:${ip}`, 5, 15 * 60 * 1000);
    if (rateLimitResult) return rateLimitResult;

    const body = await req.json();
    const parseResult = resetPasswordSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse('INVALID_INPUT', parseResult.error.issues[0].message, 400);
    }

    const { email, newPassword } = parseResult.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return errorResponse('USER_NOT_FOUND', 'No account found with this email address', 404);
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await logAuditEvent({
      actorId: user.id,
      action: 'PASSWORD_RESET_COMPLETED',
      resource: '/api/auth/reset-password',
      ipAddress: ip,
    });

    return successResponse({ updated: true }, 'Password has been successfully updated.');
  } catch (error) {
    console.error('Reset Password Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to reset password', 500);
  }
}
