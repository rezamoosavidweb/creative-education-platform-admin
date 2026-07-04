import { memo, useMemo } from 'react'
import { type ActivityEvent } from '../types/activity'
import { ActivityItem } from './activity-item'

type ActivityTimelineProps = {
  events: ActivityEvent[]
}

type ActivityGroup = {
  date: string
  events: ActivityEvent[]
}

function groupByDate(events: ActivityEvent[]): ActivityGroup[] {
  const groups: ActivityGroup[] = []
  for (const event of events) {
    const last = groups[groups.length - 1]
    if (last && last.date === event.date) {
      last.events.push(event)
    } else {
      groups.push({ date: event.date, events: [event] })
    }
  }
  return groups
}

export const ActivityTimeline = memo(function ActivityTimeline({
  events,
}: ActivityTimelineProps) {
  const groups = useMemo(() => groupByDate(events), [events])

  return (
    <div className='relative mx-auto w-full max-w-[760px]'>
      {/* Continuous vertical rail behind the icon circles */}
      <div className='absolute top-2 bottom-2 left-[17px] w-[1.5px] bg-[var(--bdr)]' />

      {groups.map((group) => (
        <div key={group.date}>
          <div className='mt-1 mb-3 ps-11'>
            <span className='text-[11px] font-semibold tracking-[0.08em] text-[var(--t3)] uppercase'>
              {group.date}
            </span>
          </div>
          {group.events.map((event) => (
            <ActivityItem key={event.id} event={event} />
          ))}
        </div>
      ))}
    </div>
  )
})
ActivityTimeline.displayName = 'ActivityTimeline'
