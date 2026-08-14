import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const user = await prisma.user.findFirst({ where: { email: 'user@example.com' } });
    if (!user) return errorResponse('UNAUTHORIZED', 'User not authenticated', 401);

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      include: {
        merchant: true,
        cancellationRequests: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    const activeSubs = subscriptions.filter((s) => s.status === 'ACTIVE');
    const cancelledSubs = subscriptions.filter(
      (s) => s.status === 'CANCELLED' || s.cancellationRequests[0]?.status === 'CONFIRMED'
    );

    // 1. Total Spend Metrics
    const totalMonthlySpend = activeSubs.reduce((acc, s) => acc + s.monthlyCost, 0);
    const totalAnnualSpend = activeSubs.reduce((acc, s) => acc + s.annualizedCost, 0);

    const potentialAnnualSavings = subscriptions
      .filter((s) => s.userStatus === 'CANCEL' && s.status === 'ACTIVE')
      .reduce((acc, s) => acc + s.annualizedCost, 0);

    const confirmedAnnualSavings = cancelledSubs.reduce((acc, s) => acc + s.annualizedCost, 0);

    // 2. Spend by Category Breakdown
    const categoryMap: Record<string, { category: string; monthlyCost: number; count: number }> = {};
    for (const sub of activeSubs) {
      const cat = sub.merchant.category || 'General';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { category: cat, monthlyCost: 0, count: 0 };
      }
      categoryMap[cat].monthlyCost += sub.monthlyCost;
      categoryMap[cat].count += 1;
    }

    const categoryBreakdown = Object.values(categoryMap).map((item) => ({
      ...item,
      monthlyCost: Number(item.monthlyCost.toFixed(2)),
    }));

    // 3. 12-Month Spend Trend Data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const spendTrend = [];

    for (let i = 11; i >= 0; i--) {
      const idx = (currentMonth - i + 12) % 12;
      const monthLabel = monthNames[idx];
      // Variance simulation for visualization
      const spend = totalMonthlySpend * (0.92 + ((i * 17) % 15) / 100);
      spendTrend.push({
        month: monthLabel,
        spend: Number(spend.toFixed(2)),
      });
    }

    return successResponse(
      {
        metrics: {
          totalActiveSubscriptions: activeSubs.length,
          totalMonthlySpend: Number(totalMonthlySpend.toFixed(2)),
          totalAnnualSpend: Number(totalAnnualSpend.toFixed(2)),
          potentialAnnualSavings: Number(potentialAnnualSavings.toFixed(2)),
          confirmedAnnualSavings: Number(confirmedAnnualSavings.toFixed(2)),
        },
        categoryBreakdown,
        spendTrend,
      },
      'Analytics retrieved successfully'
    );
  } catch (error) {
    console.error('Get Analytics Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to calculate financial analytics', 500);
  }
}
