import { useQuery } from '@tanstack/react-query'
import { useCapability } from '@/lib/capabilities'
import {
  getDashboardHealth,
  getDashboardOutboxStats,
  mapDashboardMetrics,
  mapHealthMetrics,
  OUTBOX_MANAGE_CAPABILITY,
} from '../services/dashboard-service'

export function useDashboardData() {
  const canReadOutbox = useCapability(OUTBOX_MANAGE_CAPABILITY)
  const healthQuery = useQuery({
    queryKey: ['dashboard', 'health'],
    queryFn: getDashboardHealth,
    staleTime: 30 * 1000,
  })
  const outboxQuery = useQuery({
    queryKey: ['dashboard', 'outbox-stats'],
    queryFn: getDashboardOutboxStats,
    enabled: canReadOutbox,
    staleTime: 30 * 1000,
  })

  const metrics = mapDashboardMetrics({
    health: healthQuery.data,
    outboxStats: outboxQuery.data,
    canReadOutbox,
  })
  const healthMetrics = mapHealthMetrics(healthQuery.data)
  const isLoading =
    healthQuery.isLoading || (canReadOutbox && outboxQuery.isLoading)
  const isFetching =
    healthQuery.isFetching || (canReadOutbox && outboxQuery.isFetching)
  const healthError =
    healthQuery.error instanceof Error ? healthQuery.error.message : null
  const outboxError =
    canReadOutbox && outboxQuery.error instanceof Error
      ? outboxQuery.error.message
      : null

  return {
    canReadOutbox,
    error: healthError ?? outboxError,
    healthMetrics,
    healthError,
    isFetching,
    isLoading,
    metrics,
    outboxError,
    outboxStats: outboxQuery.data ?? null,
    refresh: async () => {
      await Promise.all([
        healthQuery.refetch(),
        canReadOutbox ? outboxQuery.refetch() : Promise.resolve(),
      ])
    },
  }
}
