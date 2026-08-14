import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const connectionCount = await prisma.bankConnection.count();
    const totalTransactions = await prisma.transaction.count();
    const subscriptionCount = await prisma.subscription.count();
    const activeSubCount = await prisma.subscription.count({ where: { status: 'ACTIVE' } });
    const cancelledSubCount = await prisma.subscription.count({ where: { status: 'CANCELLED' } });

    const auditLogs = await prisma.auditLog.findMany({
      take: 25,
      orderBy: { timestamp: 'desc' },
      include: { actor: { select: { name: true, email: true } } },
    });

    const merchants = await prisma.merchant.findMany({
      take: 20,
      include: { _count: { select: { subscriptions: true } } },
    });

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { bankConnections: true, subscriptions: true } },
      },
    });

    const confirmedSavingsAggregate = await prisma.subscription.aggregate({
      where: { status: 'CANCELLED' },
      _sum: { annualizedCost: true },
    });

    return successResponse(
      {
        systemKpis: {
          totalUsers: userCount,
          totalBankConnections: connectionCount,
          totalTransactionsProcessed: totalTransactions,
          totalSubscriptionsDetected: subscriptionCount,
          activeSubscriptions: activeSubCount,
          cancelledSubscriptions: cancelledSubCount,
          aggregateConfirmedAnnualSavings: confirmedSavingsAggregate._sum.annualizedCost || 0.0,
        },
        users,
        merchants,
        recentAuditLogs: auditLogs,
      },
      'Admin system dashboard metrics retrieved'
    );
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to retrieve admin dashboard metrics', 500);
  }
}
