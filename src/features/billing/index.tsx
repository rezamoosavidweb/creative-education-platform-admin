import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { InvoicesTable } from './components/invoices-table'
import { PlanCard } from './components/plan-card'
import { UsageCard } from './components/usage-card'

export function Billing() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Billing</h2>
          <p className='text-muted-foreground'>
            Manage your plan, usage, and invoice history.
          </p>
        </div>

        <div className='grid gap-4 sm:gap-6 lg:grid-cols-2'>
          <PlanCard />
          <UsageCard />
        </div>

        <InvoicesTable />
      </Main>
    </>
  )
}
