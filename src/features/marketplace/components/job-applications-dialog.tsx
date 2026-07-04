import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ApiEmpty, ApiError, ApiLoading } from '@/components/api'
import { StatusPill } from '@/components/status-pill'
import {
  useAcceptMarketplaceApplication,
  useJobApplications,
  useRejectMarketplaceApplication,
} from '../hooks/use-marketplace-queries'
import {
  formatMarketplaceMoney,
  getApplicationStatusTone,
} from '../services/marketplace-query'
import type { MarketplaceApplication, MarketplaceJob } from '../types'

type JobApplicationsDialogProps = {
  job: MarketplaceJob | null
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function JobApplicationsDialog({
  job,
  onOpenChange,
  open,
}: JobApplicationsDialogProps) {
  const applicationsQuery = useJobApplications(job?.id ?? null, open)
  const acceptMutation = useAcceptMarketplaceApplication()
  const rejectMutation = useRejectMarketplaceApplication()

  const run = async (
    label: string,
    application: MarketplaceApplication,
    action: (id: string) => Promise<unknown>
  ) => {
    const promise = action(application.id)
    toast.promise(promise, {
      loading: `${label} application...`,
      success: `Application ${label.toLowerCase()}ed.`,
      error: getApiErrorMessage,
    })
    await promise
    await applicationsQuery.refetch()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[720px]'>
        <DialogHeader>
          <DialogTitle>{job?.title ?? 'Job applications'}</DialogTitle>
          <DialogDescription>
            Review applications for this job. Backend ownership rules decide
            whether review actions are allowed.
          </DialogDescription>
        </DialogHeader>

        {applicationsQuery.isLoading && (
          <ApiLoading label='Loading applications...' />
        )}
        {applicationsQuery.isError && (
          <ApiError
            error={applicationsQuery.error}
            onRetry={() => void applicationsQuery.refetch()}
          />
        )}
        {!applicationsQuery.isLoading &&
          !applicationsQuery.isError &&
          (applicationsQuery.data?.length ?? 0) === 0 && (
            <ApiEmpty
              title='No applications'
              description='The backend returned no applications for this job.'
            />
          )}
        {!applicationsQuery.isLoading &&
          !applicationsQuery.isError &&
          (applicationsQuery.data?.length ?? 0) > 0 && (
            <div className='grid gap-3'>
              {applicationsQuery.data?.map((application) => (
                <div key={application.id} className='rounded-md border p-4'>
                  <div className='flex flex-wrap items-start justify-between gap-3'>
                    <div>
                      <div className='font-mono text-xs'>
                        {application.applicantUserId}
                      </div>
                      <div className='mt-1 text-sm text-muted-foreground'>
                        {application.proposal ?? 'No proposal provided.'}
                      </div>
                    </div>
                    <StatusPill
                      tone={getApplicationStatusTone(application.status)}
                    >
                      {application.status}
                    </StatusPill>
                  </div>
                  <div className='mt-3 flex flex-wrap items-center justify-between gap-2'>
                    <span className='text-sm text-muted-foreground'>
                      {formatMarketplaceMoney(
                        application.proposedRateAmount,
                        application.proposedRateCurrency
                      )}
                    </span>
                    {application.status === 'SUBMITTED' && (
                      <div className='flex gap-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          disabled={acceptMutation.isPending}
                          onClick={() =>
                            void run('Accept', application, (id) =>
                              acceptMutation.mutateAsync(id)
                            )
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          size='sm'
                          variant='ghost'
                          disabled={rejectMutation.isPending}
                          onClick={() =>
                            void run('Reject', application, (id) =>
                              rejectMutation.mutateAsync(id)
                            )
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
      </DialogContent>
    </Dialog>
  )
}
