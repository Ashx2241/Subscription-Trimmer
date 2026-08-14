import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { logAuditEvent } from '@/services/security/auditLogger';
import { canTransitionStatus } from '@/services/cancellation/stateMachine';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cancellationId } = await params;
    const user = await prisma.user.findFirst({ where: { email: 'user@example.com' } });
    if (!user) return errorResponse('UNAUTHORIZED', 'User not authenticated', 401);

    const request = await prisma.cancellationRequest.findUnique({
      where: { id: cancellationId },
      include: { subscription: { include: { merchant: true } } },
    });

    if (!request || request.userId !== user.id) {
      return errorResponse('NOT_FOUND', 'Cancellation request not found', 404);
    }

    if (!canTransitionStatus(request.status, 'USER_SENT')) {
      return errorResponse(
        'INVALID_STATE_TRANSITION',
        `Cannot transition cancellation status from ${request.status} to USER_SENT`,
        400
      );
    }

    const updated = await prisma.cancellationRequest.update({
      where: { id: cancellationId },
      data: {
        status: 'USER_SENT',
        authorizedAt: new Date(),
      },
    });

    // Immutable Audit Log entry for explicit user authorization
    await logAuditEvent({
      actorId: user.id,
      action: 'EXPLICIT_CANCELLATION_AUTHORIZED',
      resource: `/api/cancellations/${cancellationId}/authorize`,
      metadata: {
        merchant: request.subscription.merchant.normalizedName,
        subscriptionId: request.subscriptionId,
        authorizedAt: updated.authorizedAt,
      },
    });

    return successResponse(updated, 'Cancellation request explicitly authorized by user');
  } catch (error) {
    console.error('Authorize Cancellation Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to authorize cancellation request', 500);
  }
}
