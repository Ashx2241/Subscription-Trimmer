import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'user@example.com' },
      include: {
        profile: true,
        billingSubscriptions: { include: { plan: true } },
      },
    });

    if (!user) {
      return errorResponse('USER_NOT_FOUND', 'User session not found', 44);
    }

    const { passwordHash: _, ...safeUser } = user;
    return successResponse(safeUser, 'User context retrieved');
  } catch (error) {
    console.error('Auth ME Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to fetch user session', 500);
  }
}
