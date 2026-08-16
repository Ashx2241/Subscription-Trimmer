import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { getSessionContext } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: session.userId,
        status: 'ACTIVE',
      },
      include: { merchant: true },
      orderBy: { nextBillingDate: 'asc' },
    });

    const now = new Date();
    const upcomingEvents = subscriptions
      .filter((s) => s.nextBillingDate)
      .map((s) => {
        const nextDate = new Date(s.nextBillingDate!);
        const diffTime = nextDate.getTime() - now.getTime();
        const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

        return {
          id: s.id,
          merchant: s.merchant.normalizedName,
          category: s.merchant.category,
          amount: s.amount,
          currency: s.currency,
          frequency: s.frequency,
          date: nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          daysLeft,
          status: s.userStatus,
        };
      });

    return successResponse(upcomingEvents, 'Upcoming renewal events retrieved');
  } catch (error) {
    console.error('Get Calendar Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to retrieve upcoming renewals', 500);
  }
}
