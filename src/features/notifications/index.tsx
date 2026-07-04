import { useServerQuery } from '@/lib/query'
import { ApiEmpty, ApiError, ApiLoading } from '@/components/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationList } from './components/notification-list'
import { getNotifications } from './services/notifications-query'

export function Notifications() {
  const notificationsQuery = useServerQuery({
    request: {
      method: 'get',
      path: '/notifications/mine',
      query: { limit: 20 },
    },
  })
  const notifications = getNotifications(notificationsQuery.data)

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-5'>
        <div className='mx-auto flex w-full max-w-[800px] flex-col gap-5'>
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Notifications
              </h2>
              <p className='text-muted-foreground'>
                Review backend notifications delivered to your account.
              </p>
            </div>
          </div>

          {notificationsQuery.isLoading && (
            <ApiLoading label='Loading notifications...' />
          )}
          {notificationsQuery.isError && (
            <ApiError
              error={notificationsQuery.error}
              onRetry={() => void notificationsQuery.refetch()}
            />
          )}
          {!notificationsQuery.isLoading &&
            !notificationsQuery.isError &&
            notifications.length === 0 && (
              <ApiEmpty
                title='No notifications'
                description='The backend returned no inbox notifications.'
              />
            )}
          {!notificationsQuery.isLoading &&
            !notificationsQuery.isError &&
            notifications.length > 0 && (
              <NotificationList items={notifications} />
            )}
        </div>
      </Main>
    </>
  )
}
