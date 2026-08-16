import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { getSessionContext } from '@/lib/auth';
import { createWebhookEndpoint, listWebhooks } from '@/services/webhooks/webhookService';

export async function GET() {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);
    const webhooks = await listWebhooks(session.userId);
    return successResponse(webhooks, 'Webhooks retrieved');
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to list webhooks', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);

    const body = await request.json();
    const { url, events } = body;

    if (!url || typeof url !== 'string') {
      return errorResponse('VALIDATION_ERROR', 'URL is required', 400);
    }

    const validEvents = ['subscription.created', 'subscription.cancelled', 'subscription.updated', 'payment.succeeded', 'payment.failed'];
    const selectedEvents = Array.isArray(events) && events.length > 0
      ? events.filter((e: string) => validEvents.includes(e))
      : ['subscription.created'];

    if (selectedEvents.length === 0) {
      return errorResponse('VALIDATION_ERROR', 'Invalid events provided', 400);
    }

    const webhook = await createWebhookEndpoint(session.userId, url, selectedEvents);
    return successResponse(webhook, 'Webhook created', 201);
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to create webhook', 500);
  }
}