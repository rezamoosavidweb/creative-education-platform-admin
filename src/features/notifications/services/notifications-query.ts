import type { ApiResponseBody, ApiResult } from '@/lib/api'
import type {
  NotificationCategory,
  NotificationChannel,
  PreferenceDto,
  SendNotificationDtoVariables,
  TemplateDto,
} from '@/lib/api/generated/model'
import type { AuthCapability } from '@/lib/auth'
import type { PillTone } from '@/components/status-pill'

export type Notification = ApiResponseBody<'/notifications/mine', 'get'>[number]
export type NotificationTemplate = TemplateDto
export type NotificationPreferences = PreferenceDto

export const NOTIFICATION_TEMPLATE_MANAGE_CAPABILITY =
  'notifications.template.manage' satisfies AuthCapability
export const NOTIFICATION_SEND_CAPABILITY =
  'notifications.send' satisfies AuthCapability
export const NOTIFICATION_DELIVERY_MANAGE_CAPABILITY =
  'notifications.delivery.manage' satisfies AuthCapability

export const NOTIFICATION_CHANNELS = [
  'EMAIL',
  'SMS',
  'PUSH',
  'TELEGRAM',
  'BALE',
  'EITAA',
  'WHATSAPP',
] as const satisfies readonly NotificationChannel[]

export const NOTIFICATION_CATEGORIES = [
  'SYSTEM',
  'TRANSACTIONAL',
  'MARKETING',
] as const satisfies readonly NotificationCategory[]

export const NOTIFICATION_LANGUAGES = ['en_US', 'ru_RU'] as const

export function getNotifications(
  result: ApiResult<Notification[]> | undefined
): Notification[] {
  return result?.data ?? []
}

export function getTemplates(
  templates: NotificationTemplate[] | undefined
): NotificationTemplate[] {
  return templates ?? []
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

export function formatQuietHour(value: number | null | undefined): string {
  if (value === null || value === undefined) return ''

  const hours = Math.floor(value / 60)
  const minutes = value % 60
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`
}

export function parseOptionalMinute(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const parsed = Number(trimmed)
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 1439) {
    throw new Error('Enter a minute value from 0 to 1439.')
  }

  return parsed
}

export function parseVariablesJson(
  value: string
): SendNotificationDtoVariables | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined

  const parsed: unknown = JSON.parse(trimmed)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Variables must be a JSON object.')
  }

  return parsed as SendNotificationDtoVariables
}

export function filterTemplates(
  templates: NotificationTemplate[],
  search: string
): NotificationTemplate[] {
  const normalized = search.trim().toLowerCase()
  if (!normalized) return templates

  return templates.filter((template) =>
    [
      template.key,
      template.channel,
      template.language,
      template.subject ?? '',
      template.body,
    ].some((value) => value.toLowerCase().includes(normalized))
  )
}
