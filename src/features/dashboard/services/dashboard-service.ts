import { outboxAdminControllerStats } from '@/lib/api/generated/endpoints/admin/admin'
import { healthCheckerControllerCheck } from '@/lib/api/generated/endpoints/health/health'
import type {
  HealthCheckerControllerCheck200,
  OutboxStatsDto,
} from '@/lib/api/generated/model'
import type { DashboardMetric, HealthMetric } from '../types/dashboard'

export const OUTBOX_MANAGE_CAPABILITY = 'platform.outbox.manage'

export async function getDashboardHealth() {
  return await healthCheckerControllerCheck()
}

export async function getDashboardOutboxStats() {
  return await outboxAdminControllerStats()
}

export function getHealthIndicator(
  health: HealthCheckerControllerCheck200 | null | undefined,
  indicator: string
) {
  return health?.details?.[indicator] ?? health?.info?.[indicator] ?? null
}

export function getOutboxBacklogFromHealth(
  health: HealthCheckerControllerCheck200 | null | undefined
) {
  const outbox = getHealthIndicator(health, 'outbox')
  const pending = Number(outbox?.pending)
  const failed = Number(outbox?.failed)

  return {
    pending: Number.isFinite(pending) ? pending : null,
    failed: Number.isFinite(failed) ? failed : null,
  }
}

export function mapHealthMetrics(
  health: HealthCheckerControllerCheck200 | null | undefined
): HealthMetric[] {
  if (!health?.details) return []

  return Object.entries(health.details).map(([id, indicator]) => ({
    id,
    label: toTitleLabel(id),
    status: String(indicator.status ?? 'unknown'),
    details: Object.entries(indicator)
      .filter(([key]) => key !== 'status')
      .map(([key, value]) => `${toTitleLabel(key)}: ${String(value)}`)
      .join(' · '),
  }))
}

export function mapDashboardMetrics({
  health,
  outboxStats,
  canReadOutbox,
}: {
  health: HealthCheckerControllerCheck200 | null | undefined
  outboxStats: OutboxStatsDto | null | undefined
  canReadOutbox: boolean
}): DashboardMetric[] {
  const healthOutbox = getOutboxBacklogFromHealth(health)
  const pending = outboxStats?.pending ?? healthOutbox.pending
  const failed = outboxStats?.failed ?? healthOutbox.failed

  return [
    {
      id: 'system-status',
      title: 'System Status',
      value: toTitleLabel(health?.status ?? 'unknown'),
      description: 'Reported by /health',
      tone: health?.status === 'ok' ? 'success' : 'warning',
    },
    {
      id: 'pending-events',
      title: 'Pending Events',
      value: formatNullableNumber(pending),
      description: 'Outbox backlog',
      tone: pending && pending > 0 ? 'warning' : 'success',
    },
    {
      id: 'failed-events',
      title: 'Failed Events',
      value: formatNullableNumber(failed),
      description: 'Needs operator review when above zero',
      tone: failed && failed > 0 ? 'danger' : 'success',
    },
    {
      id: 'processed-events',
      title: 'Processed Events',
      value: canReadOutbox
        ? formatNullableNumber(outboxStats?.processed ?? null)
        : 'Restricted',
      description: canReadOutbox
        ? 'Admin outbox stats'
        : 'Requires platform.outbox.manage',
      tone: 'neutral',
    },
  ]
}

function formatNullableNumber(value: number | null | undefined) {
  return typeof value === 'number' ? value.toLocaleString() : 'Unavailable'
}

function toTitleLabel(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
