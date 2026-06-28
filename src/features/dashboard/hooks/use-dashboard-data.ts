import { useQueries } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboard-service'
import type { DashboardFilter } from '../types/dashboard'

type UseDashboardDataOptions = {
  filters?: DashboardFilter
  enabled?: boolean
}

export function useDashboardData({
  filters,
  enabled = true,
}: UseDashboardDataOptions = {}) {
  const results = useQueries({
    queries: [
      {
        queryKey: ['dashboard', 'stats', filters],
        queryFn: () => dashboardService.getStats(filters),
        staleTime: 5 * 60 * 1000,
        enabled,
      },
      {
        queryKey: ['dashboard', 'revenue', filters],
        queryFn: () => dashboardService.getRevenueData(filters),
        staleTime: 5 * 60 * 1000,
        enabled,
      },
      {
        queryKey: ['dashboard', 'activity', filters],
        queryFn: () => dashboardService.getActivityData(filters),
        staleTime: 5 * 60 * 1000,
        enabled,
      },
      {
        queryKey: ['dashboard', 'products', filters],
        queryFn: () => dashboardService.getTopProducts(filters),
        staleTime: 5 * 60 * 1000,
        enabled,
      },
      {
        queryKey: ['dashboard', 'activities', filters],
        queryFn: () => dashboardService.getRecentActivities(filters),
        staleTime: 5 * 60 * 1000,
        enabled,
      },
    ],
  })

  const [statsQuery, revenueQuery, activityQuery, productsQuery, activitiesQuery] =
    results

  const isLoading = results.some((q) => q.isLoading)
  const error = results.find((q) => q.error)?.error as Error | null

  return {
    stats: statsQuery.data ?? null,
    revenueData: revenueQuery.data ?? [],
    activityData: activityQuery.data ?? [],
    topProducts: productsQuery.data ?? [],
    recentActivities: activitiesQuery.data ?? [],
    isLoading,
    error: error?.message ?? null,
  }
}
