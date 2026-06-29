import { useState } from 'react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { StatCard } from '@/components/stat-card'
import { ThemeSwitch } from '@/components/theme-switch'
import { EventsByHourChart } from './components/events-by-hour-chart'
import { TimeRangeToggle } from './components/time-range-toggle'
import { TopPagesTable } from './components/top-pages-table'
import { TrafficOverviewChart } from './components/traffic-overview-chart'
import { TrafficSourcesCard } from './components/traffic-sources-card'
import {
  analyticsStats,
  eventsByHour,
  topPages,
  trafficSeries,
  trafficSources,
} from './data/analytics'
import { type TimeRange } from './types/analytics'

export function Analytics() {
  const [range, setRange] = useState<TimeRange>('30d')

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Analytics</h2>
            <p className='text-muted-foreground'>
              Workspace usage metrics and growth trends.
            </p>
          </div>
          <TimeRangeToggle value={range} onChange={setRange} />
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {analyticsStats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              foot={stat.foot}
              footTone={stat.footTone}
              footDirection={stat.footDirection}
            />
          ))}
        </div>

        <div className='grid gap-4 sm:gap-6 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <TrafficOverviewChart data={trafficSeries} />
          </div>
          <TrafficSourcesCard data={trafficSources} />
        </div>

        <EventsByHourChart data={eventsByHour} />

        <TopPagesTable data={topPages} />
      </Main>
    </>
  )
}
