import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { logAuditEvent } from '@/services/security/auditLogger';
import { MockBankProvider } from '@/services/banking/MockBankProvider';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: connectionId } = await params;
    const user = await prisma.user.findFirst({ where: { email: 'user@example.com' } });
    if (!user) return errorResponse('UNAUTHORIZED', 'User not authenticated', 401);

    const connection = await prisma.bankConnection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      return errorResponse('NOT_FOUND', 'Bank connection not found', 404);
    }

    const provider = new MockBankProvider();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // 1 month delta sync

    const newTxList = await provider.syncTransactions(connectionId, startDate);

    // Update last sync time
    await prisma.bankConnection.update({
      where: { id: connectionId },
      data: { lastSyncAt: new Date() },
    });

    await logAuditEvent({
      actorId: user.id,
      action: 'BANK_SYNC_TRIGGERED',
      resource: `/api/banks/${connectionId}/sync`,
      metadata: { syncedTransactionsCount: newTxList.length },
    });

    return successResponse(
      { connectionId, syncedCount: newTxList.length, lastSyncAt: new Date() },
      'Bank synchronization completed successfully'
    );
  } catch (error) {
    console.error('Bank Sync Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to synchronize bank transactions', 500);
  }
}
