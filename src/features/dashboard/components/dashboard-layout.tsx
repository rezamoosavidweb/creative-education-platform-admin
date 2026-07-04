import { memo } from 'react'
import { Download, Percent, Plus, TrendingUp, Users, Zap } from 'lucide-react'
import { getAuthUserGreetingName, useCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { useDashboardData } from '../hooks/use-dashboard-data'
import type { SparklineData } from '../types/dashboard'
import { MetricCard } from './cards'
import { ActivityChart, RevenueChart } from './charts'
import { RecentActivityFeed } from './widgets/recent-activity-feed'
import { SystemHealthCard } from './widgets/system-health-card'

const TODAY = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(new Date())

// Mock sparkline series for the KPI cards.
function generateSparklineData(): SparklineData[] {
  return Array.from({ length: 12 }, () => ({
    value: Math.floor(Math.random() * 80) + 20,
  }))
}

export const DashboardLayout = memo(function DashboardLayout() {
  const {
    stats,
    revenueData,
    activityData,
    recentActivities,
    isLoading,
    error,
  } = useDashboardData()
  const user = useCurrentUser()
  const greetingName = getAuthUserGreetingName(user)

  const revenueSparkline = generateSparklineData()
  const usersSparkline = generateSparklineData()
  const conversionSparkline = generateSparklineData()
  const apiSparkline = generateSparklineData()

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Good morning, {greetingName}
          </h1>
          <p className='mt-1 text-[var(--t2)]'>
            {TODAY} - Here&apos;s what&apos;s happening in your workspace.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline'>
            <Download className='h-4 w-4' />
            Export
          </Button>
          <Button>
            <Plus className='h-4 w-4' />
            New Project
          </Button>
        </div>
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
            iconColor='var(--pri)'
            iconBg='var(--pris)'
            isLoading={isLoading}
            sparklineData={revenueSparkline}
            sparklineColor='var(--pri)'
          />
          <MetricCard
            title='Active Users'
            value={stats.activeUsers.toLocaleString()}
            trend={stats.users_trend}
            icon={<Users className='h-4 w-4' />}
            iconColor='var(--info)'
            iconBg='var(--infos)'
            isLoading={isLoading}
            sparklineData={usersSparkline}
            sparklineColor='var(--info)'
          />
          <MetricCard
            title='Conversion Rate'
            value={`${stats.conversion.toFixed(2)}%`}
            trend={stats.conversion_trend}
            icon={<Percent className='h-4 w-4' />}
            iconColor='var(--warn)'
            iconBg='var(--warns)'
            isLoading={isLoading}
            sparklineData={conversionSparkline}
            sparklineColor='var(--warn)'
          />
          <MetricCard
            title='API Requests'
            value={`${(stats.growth / 1_000_000).toFixed(2)}M`}
            trend={stats.growth_trend}
            icon={<Zap className='h-4 w-4' />}
            iconColor='var(--ok)'
            iconBg='var(--oks)'
            isLoading={isLoading}
            sparklineData={apiSparkline}
            sparklineColor='var(--ok)'
          />
        </div>
      )}

      {/* Charts Section */}
      <div className='grid gap-6 lg:grid-cols-[1.6fr_1fr]'>
        <RevenueChart data={revenueData} isLoading={isLoading} error={error} />
        <ActivityChart
          data={activityData}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Recent Activity + System Health */}
      <div className='grid gap-6 lg:grid-cols-[1.6fr_1fr]'>
        <RecentActivityFeed data={recentActivities} isLoading={isLoading} />
        <SystemHealthCard />
      </div>
    </div>
  )
})
DashboardLayout.displayName = 'DashboardLayout'
