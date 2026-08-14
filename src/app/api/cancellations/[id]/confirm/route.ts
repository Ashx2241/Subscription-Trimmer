import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { logAuditEvent } from '@/services/security/auditLogger';

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

    const now = new Date();

    const updatedRequest = await prisma.cancellationRequest.update({
      where: { id: cancellationId },
      data: {
        status: 'CONFIRMED',
        confirmedAt: now,
      },
    });

    await prisma.subscription.update({
      where: { id: request.subscriptionId },
      data: {
        status: 'CANCELLED',
        userStatus: 'CANCEL',
      },
    });

    await logAuditEvent({
      actorId: user.id,
      action: 'CANCELLATION_CONFIRMED',
      resource: `/api/cancellations/${cancellationId}/confirm`,
      metadata: {
        merchant: request.subscription.merchant.normalizedName,
        annualSavings: request.subscription.annualizedCost,
        confirmedAt: now,
      },
    });

    return successResponse(
      {
        cancellation: updatedRequest,
        savingsLockedAnnual: request.subscription.annualizedCost,
      },
      'Cancellation confirmed successfully! Annual savings locked.'
    );
  } catch (error) {
    console.error('Confirm Cancellation Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to confirm cancellation', 500);
  }
}
