import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { getSessionContext } from '@/lib/auth';
import { deleteWebhook } from '@/services/webhooks/webhookService';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);
    const { id } = await params;
    const webhook = await deleteWebhook(id, session.userId);
    return successResponse({ id: webhook.id }, 'Webhook deleted');
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Webhook not found') return errorResponse('NOT_FOUND', 'Webhook not found', 404);
    return errorResponse('INTERNAL_ERROR', 'Failed to delete webhook', 500);
  }
}