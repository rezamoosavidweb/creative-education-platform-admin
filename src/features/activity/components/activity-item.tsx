import { memo } from 'react'
import { ACTIVITY_CATEGORY } from '../constants/activity-config'
import { type ActivityEvent } from '../types/activity'

type ActivityItemProps = {
  event: ActivityEvent
}

export const ActivityItem = memo(function ActivityItem({
  event,
}: ActivityItemProps) {
  const style = ACTIVITY_CATEGORY[event.category]
  const Icon = style.icon

  return (
    <div className='relative flex items-start gap-4 pb-4'>
      <div
        className='relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[2.5px] border-[var(--bg)]'
        style={{ backgroundColor: style.bg }}
      >
        <Icon className='h-[14px] w-[14px]' style={{ color: style.color }} />
      </div>

      <div className='flex-1 rounded-[10px] border border-[var(--bdr)] bg-[var(--sur)] p-[12px_16px]'>
        <div className='flex items-start justify-between gap-3'>
          <h4 className='text-[13.5px] font-semibold text-[var(--t1)]'>
            {event.title}
          </h4>
          <span className='shrink-0 text-[11.5px] whitespace-nowrap text-[var(--t3)]'>
            {event.time}
          </span>
        </div>
        <p className='mt-1 text-[13px] leading-relaxed text-[var(--t2)]'>
          {event.body}
        </p>
        <span className='mt-2 inline-flex items-center rounded-full bg-[var(--sur3)] px-2 py-0.5 text-[11px] text-[var(--t2)]'>
          {event.category} · {event.actor}
        </span>
      </div>
    </div>
  )
})
ActivityItem.displayName = 'ActivityItem'
