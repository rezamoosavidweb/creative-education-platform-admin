import { Bell } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ApiQueryState } from '@/components/api'
import { StatusPill } from '@/components/status-pill'
import { useNotificationDetail } from '../hooks/use-notification-admin'
import {
  formatNotificationDate,
  getDeliverySummary,
  getNotificationStatusTone,
  type Notification,
} from '../services/notifications-query'

type NotificationDetailDialogProps = {
  notification: Notification | null
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function NotificationDetailDialog({
  notification,
  onOpenChange,
  open,
}: NotificationDetailDialogProps) {
  const detailQuery = useNotificationDetail(
    open ? (notification?.id ?? null) : null
  )
  const detail = detailQuery.data ?? notification

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notification detail</DialogTitle>
          <DialogDescription>
            Backend delivery state for this inbox notification.
          </DialogDescription>
        </DialogHeader>

        <ApiQueryState
          emptyTitle='Notification unavailable'
          emptyDescription='The notification could not be loaded from the backend.'
          error={detailQuery.error}
          hasData={Boolean(detail)}
          isError={detailQuery.isError}
          isLoading={detailQuery.isLoading && !detail}
          loadingLabel='Loading notification...'
          onRetry={() => void detailQuery.refetch()}
        >
          {detail && (
            <div className='grid gap-4'>
              <div className='flex items-start gap-3 rounded-lg border border-[var(--bdr)] bg-[var(--sur)] p-4'>
                <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--sur3)] text-[var(--t2)]'>
                  <Bell className='size-4' />
                </div>
                <div className='min-w-0 flex-1 space-y-2'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='font-semibold'>{detail.templateKey}</span>
                    <StatusPill tone={getNotificationStatusTone(detail.status)}>
                      {detail.status}
                    </StatusPill>
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {detail.category} - {getDeliverySummary(detail)}
                  </p>
                </div>
              </div>

              <dl className='grid gap-3 text-sm sm:grid-cols-2'>
                <div>
                  <dt className='text-muted-foreground'>Created</dt>
                  <dd>{formatNotificationDate(detail.createdAt)}</dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>User ID</dt>
                  <dd className='break-all'>{detail.userId}</dd>
                </div>
                <div className='sm:col-span-2'>
                  <dt className='text-muted-foreground'>Notification ID</dt>
                  <dd className='break-all'>{detail.id}</dd>
                </div>
              </dl>
            </div>
          )}
        </ApiQueryState>
      </DialogContent>
    </Dialog>
  )
}
