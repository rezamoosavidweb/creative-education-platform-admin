import { memo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  AlertCircle,
  ArrowRight,
  CreditCard,
  ShoppingCart,
  UserPlus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Activity } from '../../types/dashboard'

type RecentActivityFeedProps = {
  data: Activity[]
  isLoading?: boolean
}

const TYPE_STYLE: Record<
  Activity['type'],
  { icon: typeof ShoppingCart; color: string; bg: string }
> = {
  sale: { icon: ShoppingCart, color: 'var(--ok)', bg: 'var(--oks)' },
  user_signup: { icon: UserPlus, color: 'var(--info)', bg: 'var(--infos)' },
  payment: { icon: CreditCard, color: 'var(--warn)', bg: 'var(--warns)' },
  error: { icon: AlertCircle, color: 'var(--err)', bg: 'var(--errs)' },
}

export const RecentActivityFeed = memo(function RecentActivityFeed({
  data,
  isLoading = false,
}: RecentActivityFeedProps) {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-[var(--t1)]'>Recent Activity</CardTitle>
        <button
          type='button'
          className='flex items-center gap-1 text-[12.5px] font-medium text-[var(--pri)] hover:underline'
        >
          View all
          <ArrowRight className='h-3.5 w-3.5' />
        </button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-3'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className='h-10 animate-pulse rounded bg-[var(--sur2)]'
              />
            ))}
          </div>
        ) : (
          <ul className='space-y-1'>
            {data.map((activity) => {
              const style = TYPE_STYLE[activity.type]
              const Icon = style.icon
              return (
                <li key={activity.id} className='flex items-start gap-3 py-2'>
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg'
                    )}
                    style={{ backgroundColor: style.bg, color: style.color }}
                  >
                    <Icon className='h-4 w-4' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-[13px] font-medium text-[var(--t1)]'>
                      {activity.title}
                    </p>
                    <p className='truncate text-[12.5px] text-[var(--t2)]'>
                      {activity.description}
                    </p>
                  </div>
                  <span className='shrink-0 text-[11.5px] whitespace-nowrap text-[var(--t3)]'>
                    {formatDistanceToNow(activity.timestamp, {
                      addSuffix: true,
                    })}
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
RecentActivityFeed.displayName = 'RecentActivityFeed'
