import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { getSessionContext } from '@/lib/auth';
import { listNotifications, markAllNotificationsRead, getUnreadCount } from '@/services/notifications/notificationService';

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);

    const unreadOnly = request.nextUrl.searchParams.get('unread') === 'true';
    const notifications = await listNotifications(session.userId, unreadOnly);
    const unreadCount = await getUnreadCount(session.userId);

    return successResponse({ notifications, unreadCount }, 'Notifications retrieved');
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to list notifications', 500);
  }
}

export async function PATCH() {
  try {
    const session = await getSessionContext();
    if (!session) return errorResponse('UNAUTHORIZED', 'Not authenticated', 401);

    await markAllNotificationsRead(session.userId);
    return successResponse({ success: true }, 'All notifications marked as read');
  } catch {
    return errorResponse('INTERNAL_ERROR', 'Failed to mark notifications as read', 500);
  }
}