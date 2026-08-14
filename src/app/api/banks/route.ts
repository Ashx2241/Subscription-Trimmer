import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { logAuditEvent } from '@/services/security/auditLogger';

export async function GET() {
  try {
    const user = await prisma.user.findFirst({ where: { email: 'user@example.com' } });
    if (!user) return errorResponse('UNAUTHORIZED', 'User not authenticated', 401);

    const connections = await prisma.bankConnection.findMany({
      where: { userId: user.id },
      include: {
        accounts: {
          include: {
            _count: { select: { transactions: true } },
          },
        },
      },
    });

    return successResponse(connections, 'Bank connections retrieved');
  } catch (error) {
    console.error('Get Banks Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to retrieve bank connections', 500);
  }
}

export async function POST() {
  try {
    const user = await prisma.user.findFirst({ where: { email: 'user@example.com' } });
    if (!user) return errorResponse('UNAUTHORIZED', 'User not authenticated', 401);

    // Create a new demo bank connection
    const newConn = await prisma.bankConnection.create({
      data: {
        userId: user.id,
        provider: 'MOCK',
        providerConnectionId: `mock-conn-${Date.now()}`,
        accessTokenEncrypted: 'mock_token_secret',
        status: 'CONNECTED',
        institutionName: 'Capital One (DEMO DATA)',
        lastSyncAt: new Date(),
        accounts: {
          create: [
            {
              name: '360 Checking (DEMO)',
              maskedAccountNumber: '5512',
              type: 'CHECKING',
              balanceCurrent: 3200.50,
            },
          ],
        },
      },
      include: { accounts: true },
    });

    await logAuditEvent({
      actorId: user.id,
      action: 'BANK_CONNECTION_ADDED',
      resource: `/api/banks/${newConn.id}`,
      metadata: { provider: 'MOCK', institution: newConn.institutionName },
    });

    return successResponse(newConn, 'Bank connection added successfully', 201);
  } catch (error) {
    console.error('Add Bank Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to connect bank account', 500);
  }
}
