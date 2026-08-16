import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireAuth();

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.userId },
      include: {
        merchant: true,
        cancellationRequests: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { monthlyCost: 'desc' },
    });

    const activeSubs = subscriptions.filter((s) => s.status === 'ACTIVE');
    const totalMonthlySpend = activeSubs.reduce((sum, s) => sum + s.monthlyCost, 0);
    const totalAnnualSpend = activeSubs.reduce((sum, s) => sum + s.annualizedCost, 0);

    const confirmedCancelled = subscriptions.filter(
      (s) => s.status === 'CANCELLED' || s.cancellationRequests?.[0]?.status === 'CONFIRMED'
    );

    const confirmedAnnualSavings = confirmedCancelled.reduce((sum, s) => sum + s.annualizedCost, 0);

    return successResponse(
      {
        subscriptions,
        metrics: {
          totalActiveCount: activeSubs.length,
          totalMonthlySpend: Number(totalMonthlySpend.toFixed(2)),
          totalAnnualSpend: Number(totalAnnualSpend.toFixed(2)),
          confirmedAnnualSavings: Number(confirmedAnnualSavings.toFixed(2)),
        },
      },
      'Subscriptions retrieved'
    );
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      const authError = error as { code: string; message: string; status: number };
      return errorResponse(authError.code, authError.message, authError.status);
    }
    console.error('Get Subscriptions Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to retrieve subscriptions', 500);
  }
}
