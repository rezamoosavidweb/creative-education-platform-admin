import { memo } from 'react'
import { Bell } from 'lucide-react'
import { StatusPill } from '@/components/status-pill'
import {
  formatNotificationDate,
  getDeliverySummary,
  getNotificationStatusTone,
  type Notification,
} from '../services/notifications-query'

type NotificationListProps = {
  items: Notification[]
  onSelect?: (notification: Notification) => void
}

export const NotificationList = memo(function NotificationList({
  items,
  onSelect,
}: NotificationListProps) {
  return (
    <div className='flex flex-col gap-2'>
      {items.map((item) => (
        <button
          type='button'
          key={item.id}
          onClick={() => onSelect?.(item)}
          className='overflow-hidden rounded-lg border border-[var(--bdr)] bg-[var(--sur)] text-left transition-colors hover:bg-[var(--sur2)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none'
        >
          <div className='flex items-start gap-3.5 px-[18px] py-3.5'>
            <div className='flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[var(--sur3)] text-[var(--t2)]'>
              <Bell className='h-[15px] w-[15px]' />
            </div>
            <div className='min-w-0 flex-1'>
              <div className='mb-1 flex flex-wrap items-center gap-2'>
                <span className='text-[13.5px] font-semibold text-[var(--t1)]'>
                  {item.templateKey}
                </span>
                <StatusPill tone={getNotificationStatusTone(item.status)}>
                  {item.status}
                </StatusPill>
              </div>
              <p className='text-[13px] leading-normal text-[var(--t2)]'>
                {item.category} - {getDeliverySummary(item)}
              </p>
              <p className='mt-1.5 text-[11.5px] text-[var(--t3)]'>
                {formatNotificationDate(item.createdAt)}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
})
NotificationList.displayName = 'NotificationList'
