import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { logAuditEvent } from '@/services/security/auditLogger';
import { z } from 'zod';

const decisionSchema = z.object({
  decision: z.enum(['KEEP', 'REVIEW', 'CANCEL', 'NOT_A_SUBSCRIPTION']),
  customCategory: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: subscriptionId } = await params;
    const body = await req.json();

    const parseResult = decisionSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse('INVALID_INPUT', parseResult.error.issues[0].message, 400);
    }

    const { decision, customCategory } = parseResult.data;

    const user = await prisma.user.findFirst({ where: { email: 'user@example.com' } });
    if (!user) return errorResponse('UNAUTHORIZED', 'User not authenticated', 401);

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { merchant: true },
    });

    if (!subscription || subscription.userId !== user.id) {
      return errorResponse('NOT_FOUND', 'Subscription not found', 404);
    }

    if (decision === 'NOT_A_SUBSCRIPTION') {
      // Create subscription override and delete/pause subscription
      await prisma.subscriptionOverride.upsert({
        where: {
          userId_merchantId: {
            userId: user.id,
            merchantId: subscription.merchantId,
          },
        },
        update: { isSubscription: false },
        create: {
          userId: user.id,
          merchantId: subscription.merchantId,
          isSubscription: false,
          customCategory,
        },
      });

      const updatedSub = await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { status: 'PAUSED', userStatus: 'REVIEW' },
      });

      await logAuditEvent({
        actorId: user.id,
        action: 'SUBSCRIPTION_OVERRIDE_NOT_A_SUB',
        resource: `/api/subscriptions/${subscriptionId}`,
        metadata: { merchant: subscription.merchant.normalizedName },
      });

      return successResponse(updatedSub, 'Subscription marked as Not A Subscription');
    }

    // Update user decision status
    const updatedSub = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { userStatus: decision },
    });

    // If decision is CANCEL, automatically initialize or fetch CancellationRequest
    if (decision === 'CANCEL') {
      const existingReq = await prisma.cancellationRequest.findFirst({
        where: { subscriptionId },
      });

      if (!existingReq) {
        await prisma.cancellationRequest.create({
          data: {
            subscriptionId,
            userId: user.id,
            status: 'NOT_STARTED',
            method: subscription.merchant.cancellationUrl ? 'GUIDED_LINK' : 'AI_EMAIL',
          },
        });
      }
    }

    await logAuditEvent({
      actorId: user.id,
      action: `SUBSCRIPTION_DECISION_${decision}`,
      resource: `/api/subscriptions/${subscriptionId}`,
      metadata: { merchant: subscription.merchant.normalizedName, decision },
    });

    return successResponse(updatedSub, `Subscription marked as ${decision}`);
  } catch (error) {
    console.error('Subscription Decision Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to update subscription decision', 500);
  }
}
