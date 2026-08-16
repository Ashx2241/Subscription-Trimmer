import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { getSessionContext } from '@/lib/auth';
import { createApiKey, listApiKeys } from '@/services/security/apiKeyService';

// GET /api/keys - List all API keys for the current user
export async function GET() {
  try {
    const session = await getSessionContext();
    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);
    }

    const keys = await listApiKeys(session.userId);
    return successResponse(keys, 'API keys retrieved');
  } catch (error) {
    console.error('List API Keys Error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to list API keys', 500);
  }
}

// POST /api/keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);
    }

    const body = await request.json();
    const { name, scopes, expiresInDays, rateLimit } = body;

    if (!name || typeof name !== 'string') {
      return errorResponse('VALIDATION_ERROR', 'Name is required', 400);
    }

    const validScopes = ['READ_ONLY', 'READ_WRITE', 'ADMIN'];
    const selectedScopes = Array.isArray(scopes) && scopes.length > 0
      ? scopes.filter((s: string) => validScopes.includes(s))
      : ['READ_ONLY'];

    if (selectedScopes.length === 0) {
      return errorResponse('VALIDATION_ERROR', 'Invalid scopes provided', 400);
    }

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : undefined;

    const apiKey = await createApiKey({
      userId: session.userId,
      name,
      scopes: selectedScopes,
      expiresAt,
      rateLimit: rateLimit || 100,
    });

    return successResponse(apiKey, 'API key created - store it securely, it will only be shown once', 201);
  } catch (error) {
    console.error('Create API Key Error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to create API key', 500);
  }
}