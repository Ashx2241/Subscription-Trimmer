import { createHmac, randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';

export function generateWebhookSecret(): string {
  return randomBytes(32).toString('hex');
}

export function signWebhookPayload(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifyWebhookSignature(secret: string, payload: string, signature: string): boolean {
  return signWebhookPayload(secret, payload) === signature;
}

export async function createWebhookEndpoint(userId: string, url: string, events: string[]) {
  const secret = generateWebhookSecret();
  const webhook = await prisma.webhookEndpoint.create({
    data: { userId, url, secret, events: events.join(',') },
  });
  await prisma.auditLog.create({
    data: { actorId: userId, action: 'WEBHOOK_CREATED', resource: `Webhook:${webhook.id}`, metadataJson: JSON.stringify({ url, events }) },
  });
  return { ...webhook, events: webhook.events.split(',') };
}

export async function listWebhooks(userId: string) {
  const webhooks = await prisma.webhookEndpoint.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  return webhooks.map((w) => ({ ...w, events: w.events.split(',') }));
}

export async function deleteWebhook(webhookId: string, userId: string) {
  const webhook = await prisma.webhookEndpoint.findFirst({ where: { id: webhookId, userId } });
  if (!webhook) throw new Error('Webhook not found');
  await prisma.webhookEndpoint.delete({ where: { id: webhookId } });
  return webhook;
}

export async function dispatchWebhookEvent(event: string, payload: unknown) {
  const webhooks = await prisma.webhookEndpoint.findMany({ where: { isActive: true, events: { contains: event } } });
  for (const webhook of webhooks) {
    const payloadJson = JSON.stringify({ event, data: payload, timestamp: new Date().toISOString() });
    const signature = signWebhookPayload(webhook.secret, payloadJson);
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': signature, 'X-Webhook-Event': event },
        body: payloadJson,
      });
      await prisma.webhookDelivery.create({
        data: { webhookId: webhook.id, event, payloadJson, status: response.ok ? 'delivered' : 'failed', responseStatus: response.status, attempts: 1, deliveredAt: response.ok ? new Date() : null },
      });
    } catch {
      await prisma.webhookDelivery.create({
        data: { webhookId: webhook.id, event, payloadJson, status: 'failed', attempts: 1, nextRetryAt: new Date(Date.now() + 5 * 60 * 1000) },
      });
    }
  }
}