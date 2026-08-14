import { CancellationStatus } from '@prisma/client';

const ALLOWED_TRANSITIONS: Record<CancellationStatus, CancellationStatus[]> = {
  NOT_STARTED: ['GUIDED', 'MESSAGE_GENERATED', 'REQUESTED'],
  GUIDED: ['USER_SENT', 'CONFIRMED', 'FAILED', 'NEEDS_USER_ACTION'],
  MESSAGE_GENERATED: ['USER_SENT', 'REQUESTED', 'FAILED'],
  USER_SENT: ['PROCESSING', 'CONFIRMED', 'FAILED', 'NEEDS_USER_ACTION'],
  REQUESTED: ['PROCESSING', 'CONFIRMED', 'FAILED', 'NEEDS_USER_ACTION'],
  PROCESSING: ['CONFIRMED', 'FAILED', 'NEEDS_USER_ACTION'],
  NEEDS_USER_ACTION: ['USER_SENT', 'PROCESSING', 'FAILED'],
  CONFIRMED: [], // Terminal state
  FAILED: ['NOT_STARTED', 'REQUESTED'], // Re-try allowed
};

export function canTransitionStatus(
  currentStatus: CancellationStatus,
  newStatus: CancellationStatus
): boolean {
  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  return allowed.includes(newStatus);
}
