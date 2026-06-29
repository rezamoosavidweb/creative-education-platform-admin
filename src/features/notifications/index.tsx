import { CheckCheck, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationList } from './components/notification-list'
import { notifications } from './data/notifications'

export function Notifications() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-5'>
        <div className='mx-auto flex w-full max-w-[800px] flex-col gap-5'>
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Notifications</h2>
              <p className='text-muted-foreground'>
                Stay up to date with your workspace activity.
              </p>
            </div>
            <div className='flex gap-2'>
              <Button variant='outline'>
                <CheckCheck className='h-4 w-4' />
                Mark all read
              </Button>
              <Button variant='outline'>
                <Settings className='h-4 w-4' />
                Preferences
              </Button>
            </div>
          </div>

          <NotificationList items={notifications} />
        </div>
      </Main>
    </>
  )
}
