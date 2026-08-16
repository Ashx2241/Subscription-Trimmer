import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { getSessionContext } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);
    const alerts = await prisma.priceAlert.findMany({
      where: { userId: session.userId },
      include: { merchant: true },
      orderBy: { createdAt: 'desc' },
    });
    return successResponse(alerts, 'Price alerts retrieved');
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to list alerts', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);

    const body = await request.json();
    const { merchantId, threshold, direction } = body;

    if (!merchantId || !threshold) {
      return errorResponse('VALIDATION_ERROR', 'Merchant and threshold are required', 400);
    }

    const alert = await prisma.priceAlert.create({
      data: {
        userId: session.userId,
        merchantId,
        threshold: Number(threshold),
        direction: direction || 'INCREASE',
      },
    });

    return successResponse(alert, 'Price alert created', 201);
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to create alert', 500);
  }
}