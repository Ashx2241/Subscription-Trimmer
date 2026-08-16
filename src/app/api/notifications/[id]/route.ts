import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { getSessionContext } from '@/lib/auth';
import { markNotificationRead } from '@/services/notifications/notificationService';

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);
    const { id } = await params;
    const notification = await markNotificationRead(id, session.userId);
    return successResponse(notification, 'Notification marked as read');
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Notification not found') return errorResponse('NOT_FOUND', 'Notification not found', 404);
    return errorResponse('INTERNAL_ERROR', 'Failed to mark notification as read', 500);
  }
}