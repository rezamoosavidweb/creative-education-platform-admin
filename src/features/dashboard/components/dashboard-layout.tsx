import { memo, type ReactNode } from 'react'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Inbox,
  RefreshCw,
} from 'lucide-react'
import { getAuthUserGreetingName, useCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { useDashboardData } from '../hooks/use-dashboard-data'
import { MetricCard } from './cards'
import { OutboxStatusCard } from './widgets/outbox-status-card'
import { SystemHealthCard } from './widgets/system-health-card'

const TODAY = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(new Date())

const METRIC_ICONS: Record<string, ReactNode> = {
  'failed-events': <AlertTriangle className='h-4 w-4' />,
  'pending-events': <Inbox className='h-4 w-4' />,
  'processed-events': <Activity className='h-4 w-4' />,
  'system-status': <CheckCircle2 className='h-4 w-4' />,
}

export const DashboardLayout = memo(function DashboardLayout() {
  const {
    canReadOutbox,
    error,
    healthError,
    healthMetrics,
    isFetching,
    isLoading,
    metrics,
    outboxError,
    outboxStats,
    refresh,
  } = useDashboardData()
  const user = useCurrentUser()
  const greetingName = getAuthUserGreetingName(user)

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Good morning, {greetingName}
          </h1>
          <p className='mt-1 text-[var(--t2)]'>
            {TODAY} - Operational status from the backend.
          </p>
        </div>
        <Button variant='outline' onClick={() => void refresh()}>
          <RefreshCw
            className={isFetching ? 'h-4 w-4 animate-spin' : 'h-4 w-4'}
          />
          Refresh
        </Button>
      </div>

      {error && !isLoading && (
        <div className='rounded-lg border border-[var(--err)]/50 bg-[var(--errs)] p-4 text-sm text-[var(--err)]'>
          Failed to load dashboard data. {error}
        </div>
      )}

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            description={metric.description}
            icon={METRIC_ICONS[metric.id] ?? <Activity className='h-4 w-4' />}
            isLoading={isLoading}
            title={metric.title}
            tone={metric.tone}
            value={metric.value}
          />
        ))}
      </div>

      <div className='grid gap-6 lg:grid-cols-[1.4fr_1fr]'>
        <SystemHealthCard
          error={healthError}
          isLoading={isLoading}
          metrics={healthMetrics}
        />
        <OutboxStatusCard
          canReadOutbox={canReadOutbox}
          error={outboxError}
          isLoading={isLoading}
          stats={outboxStats}
        />
      </div>
    </div>
  )
})
DashboardLayout.displayName = 'DashboardLayout'
