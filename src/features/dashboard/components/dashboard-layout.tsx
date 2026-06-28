import { memo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { MetricCard } from './cards'
import { RevenueChart, ActivityChart, GrowthChart } from './charts'
import { TopProductsTable, RecentActivitiesTable } from './tables'
import { DashboardFilters } from './filters/dashboard-filters'
import { useDashboardData } from '../hooks/use-dashboard-data'
import type { DashboardFilter } from '../types/dashboard'
import { DEFAULT_FILTERS } from '../constants/dashboard-config'

type DashboardLayoutProps = {
  title?: string
  subtitle?: string
}

export const DashboardLayout = memo(function DashboardLayout({
  title = 'Dashboard',
  subtitle = 'Welcome back! Here\'s your business overview.',
}: DashboardLayoutProps) {
  const [filters, setFilters] = useState<DashboardFilter>(DEFAULT_FILTERS)
  const { stats, revenueData, activityData, topProducts, recentActivities, isLoading, error } =
    useDashboardData({ filters })

  const handleFiltersChange = (newFilters: DashboardFilter) => {
    setFilters(newFilters)
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
          <p className='mt-2 text-muted-foreground'>{subtitle}</p>
        </div>
        <Button>Export Report</Button>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap gap-2'>
        <DashboardFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
        />
      </div>

      {/* Error State */}
      {error && !isLoading && (
        <div className='rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive'>
          Failed to load dashboard data. Please try refreshing the page.
        </div>
      )}

      {/* Metric Cards */}
      {stats && (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <MetricCard
            title='Total Revenue'
            value={`$${stats.totalRevenue.toLocaleString()}`}
            trend={stats.revenue_trend}
            isLoading={isLoading}
          />
          <MetricCard
            title='Active Users'
            value={stats.activeUsers.toLocaleString()}
            trend={stats.users_trend}
            isLoading={isLoading}
          />
          <MetricCard
            title='Conversion Rate'
            value={`${stats.conversion.toFixed(2)}%`}
            trend={stats.conversion_trend}
            isLoading={isLoading}
          />
          <MetricCard
            title='Growth Rate'
            value={`${stats.growth.toFixed(1)}%`}
            trend={stats.growth_trend}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Charts Section */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <RevenueChart data={revenueData} isLoading={isLoading} error={error} />
        <ActivityChart data={activityData} isLoading={isLoading} error={error} />
      </div>

      {/* Growth Chart */}
      <GrowthChart
        data={
          activityData.map((d) => ({
            name: d.name,
            value: Math.random() * 30,
          })) || []
        }
        isLoading={isLoading}
        error={error}
      />

      {/* Tables Section */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <TopProductsTable data={topProducts} isLoading={isLoading} error={error} />
        <div className='lg:col-span-2'>
          <RecentActivitiesTable data={recentActivities} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  )
})
DashboardLayout.displayName = 'DashboardLayout'
