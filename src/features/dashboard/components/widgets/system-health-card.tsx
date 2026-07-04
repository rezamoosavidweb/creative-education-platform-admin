import { memo } from 'react'
import { CheckCircle2, CircleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { HealthMetric } from '../../types/dashboard'

type SystemHealthCardProps = {
  error?: string | null
  isLoading?: boolean
  metrics: HealthMetric[]
}

export const SystemHealthCard = memo(function SystemHealthCard({
  metrics,
  isLoading = false,
  error,
}: SystemHealthCardProps) {
  const hasIssues = metrics.some((metric) => metric.status !== 'up')

  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-[var(--t1)]'>System Health</CardTitle>
        {!isLoading && !error && metrics.length > 0 && (
          <span
            className={cn(
              'flex items-center gap-1.5 text-[12.5px] font-medium',
              hasIssues ? 'text-[var(--warn)]' : 'text-[var(--ok)]'
            )}
          >
            <span
              className={cn(
                'h-[7px] w-[7px] rounded-full',
                hasIssues ? 'bg-[var(--warn)]' : 'bg-[var(--ok)]'
              )}
            />
            {hasIssues ? 'Needs Attention' : 'Operational'}
          </span>
        )}
      </CardHeader>
      <CardContent>
        {error ? (
          <div className='rounded-md border border-[var(--err)]/40 bg-[var(--errs)] p-3 text-sm text-[var(--err)]'>
            {error}
          </div>
        ) : isLoading ? (
          <div className='space-y-3'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className='h-10 animate-pulse rounded bg-[var(--sur2)]'
              />
            ))}
          </div>
        ) : metrics.length === 0 ? (
          <div className='rounded-md border border-[var(--bdr)] bg-[var(--sur2)] p-3 text-sm text-[var(--t2)]'>
            No health indicators reported.
          </div>
        ) : (
          <ul className='divide-y divide-[var(--bdr)]'>
            {metrics.map((metric) => {
              const isUp = metric.status === 'up'
              const Icon = isUp ? CheckCircle2 : CircleAlert

              return (
                <li
                  key={metric.id}
                  className='flex items-start justify-between gap-4 py-2.5 text-[13px]'
                >
                  <div className='min-w-0'>
                    <span className='font-medium text-[var(--t1)]'>
                      {metric.label}
                    </span>
                    {metric.details && (
                      <p className='mt-0.5 truncate text-[12px] text-[var(--t3)]'>
                        {metric.details}
                      </p>
                    )}
                  </div>
                  <span
                    className={cn(
                      'flex shrink-0 items-center gap-1 font-medium capitalize',
                      isUp ? 'text-[var(--ok)]' : 'text-[var(--warn)]'
                    )}
                  >
                    <Icon className='h-3.5 w-3.5' />
                    {metric.status}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
})
SystemHealthCard.displayName = 'SystemHealthCard'
