import { Check, Eye, X } from 'lucide-react'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusPill } from '@/components/status-pill'
import {
  formatMarketplaceMoney,
  getApplicationJob,
  getApplicationStatusTone,
  getContractStatusTone,
  getJobStatusTone,
  getServiceStatusTone,
  getTagCount,
} from '../services/marketplace-query'
import type {
  MarketplaceApplication,
  MarketplaceContract,
  MarketplaceJob,
  MarketplaceService,
} from '../types'

type ServicesTableProps = {
  mode: 'public' | 'mine'
  onPublish?: (service: MarketplaceService) => Promise<void>
  onUnlist?: (service: MarketplaceService) => Promise<void>
  services: MarketplaceService[]
}

export function ServicesTable({
  mode,
  onPublish,
  onUnlist,
  services,
}: ServicesTableProps) {
  const run = async (
    label: string,
    service: MarketplaceService,
    action: ((service: MarketplaceService) => Promise<void>) | undefined
  ) => {
    if (!action) return
    const promise = action(service)
    toast.promise(promise, {
      loading: `${label} service...`,
      success: `Service ${label.toLowerCase()}ed.`,
      error: getApiErrorMessage,
    })
    await promise
  }

  return (
    <div className='rounded-md border bg-[var(--sur)]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Taxonomy</TableHead>
            {mode === 'mine' && (
              <TableHead className='text-end'>Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className='min-w-[260px] whitespace-normal'>
                <div className='font-medium'>{service.title}</div>
                <div className='text-xs text-muted-foreground'>
                  Provider {service.providerUserId}
                </div>
              </TableCell>
              <TableCell>
                <StatusPill tone={getServiceStatusTone(service.status)}>
                  {service.status}
                </StatusPill>
              </TableCell>
              <TableCell>
                {formatMarketplaceMoney(
                  service.priceAmount,
                  service.priceCurrency
                )}
              </TableCell>
              <TableCell>{getTagCount(service)} linked</TableCell>
              {mode === 'mine' && (
                <TableCell>
                  <div className='flex justify-end gap-2'>
                    {service.status !== 'PUBLISHED' && (
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => void run('Publish', service, onPublish)}
                      >
                        Publish
                      </Button>
                    )}
                    {service.status === 'PUBLISHED' && (
                      <Button
                        size='sm'
                        variant='ghost'
                        onClick={() => void run('Unlist', service, onUnlist)}
                      >
                        Unlist
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

type JobsTableProps = {
  jobs: MarketplaceJob[]
  onApply: (job: MarketplaceJob) => void
  onClose: (job: MarketplaceJob) => Promise<void>
  onReviewApplications: (job: MarketplaceJob) => void
}

export function JobsTable({
  jobs,
  onApply,
  onClose,
  onReviewApplications,
}: JobsTableProps) {
  const closeJob = async (job: MarketplaceJob) => {
    const promise = onClose(job)
    toast.promise(promise, {
      loading: 'Closing job...',
      success: 'Job closed.',
      error: getApiErrorMessage,
    })
    await promise
  }

  return (
    <div className='rounded-md border bg-[var(--sur)]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Taxonomy</TableHead>
            <TableHead className='text-end'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className='min-w-[260px] whitespace-normal'>
                <div className='font-medium'>{job.title}</div>
                <div className='text-xs text-muted-foreground'>
                  Hirer {job.hirerUserId}
                </div>
              </TableCell>
              <TableCell>
                <StatusPill tone={getJobStatusTone(job.status)}>
                  {job.status}
                </StatusPill>
              </TableCell>
              <TableCell>
                {formatMarketplaceMoney(job.budgetAmount, job.budgetCurrency)}
              </TableCell>
              <TableCell>
                {job.isRemote ? 'Remote' : (job.city ?? 'TBD')}
              </TableCell>
              <TableCell>{getTagCount(job)} linked</TableCell>
              <TableCell>
                <div className='flex justify-end gap-2'>
                  <Button
                    size='icon'
                    variant='ghost'
                    aria-label={`Review applications for ${job.title}`}
                    onClick={() => onReviewApplications(job)}
                  >
                    <Eye className='size-4' />
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => onApply(job)}
                  >
                    Apply
                  </Button>
                  {job.status === 'OPEN' && (
                    <Button
                      size='icon'
                      variant='ghost'
                      aria-label={`Close ${job.title}`}
                      onClick={() => void closeJob(job)}
                    >
                      <X className='size-4' />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

type ApplicationsTableProps = {
  applications: MarketplaceApplication[]
  jobs: MarketplaceJob[]
  onWithdraw?: (application: MarketplaceApplication) => Promise<void>
}

export function ApplicationsTable({
  applications,
  jobs,
  onWithdraw,
}: ApplicationsTableProps) {
  const withdraw = async (application: MarketplaceApplication) => {
    if (!onWithdraw) return
    const promise = onWithdraw(application)
    toast.promise(promise, {
      loading: 'Withdrawing application...',
      success: 'Application withdrawn.',
      error: getApiErrorMessage,
    })
    await promise
  }

  return (
    <div className='rounded-md border bg-[var(--sur)]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Application</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Proposed rate</TableHead>
            {onWithdraw && <TableHead className='text-end'>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            const job = getApplicationJob(application, jobs)

            return (
              <TableRow key={application.id}>
                <TableCell className='min-w-[260px] whitespace-normal'>
                  <div className='font-medium'>
                    {job?.title ?? application.jobId}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    Applicant {application.applicantUserId}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusPill
                    tone={getApplicationStatusTone(application.status)}
                  >
                    {application.status}
                  </StatusPill>
                </TableCell>
                <TableCell>
                  {formatMarketplaceMoney(
                    application.proposedRateAmount,
                    application.proposedRateCurrency
                  )}
                </TableCell>
                {onWithdraw && (
                  <TableCell>
                    <div className='flex justify-end'>
                      {application.status === 'SUBMITTED' && (
                        <Button
                          size='sm'
                          variant='ghost'
                          onClick={() => void withdraw(application)}
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

type ContractsTableProps = {
  contracts: MarketplaceContract[]
  onCancel: (contract: MarketplaceContract) => Promise<void>
  onComplete: (contract: MarketplaceContract) => Promise<void>
}

export function ContractsTable({
  contracts,
  onCancel,
  onComplete,
}: ContractsTableProps) {
  const run = async (
    label: string,
    contract: MarketplaceContract,
    action: (contract: MarketplaceContract) => Promise<void>
  ) => {
    const promise = action(contract)
    toast.promise(promise, {
      loading: `${label} contract...`,
      success: `Contract ${label.toLowerCase()}d.`,
      error: getApiErrorMessage,
    })
    await promise
  }

  return (
    <div className='rounded-md border bg-[var(--sur)]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contract</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Parties</TableHead>
            <TableHead className='text-end'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className='font-mono text-xs'>{contract.id}</TableCell>
              <TableCell>
                <StatusPill tone={getContractStatusTone(contract.status)}>
                  {contract.status}
                </StatusPill>
              </TableCell>
              <TableCell>
                {formatMarketplaceMoney(
                  contract.amountAmount,
                  contract.amountCurrency
                )}
              </TableCell>
              <TableCell className='text-xs text-muted-foreground'>
                {contract.hirerUserId} / {contract.providerUserId}
              </TableCell>
              <TableCell>
                <div className='flex justify-end gap-2'>
                  {contract.status === 'ACTIVE' && (
                    <>
                      <Button
                        size='icon'
                        variant='ghost'
                        aria-label={`Complete contract ${contract.id}`}
                        onClick={() =>
                          void run('Complete', contract, onComplete)
                        }
                      >
                        <Check className='size-4' />
                      </Button>
                      <Button
                        size='icon'
                        variant='ghost'
                        aria-label={`Cancel contract ${contract.id}`}
                        onClick={() => void run('Cancel', contract, onCancel)}
                      >
                        <X className='size-4' />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
