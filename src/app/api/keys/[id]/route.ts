import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { getSessionContext } from '@/lib/auth';
import { revokeApiKey, getApiKeyUsage } from '@/services/security/apiKeyService';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);
    const { id } = await params;
    const usage = await getApiKeyUsage(id, session.userId);
    return successResponse(usage, 'API key usage retrieved');
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'API key not found') return errorResponse('NOT_FOUND', 'API key not found', 404);
    return errorResponse('INTERNAL_ERROR', 'Failed to get API key usage', 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);
    const { id } = await params;
    const revoked = await revokeApiKey(id, session.userId);
    return successResponse({ id: revoked.id, status: revoked.status }, 'API key revoked');
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'API key not found') return errorResponse('NOT_FOUND', 'API key not found', 404);
    return errorResponse('INTERNAL_ERROR', 'Failed to revoke API key', 500);
  }
}