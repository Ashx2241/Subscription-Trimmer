import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        profile: true,
        billingSubscriptions: { include: { plan: true } },
      },
    });

    if (!user) {
      return errorResponse('USER_NOT_FOUND', 'User session not found', 404);
    }

    const { passwordHash: _, ...safeUser } = user;
    return successResponse(safeUser, 'User context retrieved');
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      const authError = error as { code: string; message: string; status: number };
      return errorResponse(authError.code, authError.message, authError.status);
    }
    console.error('Auth ME Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to fetch user session', 500);
  }
}

