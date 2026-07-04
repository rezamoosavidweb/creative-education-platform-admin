import { useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ActivityTimeline } from './components/activity-timeline'
import { activities } from './data/activities'
import { type ActivityCategory } from './types/activity'

type ActivityTab =
  | 'All Events'
  | 'Auth'
  | 'Users'
  | 'Projects'
  | 'System'
  | 'Billing'

const TABS: ActivityTab[] = [
  'All Events',
  'Auth',
  'Users',
  'Projects',
  'System',
  'Billing',
]

const TAB_CATEGORIES: Record<ActivityTab, ActivityCategory[] | null> = {
  'All Events': null,
  Auth: ['Security'],
  Users: ['Users', 'Teams'],
  Projects: ['Projects'],
  System: ['System', 'Monitoring', 'Integrations'],
  Billing: ['Billing'],
}

export function Activity() {
  const [tab, setTab] = useState<ActivityTab>('All Events')

  const visible = useMemo(() => {
    const categories = TAB_CATEGORIES[tab]
    if (!categories) return activities
    return activities.filter((event) => categories.includes(event.category))
  }, [tab])

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='mx-auto flex w-full max-w-[760px] flex-col gap-6'>
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Activity</h2>
              <p className='text-muted-foreground'>
                Unified timeline of all workspace events and actions.
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <span className='flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--ok)]'>
                <span className='h-[6px] w-[6px] animate-pulse rounded-full bg-[var(--ok)]' />
                Live
              </span>
              <Button variant='outline'>
                <RefreshCw className='h-4 w-4' />
                Refresh
              </Button>
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {TABS.map((t) => {
              const active = tab === t
              return (
                <button
                  key={t}
                  type='button'
                  onClick={() => setTab(t)}
                  aria-pressed={active}
                  className={cn(
                    'inline-flex h-8 items-center rounded-md border px-3.5 text-[12.5px] font-medium transition-colors',
                    active
                      ? 'border-transparent bg-[var(--pri)] text-white'
                      : 'border-[var(--bdr2)] bg-[var(--sur)] text-[var(--t2)] hover:bg-[var(--sur3)] hover:text-[var(--t1)]'
                  )}
                >
                  {t}
                </button>
              )
            })}
          </div>

          <ActivityTimeline events={visible} />
        </div>
      </Main>
    </>
  )
}
