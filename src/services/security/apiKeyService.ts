import { createHash, randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';

const KEY_PREFIX = 'st_live_';
const KEY_LENGTH = 32; // 32 random bytes -> 64 hex chars

export interface CreateApiKeyInput {
  userId: string;
  name: string;
  scopes: string[];
  expiresAt?: Date;
  rateLimit?: number;
}

export interface ApiKeyResult {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  status: string;
  createdAt: Date;
  expiresAt: Date | null;
  rateLimit: number;
  // The full key is only returned ONCE at creation
  fullKey: string;
}

// Generate a cryptographically secure API key
export function generateApiKey(): { prefix: string; fullKey: string; hash: string } {
  const randomPart = randomBytes(KEY_LENGTH).toString('hex');
  const fullKey = `${KEY_PREFIX}${randomPart}`;
  const prefix = fullKey.slice(0, 20); // e.g. "st_live_abc123def456"
  const hash = hashApiKey(fullKey);
  return { prefix, fullKey, hash };
}

// SHA-256 hash of the API key (never store plaintext)
export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

// Create a new API key
export async function createApiKey(input: CreateApiKeyInput): Promise<ApiKeyResult> {
  const { prefix, fullKey, hash } = generateApiKey();

  const apiKey = await prisma.apiKey.create({
    data: {
      userId: input.userId,
      name: input.name,
      keyPrefix: prefix,
      keyHash: hash,
      scopes: input.scopes.join(','),
      expiresAt: input.expiresAt,
      rateLimit: input.rateLimit ?? 100,
    },
  });

  // Log creation
  await prisma.auditLog.create({
    data: {
      actorId: input.userId,
      action: 'API_KEY_CREATED',
      resource: `ApiKey:${apiKey.id}`,
      metadataJson: JSON.stringify({ name: input.name, scopes: input.scopes }),
    },
  });

  return {
    id: apiKey.id,
    name: apiKey.name,
    keyPrefix: apiKey.keyPrefix,
    scopes: apiKey.scopes.split(','),
    status: apiKey.status,
    createdAt: apiKey.createdAt,
    expiresAt: apiKey.expiresAt,
    rateLimit: apiKey.rateLimit,
    fullKey, // Only shown once!
  };
}

// Validate an API key from the Authorization header
export async function validateApiKey(authHeader: string | null): Promise<{
  valid: boolean;
  apiKey?: unknown;
  user?: unknown;
  error?: string;
}> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid Authorization header' };
  }

  const key = authHeader.replace('Bearer ', '').trim();
  const hash = hashApiKey(key);

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash: hash },
    include: { user: true },
  });

  if (!apiKey) {
    return { valid: false, error: 'Invalid API key' };
  }

  if (apiKey.status !== 'ACTIVE') {
    return { valid: false, error: `API key is ${apiKey.status.toLowerCase()}` };
  }

  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { status: 'EXPIRED' },
    });
    return { valid: false, error: 'API key has expired' };
  }

  // Update last used
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });

  return { valid: true, apiKey, user: apiKey.user };
}

// Log API key usage
export async function logApiKeyUsage(
  apiKeyId: string,
  endpoint: string,
  method: string,
  status: number,
  ipAddress?: string,
  userAgent?: string
) {
  await prisma.apiKeyUsageLog.create({
    data: {
      apiKeyId,
      endpoint,
      method,
      status,
      ipAddress,
      userAgent,
    },
  });
}

// Revoke an API key
export async function revokeApiKey(apiKeyId: string, userId: string) {
  const apiKey = await prisma.apiKey.findFirst({
    where: { id: apiKeyId, userId },
  });

  if (!apiKey) {
    throw new Error('API key not found');
  }

  const updated = await prisma.apiKey.update({
    where: { id: apiKeyId },
    data: {
      status: 'REVOKED',
      revokedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: 'API_KEY_REVOKED',
      resource: `ApiKey:${apiKeyId}`,
      metadataJson: JSON.stringify({ name: apiKey.name }),
    },
  });

  return updated;
}

// List all API keys for a user (without hashes)
export async function listApiKeys(userId: string) {
  const keys = await prisma.apiKey.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      scopes: true,
      status: true,
      lastUsedAt: true,
      expiresAt: true,
      rateLimit: true,
      createdAt: true,
      revokedAt: true,
      _count: {
        select: { usageLogs: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return keys.map((k) => ({
    ...k,
    scopes: k.scopes.split(','),
  }));
}

// Get usage stats for an API key
export async function getApiKeyUsage(apiKeyId: string, userId: string) {
  const apiKey = await prisma.apiKey.findFirst({
    where: { id: apiKeyId, userId },
  });

  if (!apiKey) {
    throw new Error('API key not found');
  }

  const last24h = await prisma.apiKeyUsageLog.count({
    where: {
      apiKeyId,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  const last7d = await prisma.apiKeyUsageLog.count({
    where: {
      apiKeyId,
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
  });

  const recentLogs = await prisma.apiKeyUsageLog.findMany({
    where: { apiKeyId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return { last24h, last7d, recentLogs };
}