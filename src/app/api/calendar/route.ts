import { prisma } from '@/lib/prisma';
import { successResponse } from '@/lib/apiResponse';
import { FALLBACK_SUBSCRIPTIONS } from '@/lib/demoFallback';

export async function GET() {
  try {
    const user = await prisma.user.findFirst({ where: { email: 'user@example.com' } });

    if (user) {
      const subscriptions = await prisma.subscription.findMany({
        where: {
          userId: user.id,
          status: 'ACTIVE',
        },
        include: { merchant: true },
        orderBy: { nextBillingDate: 'asc' },
      });

      if (subscriptions.length > 0) {
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
      }
    }

    const fallbackEvents = FALLBACK_SUBSCRIPTIONS.map((s) => ({
      id: s.id,
      merchantName: s.merchant.normalizedName,
      category: s.merchant.category,
      amount: s.amount,
      currency: s.currency,
      frequency: s.frequency,
      nextBillingDate: s.nextBillingDate,
      userStatus: s.userStatus,
    }));

    return successResponse(fallbackEvents, 'Upcoming renewal events retrieved (Demo Serverless Mode)');
  } catch (error) {
    console.error('Get Calendar Error:', error);
    const fallbackEvents = FALLBACK_SUBSCRIPTIONS.map((s) => ({
      id: s.id,
      merchantName: s.merchant.normalizedName,
      category: s.merchant.category,
      amount: s.amount,
      currency: s.currency,
      frequency: s.frequency,
      nextBillingDate: s.nextBillingDate,
      userStatus: s.userStatus,
    }));
    return successResponse(fallbackEvents, 'Upcoming renewal events retrieved (Demo Serverless Mode)');
  }
}
