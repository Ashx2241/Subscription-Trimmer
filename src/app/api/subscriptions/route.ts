import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { FALLBACK_SUBSCRIPTIONS } from '@/lib/demoFallback';

export async function GET() {
  try {
    const user = await prisma.user.findFirst({ where: { email: 'user@example.com' } });
    
    let subscriptions: any[] = [];

    if (user) {
      subscriptions = await prisma.subscription.findMany({
        where: { userId: user.id },
        include: {
          merchant: true,
          cancellationRequests: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { monthlyCost: 'desc' },
      });
    }

    if (!subscriptions || subscriptions.length === 0) {
      subscriptions = FALLBACK_SUBSCRIPTIONS;
    }

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
  } catch (error) {
    console.error('Get Subscriptions Error:', error);
    // Return fallback subscriptions for serverless robustness
    const activeSubs = FALLBACK_SUBSCRIPTIONS.filter((s) => s.status === 'ACTIVE');
    const totalMonthlySpend = activeSubs.reduce((sum, s) => sum + s.monthlyCost, 0);
    const totalAnnualSpend = activeSubs.reduce((sum, s) => sum + s.annualizedCost, 0);

    return successResponse(
      {
        subscriptions: FALLBACK_SUBSCRIPTIONS,
        metrics: {
          totalActiveCount: activeSubs.length,
          totalMonthlySpend: Number(totalMonthlySpend.toFixed(2)),
          totalAnnualSpend: Number(totalAnnualSpend.toFixed(2)),
          confirmedAnnualSavings: 0.0,
        },
      },
      'Subscriptions retrieved (Demo Serverless Mode)'
    );
  }
}
