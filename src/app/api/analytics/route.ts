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
        cancellationRequests: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });

    const activeSubs = subscriptions.filter((s) => s.status === 'ACTIVE');
    const cancelledSubs = subscriptions.filter(
      (s) => s.status === 'CANCELLED' || s.cancellationRequests[0]?.status === 'CONFIRMED'
    );

    const totalMonthlySpend = activeSubs.reduce((acc, s) => acc + s.monthlyCost, 0);
    const totalAnnualSpend = activeSubs.reduce((acc, s) => acc + s.annualizedCost, 0);

    const potentialAnnualSavings = subscriptions
      .filter((s) => s.userStatus === 'CANCEL' && s.status === 'ACTIVE')
      .reduce((acc, s) => acc + s.annualizedCost, 0);

    const confirmedAnnualSavings = cancelledSubs.reduce((acc, s) => acc + s.annualizedCost, 0);

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

    // Build spend trend from actual transaction data
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const spendTrend = [];

    // Get bank accounts for this user
    const bankConnections = await prisma.bankConnection.findMany({
      where: { userId: session.userId },
      include: { accounts: true },
    });
    const accountIds = bankConnections.flatMap((c) => c.accounts.map((a) => a.id));

    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthLabel = monthNames[monthDate.getMonth()];

      let spend = 0;
      if (accountIds.length > 0) {
        const monthTransactions = await prisma.transaction.aggregate({
          where: {
            accountId: { in: accountIds },
            date: { gte: monthDate, lte: monthEnd },
            amount: { gt: 0 }, // Only outgoing
          },
          _sum: { amount: true },
        });
        spend = monthTransactions._sum.amount || 0;
      }

      // If no transaction data, estimate from current subscriptions
      if (spend === 0 && activeSubs.length > 0) {
        spend = totalMonthlySpend;
      }

      spendTrend.push({
        month: monthLabel,
        spend: Number(spend.toFixed(2)),
      });
    }

    // Get bank balance info
    const totalBalance = bankConnections.reduce(
      (sum, conn) => sum + conn.accounts.reduce((aSum, acc) => aSum + (acc.balanceCurrent || 0), 0),
      0
    );

    // Get total transaction count
    const transactionCount = accountIds.length > 0
      ? await prisma.transaction.count({ where: { accountId: { in: accountIds } } })
      : 0;

    return successResponse(
      {
        metrics: {
          totalActiveSubscriptions: activeSubs.length,
          totalMonthlySpend: Number(totalMonthlySpend.toFixed(2)),
          totalAnnualSpend: Number(totalAnnualSpend.toFixed(2)),
          potentialAnnualSavings: Number(potentialAnnualSavings.toFixed(2)),
          confirmedAnnualSavings: Number(confirmedAnnualSavings.toFixed(2)),
          totalBalance: Number(totalBalance.toFixed(2)),
          transactionCount,
        },
        categoryBreakdown,
        spendTrend,
      },
      'Analytics retrieved successfully'
    );
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      const authError = error as { code: string; message: string; status: number };
      return errorResponse(authError.code, authError.message, authError.status);
    }
    console.error('Get Analytics Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to retrieve analytics', 500);
  }
}
