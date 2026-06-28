import { memo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { TrendingUp, Users, Percent, Zap } from 'lucide-react'
import { MetricCard } from './cards'
import { RevenueChart, ActivityChart } from './charts'
import { TopProductsTable, RecentActivitiesTable } from './tables'
import { DashboardFilters } from './filters/dashboard-filters'
import { useDashboardData } from '../hooks/use-dashboard-data'
import type { DashboardFilter, SparklineData } from '../types/dashboard'
import { DEFAULT_FILTERS } from '../constants/dashboard-config'

type DashboardLayoutProps = {
  title?: string
  subtitle?: string
}

// Generate sparkline data - mock data that varies
function generateSparklineData(): SparklineData[] {
  return Array.from({ length: 12 }, () => ({
    value: Math.floor(Math.random() * 80) + 20,
  }))
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

  // Generate sparkline data for each metric
  const revenueSparkline = generateSparklineData()
  const usersSparkline = generateSparklineData()
  const conversionSparkline = generateSparklineData()
  const apiSparkline = generateSparklineData()

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
          <p className='mt-2 text-[var(--t2)]'>{subtitle}</p>
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
        <div className='rounded-lg border border-[var(--err)]/50 bg-[var(--errs)] p-4 text-sm text-[var(--err)]'>
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
            icon={<TrendingUp className='h-4 w-4' />}
            isLoading={isLoading}
            sparklineData={revenueSparkline}
            sparklineColor='var(--pri)'
          />
          <MetricCard
            title='Active Users'
            value={stats.activeUsers.toLocaleString()}
            trend={stats.users_trend}
            icon={<Users className='h-4 w-4' />}
            isLoading={isLoading}
            sparklineData={usersSparkline}
            sparklineColor='var(--info)'
          />
          <MetricCard
            title='Conversion Rate'
            value={`${stats.conversion.toFixed(2)}%`}
            trend={stats.conversion_trend}
            icon={<Percent className='h-4 w-4' />}
            isLoading={isLoading}
            sparklineData={conversionSparkline}
            sparklineColor='var(--warn)'
          />
          <MetricCard
            title='API Requests'
            value={`${(stats.growth / 100).toFixed(2)}M`}
            trend={stats.growth_trend}
            icon={<Zap className='h-4 w-4' />}
            isLoading={isLoading}
            sparklineData={apiSparkline}
            sparklineColor='var(--ok)'
          />
        </div>
      )}

      {/* Charts Section */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <RevenueChart data={revenueData} isLoading={isLoading} error={error} />
        <ActivityChart data={activityData} isLoading={isLoading} error={error} />
      </div>

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
