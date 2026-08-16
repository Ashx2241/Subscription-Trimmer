import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { getSessionContext } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);

    // Find all bank connections belonging to the user
    const userConnections = await prisma.bankConnection.findMany({
      where: { userId: session.userId },
      select: { accounts: { select: { id: true } } },
    });

    const accountIds = userConnections.flatMap((c) => c.accounts.map((a) => a.id));

    const transactions = await prisma.transaction.findMany({
      where: { accountId: { in: accountIds } },
      orderBy: { date: 'desc' },
      take: 150,
      include: {
        bankAccount: {
          select: { name: true, maskedAccountNumber: true, type: true },
        },
        merchant: {
          select: { normalizedName: true, category: true },
        },
      },
    });

    const formattedTransactions = transactions.map((t) => ({
      id: t.id,
      date: t.date.toISOString().split('T')[0],
      merchantName: t.rawDescription,
      normalizedMerchantName: t.merchant?.normalizedName || t.cleanDescription || t.rawDescription,
      amount: t.amount,
      category: t.category || t.merchant?.category || 'General',
      isSubscription: Boolean(t.merchantId),
      accountName: t.bankAccount.name,
      accountNumber: t.bankAccount.maskedAccountNumber,
    }));

    return successResponse({ transactions: formattedTransactions }, 'Transactions retrieved');
  } catch (error) {
    console.error('Fetch Transactions Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to retrieve transactions', 500);
  }
}
