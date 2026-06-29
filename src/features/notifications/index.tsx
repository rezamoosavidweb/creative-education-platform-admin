import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationPreferences } from './components/notification-preferences'
import { notificationGroups } from './data/notifications'

export function Notifications() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Notifications</h2>
            <p className='text-muted-foreground'>
              Configure how and when the workspace notifies your team.
            </p>
          </div>
          <Button>Save Preferences</Button>
        </div>

        <NotificationPreferences groups={notificationGroups} />
      </Main>
    </>
  )
}
