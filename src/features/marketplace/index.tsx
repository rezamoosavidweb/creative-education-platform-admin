import { useMemo, useState } from 'react'
import { Plus, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApiQueryState } from '@/components/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { JobApplicationsDialog } from './components/job-applications-dialog'
import {
  ApplyJobDialog,
  CreateServiceDialog,
  PostJobDialog,
} from './components/marketplace-dialogs'
import {
  ApplicationsTable,
  ContractsTable,
  JobsTable,
  ServicesTable,
} from './components/marketplace-tables'
import {
  useCancelMarketplaceContract,
  useCloseMarketplaceJob,
  useCompleteMarketplaceContract,
  useMarketplaceContracts,
  useMarketplaceJobs,
  useMarketplaceServices,
  useMyMarketplaceApplications,
  useMyMarketplaceServices,
  usePublishMarketplaceService,
  useUnlistMarketplaceService,
  useWithdrawMarketplaceApplication,
} from './hooks/use-marketplace-queries'
import { filterMarketplaceItems } from './services/marketplace-query'
import type {
  MarketplaceApplication,
  MarketplaceContract,
  MarketplaceJob,
  MarketplaceService,
} from './types'

export function Marketplace() {
  const [applyJob, setApplyJob] = useState<MarketplaceJob | null>(null)
  const [reviewJob, setReviewJob] = useState<MarketplaceJob | null>(null)
  const [isPostJobOpen, setIsPostJobOpen] = useState(false)
  const [isServiceOpen, setIsServiceOpen] = useState(false)
  const [query, setQuery] = useState('')

  const servicesQuery = useMarketplaceServices()
  const myServicesQuery = useMyMarketplaceServices()
  const jobsQuery = useMarketplaceJobs()
  const applicationsQuery = useMyMarketplaceApplications()
  const contractsQuery = useMarketplaceContracts()
  const publishServiceMutation = usePublishMarketplaceService()
  const unlistServiceMutation = useUnlistMarketplaceService()
  const closeJobMutation = useCloseMarketplaceJob()
  const withdrawMutation = useWithdrawMarketplaceApplication()
  const completeContractMutation = useCompleteMarketplaceContract()
  const cancelContractMutation = useCancelMarketplaceContract()

  const services = useMemo(
    () => filterMarketplaceItems(servicesQuery.data ?? [], query),
    [query, servicesQuery.data]
  )
  const myServices = useMemo(
    () => filterMarketplaceItems(myServicesQuery.data ?? [], query),
    [query, myServicesQuery.data]
  )
  const jobs = useMemo(
    () => filterMarketplaceItems(jobsQuery.data ?? [], query),
    [jobsQuery.data, query]
  )

  const publishService = async (service: MarketplaceService) => {
    await publishServiceMutation.mutateAsync(service.id)
  }

  const unlistService = async (service: MarketplaceService) => {
    await unlistServiceMutation.mutateAsync(service.id)
  }

  const closeJob = async (job: MarketplaceJob) => {
    await closeJobMutation.mutateAsync(job.id)
  }

  const withdrawApplication = async (application: MarketplaceApplication) => {
    await withdrawMutation.mutateAsync(application.id)
  }

  const completeContract = async (contract: MarketplaceContract) => {
    await completeContractMutation.mutateAsync(contract.id)
  }

  const cancelContract = async (contract: MarketplaceContract) => {
    await cancelContractMutation.mutateAsync(contract.id)
  }

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Marketplace</h2>
            <p className='text-muted-foreground'>
              Manage service listings, jobs, applications, and contracts.
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => setIsServiceOpen(true)}>
              <Store className='size-4' />
              New service
            </Button>
            <Button onClick={() => setIsPostJobOpen(true)}>
              <Plus className='size-4' />
              New job
            </Button>
          </div>
        </div>

        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder='Search marketplace...'
          className='max-w-[480px]'
        />

        <Tabs defaultValue='services'>
          <TabsList className='flex-wrap'>
            <TabsTrigger value='services'>Services</TabsTrigger>
            <TabsTrigger value='mine'>My services</TabsTrigger>
            <TabsTrigger value='jobs'>Jobs</TabsTrigger>
            <TabsTrigger value='applications'>Applications</TabsTrigger>
            <TabsTrigger value='contracts'>Contracts</TabsTrigger>
          </TabsList>

          <TabsContent value='services' className='mt-4'>
            <ApiQueryState
              emptyDescription='No published services match the current filters.'
              emptyTitle='No services'
              isError={servicesQuery.isError}
              isLoading={servicesQuery.isLoading}
              onRetry={() => void servicesQuery.refetch()}
              error={servicesQuery.error}
              hasData={services.length > 0}
              loadingLabel='Loading services...'
            >
              <ServicesTable mode='public' services={services} />
            </ApiQueryState>
          </TabsContent>

          <TabsContent value='mine' className='mt-4'>
            <ApiQueryState
              emptyDescription='No service listings match the current filters.'
              emptyTitle='No service listings'
              isError={myServicesQuery.isError}
              isLoading={myServicesQuery.isLoading}
              onRetry={() => void myServicesQuery.refetch()}
              error={myServicesQuery.error}
              hasData={myServices.length > 0}
              loadingLabel='Loading your services...'
            >
              <ServicesTable
                mode='mine'
                onPublish={publishService}
                onUnlist={unlistService}
                services={myServices}
              />
            </ApiQueryState>
          </TabsContent>

          <TabsContent value='jobs' className='mt-4'>
            <ApiQueryState
              emptyDescription='No open jobs match the current filters.'
              emptyTitle='No jobs'
              isError={jobsQuery.isError}
              isLoading={jobsQuery.isLoading}
              onRetry={() => void jobsQuery.refetch()}
              error={jobsQuery.error}
              hasData={jobs.length > 0}
              loadingLabel='Loading jobs...'
            >
              <JobsTable
                jobs={jobs}
                onApply={setApplyJob}
                onClose={closeJob}
                onReviewApplications={setReviewJob}
              />
            </ApiQueryState>
          </TabsContent>

          <TabsContent value='applications' className='mt-4'>
            <ApiQueryState
              emptyDescription='The backend returned no applications for this account.'
              emptyTitle='No applications'
              isError={applicationsQuery.isError}
              isLoading={applicationsQuery.isLoading}
              onRetry={() => void applicationsQuery.refetch()}
              error={applicationsQuery.error}
              hasData={(applicationsQuery.data?.length ?? 0) > 0}
              loadingLabel='Loading applications...'
            >
              <ApplicationsTable
                applications={applicationsQuery.data ?? []}
                jobs={jobsQuery.data ?? []}
                onWithdraw={withdrawApplication}
              />
            </ApiQueryState>
          </TabsContent>

          <TabsContent value='contracts' className='mt-4'>
            <ApiQueryState
              emptyDescription='The backend returned no contracts for this account.'
              emptyTitle='No contracts'
              isError={contractsQuery.isError}
              isLoading={contractsQuery.isLoading}
              onRetry={() => void contractsQuery.refetch()}
              error={contractsQuery.error}
              hasData={(contractsQuery.data?.length ?? 0) > 0}
              loadingLabel='Loading contracts...'
            >
              <ContractsTable
                contracts={contractsQuery.data ?? []}
                onCancel={cancelContract}
                onComplete={completeContract}
              />
            </ApiQueryState>
          </TabsContent>
        </Tabs>
      </Main>

      <CreateServiceDialog
        open={isServiceOpen}
        onOpenChange={setIsServiceOpen}
      />
      <PostJobDialog open={isPostJobOpen} onOpenChange={setIsPostJobOpen} />
      <ApplyJobDialog
        job={applyJob}
        open={Boolean(applyJob)}
        onOpenChange={(open) => {
          if (!open) setApplyJob(null)
        }}
      />
      <JobApplicationsDialog
        job={reviewJob}
        open={Boolean(reviewJob)}
        onOpenChange={(open) => {
          if (!open) setReviewJob(null)
        }}
      />
    </>
  )
}
