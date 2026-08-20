import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { requireAuth } from '@/lib/auth';
import { logAuditEvent } from '@/services/security/auditLogger';

export async function GET() {
  try {
    const session = await requireAuth();

    const connections = await prisma.bankConnection.findMany({
      where: { userId: session.userId },
      include: {
        accounts: {
          include: {
            _count: { select: { transactions: true } },
          },
        },
      },
    });

    return successResponse(connections, 'Bank connections retrieved');
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      const authError = error as { code: string; message: string; status: number };
      return errorResponse(authError.code, authError.message, authError.status);
    }
    console.error('Get Banks Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to retrieve bank connections', 500);
  }
}

export async function POST() {
  try {
    const session = await requireAuth();

    // Create a new demo bank connection for the authenticated user
    const newConn = await prisma.bankConnection.create({
      data: {
        userId: session.userId,
        provider: 'MOCK',
        providerConnectionId: `mock-conn-${Date.now()}`,
        accessTokenEncrypted: 'mock_token_secret',
        status: 'CONNECTED',
        institutionName: 'Checking Account',
        lastSyncAt: new Date(),
        accounts: {
          create: [
            {
              name: 'Primary Checking',
              maskedAccountNumber: '5512',
              type: 'CHECKING',
              balanceCurrent: 0.0,
            },
          ],
        },
      },
      include: { accounts: true },
    });

    await logAuditEvent({
      actorId: session.userId,
      action: 'BANK_CONNECTION_ADDED',
      resource: `/api/banks/${newConn.id}`,
      metadata: { provider: 'MOCK', institution: newConn.institutionName },
    });

    return successResponse(newConn, 'Bank connection added successfully', 201);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error) {
      const authError = error as { code: string; message: string; status: number };
      return errorResponse(authError.code, authError.message, authError.status);
    }
    console.error('Add Bank Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to connect bank account', 500);
  }
}
