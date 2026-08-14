import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/apiResponse';
import { clearSessionCookie, getSessionContext } from '@/lib/auth';
import { logAuditEvent } from '@/services/security/auditLogger';

export async function POST(req: NextRequest) {
  const session = await getSessionContext();
  if (session) {
    await logAuditEvent({
      actorId: session.userId,
      action: 'USER_LOGOUT',
      resource: '/api/auth/logout',
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
    });
  }

  await clearSessionCookie();
  return successResponse(null, 'Logged out successfully');
}
