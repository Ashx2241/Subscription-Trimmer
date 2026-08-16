import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { getSessionContext } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);
    const budgets = await prisma.budget.findMany({ where: { userId: session.userId }, orderBy: { category: 'asc' } });
    return successResponse(budgets, 'Budgets retrieved');
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to list budgets', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);

    const body = await request.json();
    const { category, amount, period } = body;

    if (!category || !amount) {
      return errorResponse('VALIDATION_ERROR', 'Category and amount are required', 400);
    }

    const budget = await prisma.budget.create({
      data: { userId: session.userId, category, amount: Number(amount), period: period || 'MONTHLY' },
    });

    return successResponse(budget, 'Budget created', 201);
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to create budget', 500);
  }
}