import type { ApiResponseBody, ApiResult } from '@/lib/api'
import type { PillTone } from '@/components/status-pill'

export type Notification = ApiResponseBody<'/notifications/mine', 'get'>[number]

export function getNotifications(
  result: ApiResult<Notification[]> | undefined
): Notification[] {
  return result?.data ?? []
}

export function formatNotificationDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function getNotificationStatusTone(
  status: Notification['status']
): PillTone {
  switch (status) {
    case 'SENT':
      return 'ok'
    case 'FAILED':
    case 'DEAD_LETTER':
      return 'err'
    case 'PROCESSING':
    case 'QUEUED':
      return 'warn'
    case 'CANCELLED':
    default:
      return 'neutral'
  }
}

export function getDeliverySummary(notification: Notification): string {
  const deliveries = Array.isArray(notification.deliveries)
    ? notification.deliveries
    : notification.deliveries
      ? [notification.deliveries]
      : []

  if (deliveries.length === 0) return 'No deliveries'

  return deliveries
    .map((delivery) => `${delivery.channel}: ${delivery.status}`)
    .join(', ')
}
