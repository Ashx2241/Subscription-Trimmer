import { prisma } from '@/lib/prisma';

export interface AuditLogOptions {
  actorId?: string;
  action: string;
  resource: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent({
  actorId,
  action,
  resource,
  ipAddress = '127.0.0.1',
  metadata,
}: AuditLogOptions) {
  try {
    return await prisma.auditLog.create({
      data: {
        actorId: actorId || null,
        action,
        resource,
        ipAddress,
        metadataJson: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error('Audit Log Error:', error);
    // Never fail primary transaction due to audit logging failure
    return null;
  }
}
