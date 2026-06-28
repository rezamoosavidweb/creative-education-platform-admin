import { memo, type ReactNode } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Sparkline, type SparklineData } from '../charts/sparkline'
import type { MetricCard as MetricCardType } from '../../types/dashboard'

type MetricCardProps = Omit<MetricCardType, 'id' | 'icon'> & {
  className?: string
  icon?: ReactNode
  sparklineData?: SparklineData[]
  sparklineColor?: string
}

export const MetricCard = memo(function MetricCard({
  title,
  value,
  trend,
  icon,
  isLoading = false,
  error,
  className,
  sparklineData,
  sparklineColor,
}: MetricCardProps) {
  if (error) {
    return (
      <Card className={cn('border-red-500/50 bg-red-500/5', className)}>
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <p className='text-xs font-medium text-[var(--t2)]'>{title}</p>
            {icon && <div className='h-4 w-4 text-[var(--t2)]'>{icon}</div>}
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-xs text-red-500'>{error}</p>
        </CardContent>
      </Card>
    )
  }

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
          <div className='h-6 w-full animate-pulse rounded bg-[var(--sur2)]' />
          <div className='h-4 w-20 animate-pulse rounded bg-[var(--sur2)]' />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('border border-[var(--bdr)] bg-[var(--sur)]', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3 pt-4 px-5'>
        <p className='text-xs font-medium text-[var(--t2)]'>{title}</p>
        {icon && (
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--pris)]'>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className='px-5 pb-4 space-y-2'>
        <div className='flex items-end justify-between gap-2'>
          <div className='flex flex-col gap-1'>
            <div className='text-[26px] font-bold text-[var(--t1)] tabular-nums'>{value}</div>
            {trend && (
              <div className='flex items-center gap-1'>
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.direction === 'up'
                      ? 'text-[var(--ok)]'
                      : trend.direction === 'down'
                        ? 'text-[var(--err)]'
                        : 'text-[var(--t3)]'
                  )}
                >
                  {trend.direction === 'up'
                    ? '↑ '
                    : trend.direction === 'down'
                      ? '↓ '
                      : ''}{Math.abs(trend.value)}%
                </span>
              </div>
            )}
          </div>
          {sparklineData && sparklineData.length > 0 && (
            <Sparkline
              data={sparklineData}
              color={sparklineColor || 'var(--pri)'}
              width={80}
              height={28}
            />
          )}
        </div>
        {trend && (
          <p className='text-xs text-[var(--t3)]'>{trend.label}</p>
        )}
      </CardContent>
    </Card>
  )
})
MetricCard.displayName = 'MetricCard'
