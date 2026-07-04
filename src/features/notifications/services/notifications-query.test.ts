import { describe, expect, it } from 'vitest'
import {
  getDeliverySummary,
  getNotificationStatusTone,
  getNotifications,
  type Notification,
} from './notifications-query'

const notification: Notification = {
  category: 'SYSTEM',
  createdAt: '2026-01-01T00:00:00.000Z',
  deliveries: {
    channel: 'EMAIL',
    failureReason: null,
    sentAt: '2026-01-01T00:00:01.000Z',
    status: 'SENT',
  },
  id: 'notification-1',
  status: 'SENT',
  templateKey: 'system.notice',
  userId: 'user-1',
}

describe('notifications query helpers', () => {
  it('reads backend inbox arrays from API results', () => {
    expect(
      getNotifications({
        data: [notification],
        headers: {},
        nextCursor: null,
        status: 200,
      })
    ).toEqual([notification])
    expect(getNotifications(undefined)).toEqual([])
  })

  it('summarizes delivery channels and statuses', () => {
    expect(getDeliverySummary(notification)).toBe('EMAIL: SENT')
    expect(
      getDeliverySummary({
        ...notification,
        deliveries: [] as unknown as Notification['deliveries'],
      })
    ).toBe('No deliveries')
  })

  it('maps generated notification statuses to tones', () => {
    expect(getNotificationStatusTone('SENT')).toBe('ok')
    expect(getNotificationStatusTone('FAILED')).toBe('err')
    expect(getNotificationStatusTone('QUEUED')).toBe('warn')
  })
})
