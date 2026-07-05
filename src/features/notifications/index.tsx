import { useState } from 'react'
import { useCan } from '@/lib/capabilities'
import { useServerQuery } from '@/lib/query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApiQueryState, CursorPagination } from '@/components/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { NotificationDetailDialog } from './components/notification-detail-dialog'
import { NotificationList } from './components/notification-list'
import {
  NotificationDispatchPanel,
  NotificationOperationsPanel,
  NotificationPreferencesPanel,
  NotificationTemplatesPanel,
} from './components/notification-panels'
import {
  getNotifications,
  NOTIFICATION_DELIVERY_MANAGE_CAPABILITY,
  NOTIFICATION_SEND_CAPABILITY,
  NOTIFICATION_TEMPLATE_MANAGE_CAPABILITY,
  type Notification,
} from './services/notifications-query'

export function Notifications() {
  const [cursor, setCursor] = useState<string | null>(null)
  const [cursorHistory, setCursorHistory] = useState<string[]>([])
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null)
  const canManageTemplates = useCan(NOTIFICATION_TEMPLATE_MANAGE_CAPABILITY)
  const canSendNotifications = useCan(NOTIFICATION_SEND_CAPABILITY)
  const canManageDeliveries = useCan(NOTIFICATION_DELIVERY_MANAGE_CAPABILITY)
  const notificationsQuery = useServerQuery({
    request: {
      method: 'get',
      path: '/notifications/mine',
      query: { cursor: cursor ?? undefined, limit: 20 },
    },
  })
  const notifications = getNotifications(notificationsQuery.data)
  const nextCursor = notificationsQuery.data?.nextCursor ?? null

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-5'>
        <div className='mx-auto flex w-full max-w-6xl flex-col gap-5'>
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Notifications
              </h2>
              <p className='text-muted-foreground'>
                Review inbox delivery, preferences, templates, dispatch, and
                backend delivery operations.
              </p>
            </div>
          </div>

          <Tabs defaultValue='inbox' className='grid gap-4'>
            <TabsList className='h-auto flex-wrap justify-start'>
              <TabsTrigger value='inbox'>Inbox</TabsTrigger>
              <TabsTrigger value='preferences'>Preferences</TabsTrigger>
              <TabsTrigger value='templates'>Templates</TabsTrigger>
              <TabsTrigger value='dispatch'>Dispatch</TabsTrigger>
              <TabsTrigger value='operations'>Delivery ops</TabsTrigger>
            </TabsList>

            <TabsContent value='inbox' className='grid gap-4'>
              <ApiQueryState
                emptyTitle='No notifications'
                emptyDescription='The backend returned no inbox notifications.'
                error={notificationsQuery.error}
                hasData={notifications.length > 0}
                isError={notificationsQuery.isError}
                isLoading={notificationsQuery.isLoading}
                loadingLabel='Loading notifications...'
                onRetry={() => void notificationsQuery.refetch()}
              >
                <NotificationList
                  items={notifications}
                  onSelect={setSelectedNotification}
                />
                <CursorPagination
                  hasNextPage={Boolean(nextCursor)}
                  hasPreviousPage={cursorHistory.length > 0}
                  isRefreshing={notificationsQuery.isFetching}
                  nextCursor={nextCursor}
                  onNext={(next) => {
                    setCursorHistory((history) => [...history, cursor ?? ''])
                    setCursor(next)
                  }}
                  onPrevious={() => {
                    setCursorHistory((history) => {
                      const nextHistory = history.slice(0, -1)
                      setCursor(history[history.length - 1] || null)
                      return nextHistory
                    })
                  }}
                  onRefresh={() => void notificationsQuery.refetch()}
                />
              </ApiQueryState>
            </TabsContent>

            <TabsContent value='preferences'>
              <NotificationPreferencesPanel />
            </TabsContent>

            <TabsContent value='templates'>
              <NotificationTemplatesPanel enabled={canManageTemplates} />
            </TabsContent>

            <TabsContent value='dispatch'>
              <NotificationDispatchPanel enabled={canSendNotifications} />
            </TabsContent>

            <TabsContent value='operations'>
              <NotificationOperationsPanel enabled={canManageDeliveries} />
            </TabsContent>
          </Tabs>
        </div>
      </Main>

      <NotificationDetailDialog
        notification={selectedNotification}
        open={Boolean(selectedNotification)}
        onOpenChange={(open) => {
          if (!open) setSelectedNotification(null)
        }}
      />
    </>
  )
}
