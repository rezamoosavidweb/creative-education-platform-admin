import { memo, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NOTIFICATION_STYLE } from '../constants/notification-config'
import { type NotificationItem } from '../data/notifications'

type NotificationListProps = {
  items: NotificationItem[]
}

type NotificationFilter = 'all' | 'unread' | 'mentions' | 'system'

export const NotificationList = memo(function NotificationList({
  items,
}: NotificationListProps) {
  const [filter, setFilter] = useState<NotificationFilter>('all')

  const unreadCount = useMemo(
    () => items.filter((n) => n.unread).length,
    [items]
  )

  const visible = useMemo(() => {
    switch (filter) {
      case 'unread':
        return items.filter((n) => n.unread)
      case 'mentions':
        return items.filter((n) => n.mention)
      case 'system':
        return items.filter((n) => n.system)
      default:
        return items
    }
  }, [items, filter])

  const tabs: { id: NotificationFilter; label: string; badge?: number }[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread', badge: unreadCount },
    { id: 'mentions', label: 'Mentions' },
    { id: 'system', label: 'System' },
  ]

  return (
    <>
      {/* Filter tabs */}
      <div className='flex flex-wrap gap-2'>
        {tabs.map((tab) => {
          const active = filter === tab.id
          return (
            <button
              key={tab.id}
              type='button'
              onClick={() => setFilter(tab.id)}
              aria-pressed={active}
              className={cn(
                'inline-flex h-8 items-center gap-1.5 rounded-md border px-3.5 text-[12.5px] font-medium transition-colors',
                active
                  ? 'border-transparent bg-[var(--pri)] text-white'
                  : 'border-[var(--bdr2)] bg-[var(--sur)] text-[var(--t2)] hover:bg-[var(--sur3)] hover:text-[var(--t1)]'
              )}
            >
              {tab.label}
              {tab.badge ? (
                <span
                  className={cn(
                    'rounded-full px-1.5 text-[10px] font-bold',
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-[var(--errs)] text-[var(--err)]'
                  )}
                >
                  {tab.badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      {/* Notification cards */}
      <div className='flex flex-col gap-0.5'>
        {visible.map((item) => {
          const style = NOTIFICATION_STYLE[item.category]
          const Icon = style.icon
          return (
            <div
              key={item.id}
              className='overflow-hidden rounded-lg border border-[var(--bdr)] bg-[var(--sur)]'
              style={{ borderLeft: `3px solid ${style.accent}` }}
            >
              <div className='flex items-start gap-3.5 px-[18px] py-3.5 transition-colors hover:bg-[var(--sur2)]'>
                <div
                  className='flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full'
                  style={{ backgroundColor: style.bg, color: style.color }}
                >
                  <Icon className='h-[15px] w-[15px]' />
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='mb-0.5 flex items-center gap-2'>
                    <span className='text-[13.5px] font-semibold text-[var(--t1)]'>
                      {item.title}
                    </span>
                    {item.unread && (
                      <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pri)]' />
                    )}
                  </div>
                  <p className='text-[13px] leading-normal text-[var(--t2)]'>
                    {item.body}
                  </p>
                  <p className='mt-1.5 text-[11.5px] text-[var(--t3)]'>
                    {item.time}
                  </p>
                </div>
                <button
                  type='button'
                  aria-label='Dismiss notification'
                  className='inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--t3)] transition-colors hover:bg-[var(--sur3)] hover:text-[var(--t1)]'
                >
                  <X className='h-3 w-3' />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
})
NotificationList.displayName = 'NotificationList'
