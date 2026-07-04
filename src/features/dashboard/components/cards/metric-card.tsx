import { memo, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { DashboardMetricTone } from '../../types/dashboard'

type MetricCardProps = {
  className?: string
  description: string
  icon?: ReactNode
  isLoading?: boolean
  title: string
  tone?: DashboardMetricTone
  value: string | number
}

const TONE_CLASS: Record<DashboardMetricTone, string> = {
  danger: 'bg-[var(--errs)] text-[var(--err)]',
  neutral: 'bg-[var(--sur2)] text-[var(--t2)]',
  success: 'bg-[var(--oks)] text-[var(--ok)]',
  warning: 'bg-[var(--warns)] text-[var(--warn)]',
}

export const MetricCard = memo(function MetricCard({
  title,
  value,
  description,
  icon,
  tone = 'neutral',
  isLoading = false,
  className,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <p className='text-xs font-medium text-[var(--t2)]'>{title}</p>
            {icon && <div className='h-4 w-4 text-[var(--t2)]'>{icon}</div>}
          </div>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='h-7 w-24 animate-pulse rounded bg-[var(--sur2)]' />
          <div className='h-4 w-36 animate-pulse rounded bg-[var(--sur2)]' />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'gap-0 border border-[var(--bdr)] bg-[var(--sur)] py-0',
        className
      )}
    >
      <CardHeader className='flex flex-row items-center justify-between space-y-0 px-5 pt-4 pb-3'>
        <p className='text-xs font-medium text-[var(--t2)]'>{title}</p>
        {icon && (
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              TONE_CLASS[tone]
            )}
          >
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className='space-y-2 px-5 pb-4'>
        <div className='text-[26px] font-bold text-[var(--t1)] tabular-nums'>
          {value}
        </div>
        <p className='text-xs text-[var(--t3)]'>{description}</p>
      </CardContent>
    </Card>
  )
})
MetricCard.displayName = 'MetricCard'
