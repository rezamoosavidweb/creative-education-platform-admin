import { memo, type ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { MetricCard as MetricCardType } from '../../types/dashboard'

type MetricCardProps = Omit<MetricCardType, 'id' | 'icon'> & {
  className?: string
  compact?: boolean
  icon?: ReactNode
}

export const MetricCard = memo(function MetricCard({
  title,
  value,
  trend,
  icon,
  description,
  isLoading = false,
  error,
  className,
  compact = false,
}: MetricCardProps) {
  if (error) {
    return (
      <Card className={cn('border-destructive', className)}>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-destructive'>{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>{title}</CardTitle>
          {icon && (
            <div className='h-4 w-4 text-muted-foreground'>
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className='h-8 animate-pulse rounded bg-muted' />
          {!compact && <div className='mt-2 h-4 animate-pulse rounded bg-muted' />}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className={cn(
          'font-medium',
          compact ? 'text-xs' : 'text-sm'
        )}>
          {title}
        </CardTitle>
        {icon && (
          <div
            className={cn(
              'text-muted-foreground',
              compact ? 'h-3 w-3' : 'h-4 w-4'
            )}
          >
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={cn(
          'font-bold',
          compact ? 'text-lg' : 'text-2xl'
        )}>
          {value}
        </div>
        {trend && (
          <div className='mt-2 flex items-center gap-1'>
            {trend.direction === 'up' ? (
              <TrendingUp className='h-3 w-3 text-green-600' />
            ) : trend.direction === 'down' ? (
              <TrendingDown className='h-3 w-3 text-red-600' />
            ) : null}
            <p
              className={cn(
                'text-xs font-medium',
                trend.direction === 'up'
                  ? 'text-green-600'
                  : trend.direction === 'down'
                    ? 'text-red-600'
                    : 'text-muted-foreground'
              )}
            >
              {trend.direction !== 'neutral' ? `${trend.direction === 'up' ? '+' : '-'}` : ''}
              {Math.abs(trend.value)}% {trend.label}
            </p>
          </div>
        )}
        {description && (
          <p className='mt-2 text-xs text-muted-foreground'>{description}</p>
        )}
      </CardContent>
    </Card>
  )
})
MetricCard.displayName = 'MetricCard'
