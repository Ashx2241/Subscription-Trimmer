import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { getSessionContext } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);
    const goals = await prisma.savingsGoal.findMany({ where: { userId: session.userId }, orderBy: { createdAt: 'desc' } });
    return successResponse(goals, 'Savings goals retrieved');
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to list goals', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);

    const body = await request.json();
    const { name, targetAmount, deadline } = body;

    if (!name || !targetAmount) {
      return errorResponse('VALIDATION_ERROR', 'Name and target amount are required', 400);
    }

    const goal = await prisma.savingsGoal.create({
      data: {
        userId: session.userId,
        name,
        targetAmount: Number(targetAmount),
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return successResponse(goal, 'Savings goal created', 201);
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to create goal', 500);
  }
}