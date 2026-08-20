import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { requireAuth } from '@/lib/auth';
import { logAuditEvent } from '@/services/security/auditLogger';
import { MockAIProvider } from '@/services/ai/MockAIProvider';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cancellationId } = await params;
    const session = await requireAuth();
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { profile: true },
    });
    if (!user) return errorResponse('UNAUTHORIZED', 'User not found', 401);

    const request = await prisma.cancellationRequest.findUnique({
      where: { id: cancellationId },
      include: {
        subscription: {
          include: { merchant: true },
        },
      },
    });

    if (!request || request.userId !== session.userId) {
      return errorResponse('NOT_FOUND', 'Cancellation request not found', 404);
    }

    const aiProvider = new MockAIProvider();
    const generatedLetter = await aiProvider.generateCancellationLetter({
      userName: user.name,
      userEmail: user.email,
      userPhone: user.profile?.phoneNumber || undefined,
      merchantName: request.subscription.merchant.normalizedName,
      merchantEmail: request.subscription.merchant.cancellationEmail || undefined,
      accountNumber: `ACCT-${request.subscription.id.slice(0, 8).toUpperCase()}`,
      effectiveDate: new Date().toLocaleDateString('en-US'),
    });

    const updated = await prisma.cancellationRequest.update({
      where: { id: cancellationId },
      data: {
        generatedContent: generatedLetter,
        status: 'MESSAGE_GENERATED',
      },
    });

    await logAuditEvent({
      actorId: user.id,
      action: 'AI_CANCELLATION_MESSAGE_GENERATED',
      resource: `/api/cancellations/${cancellationId}`,
      metadata: { merchant: request.subscription.merchant.normalizedName },
    });

    return successResponse(updated, 'AI cancellation letter generated successfully');
  } catch (error) {
    console.error('Generate Message Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to generate cancellation letter', 500);
  }
}
