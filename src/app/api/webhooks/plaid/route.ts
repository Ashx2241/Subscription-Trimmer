import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { logAuditEvent } from '@/services/security/auditLogger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { webhook_type, webhook_code, item_id } = body;

    console.log(`[Plaid Webhook Received] Type: ${webhook_type}, Code: ${webhook_code}, Item: ${item_id}`);

    if (webhook_type === 'TRANSACTIONS' && (webhook_code === 'DEFAULT_UPDATE' || webhook_code === 'SYNC_UPDATES_AVAILABLE')) {
      await logAuditEvent({
        action: 'PLAID_WEBHOOK_TRANSACTIONS_SYNC',
        resource: `/api/webhooks/plaid`,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        metadata: { item_id, webhook_code },
      });
    }

    return successResponse({ received: true }, 'Plaid webhook processed successfully');
  } catch (error) {
    console.error('Plaid Webhook Error:', error);
    return errorResponse('SERVER_ERROR', 'Failed to process Plaid webhook', 500);
  }
}
