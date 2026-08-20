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

    // Subscription status breakdown
    const totalSubCount = subscriptions.length;
    const statusMap: Record<string, number> = { KEEP: 0, REVIEW: 0, CANCEL: 0 };
    for (const sub of subscriptions) {
      const decision = sub.userStatus || 'REVIEW';
      statusMap[decision] = (statusMap[decision] || 0) + 1;
    }
    const statusBreakdown = [
      { name: 'Keep (Active)', value: totalSubCount > 0 ? Number(((statusMap.KEEP / totalSubCount) * 100).toFixed(0)) : 0, count: statusMap.KEEP, color: '#10b981' },
      { name: 'Needs Review', value: totalSubCount > 0 ? Number(((statusMap.REVIEW / totalSubCount) * 100).toFixed(0)) : 0, count: statusMap.REVIEW, color: '#f59e0b' },
      { name: 'Marked to Cancel', value: totalSubCount > 0 ? Number(((statusMap.CANCEL / totalSubCount) * 100).toFixed(0)) : 0, count: statusMap.CANCEL, color: '#f43f5e' },
    ].filter((item) => totalSubCount === 0 || item.count > 0);

    // Cadence breakdown
    const frequencyMap: Record<string, number> = {};
    for (const sub of activeSubs) {
      const freq = sub.frequency || 'MONTHLY';
      frequencyMap[freq] = (frequencyMap[freq] || 0) + 1;
    }
    const cadenceBreakdown = Object.entries(frequencyMap).map(([freq, count], idx) => {
      const colors = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      return {
        name: freq.charAt(0) + freq.slice(1).toLowerCase(),
        value: activeSubs.length > 0 ? Number(((count / activeSubs.length) * 100).toFixed(0)) : 0,
        count,
        color: colors[idx % colors.length],
      };
    });

    // Total transaction volume
    let totalVolume = 0;
    let lastTransactionDate: Date | null = null;
    if (accountIds.length > 0) {
      const volumeAgg = await prisma.transaction.aggregate({
        where: { accountId: { in: accountIds } },
        _sum: { amount: true },
      });
      totalVolume = volumeAgg._sum.amount || 0;

      const latestTxn = await prisma.transaction.findFirst({
        where: { accountId: { in: accountIds } },
        orderBy: { date: 'desc' },
        select: { date: true },
      });
      lastTransactionDate = latestTxn?.date || null;
    }

    return successResponse(
      {
        metrics: {
          totalActiveSubscriptions: activeSubs.length,
          totalMonthlySpend: Number(totalMonthlySpend.toFixed(2)),
          totalAnnualSpend: Number(totalAnnualSpend.toFixed(2)),
          potentialAnnualSavings: Number(potentialAnnualSavings.toFixed(2)),
          confirmedAnnualSavings: Number(confirmedAnnualSavings.toFixed(2)),
          totalBalance: Number(totalBalance.toFixed(2)),
          totalVolume: Number(totalVolume.toFixed(2)),
          transactionCount,
          lastTransactionDate: lastTransactionDate ? lastTransactionDate.toISOString() : null,
        },
        categoryBreakdown,
        statusBreakdown,
        cadenceBreakdown,
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
