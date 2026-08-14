import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const user = await prisma.user.findFirst({ where: { email: 'user@example.com' } });
    if (!user) return errorResponse('UNAUTHORIZED', 'User not authenticated', 401);

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: user.id,
        status: 'ACTIVE',
      },
      include: { merchant: true },
      orderBy: { nextBillingDate: 'asc' },
    });

    const upcomingEvents = subscriptions
      .filter((s) => s.nextBillingDate)
      .map((s) => ({
        id: s.id,
        merchantName: s.merchant.normalizedName,
        category: s.merchant.category,
        amount: s.amount,
        currency: s.currency,
        frequency: s.frequency,
        nextBillingDate: s.nextBillingDate,
        userStatus: s.userStatus,
      }));

    return successResponse(upcomingEvents, 'Upcoming renewal events retrieved');
  } catch (error) {
    console.error('Get Calendar Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to retrieve upcoming calendar events', 500);
  }
}
