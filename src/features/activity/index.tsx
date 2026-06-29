import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ActivityTimeline } from './components/activity-timeline'
import { activities } from './data/activities'

export function Activity() {
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
            <h2 className='text-2xl font-bold tracking-tight'>Activity</h2>
            <p className='text-muted-foreground'>
              A real-time timeline of everything happening in your workspace.
            </p>
          </div>
          <div className='flex items-center gap-2 text-[13px] font-medium text-[var(--ok)]'>
            <span className='h-[7px] w-[7px] animate-pulse rounded-full bg-[var(--ok)]' />
            Live
          </div>
        </div>

        <ActivityTimeline events={activities} />
      </Main>
    </>
  )
}
