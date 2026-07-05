import { describe, expect, it } from 'vitest'
import {
  filterTemplates,
  formatQuietHour,
  getDeliverySummary,
  getNotificationStatusTone,
  getNotifications,
  parseOptionalMinute,
  parseVariablesJson,
  type NotificationTemplate,
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

  it('formats and validates quiet-hour minute values', () => {
    expect(formatQuietHour(null)).toBe('')
    expect(formatQuietHour(75)).toBe('01:15')
    expect(parseOptionalMinute('')).toBeNull()
    expect(parseOptionalMinute('1439')).toBe(1439)
    expect(() => parseOptionalMinute('1440')).toThrow(
      'Enter a minute value from 0 to 1439.'
    )
  })

  it('parses dispatch variables as JSON objects', () => {
    expect(parseVariablesJson('')).toBeUndefined()
    expect(parseVariablesJson('{"name":"Ada"}')).toEqual({ name: 'Ada' })
    expect(() => parseVariablesJson('[]')).toThrow(
      'Variables must be a JSON object.'
    )
  })

  it('filters templates by key, channel, language, subject, or body', () => {
    const templates: NotificationTemplate[] = [
      {
        body: 'Hello {{name}}',
        channel: 'EMAIL',
        id: 'template-1',
        isActive: true,
        key: 'welcome.email',
        language: 'en_US',
        subject: 'Welcome',
      },
      {
        body: 'Privet',
        channel: 'SMS',
        id: 'template-2',
        isActive: false,
        key: 'digest.sms',
        language: 'ru_RU',
        subject: null,
      },
    ]

    expect(filterTemplates(templates, 'welcome')).toEqual([templates[0]])
    expect(filterTemplates(templates, 'ru_ru')).toEqual([templates[1]])
    expect(filterTemplates(templates, 'missing')).toEqual([])
  })
})
