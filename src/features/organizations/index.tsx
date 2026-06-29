import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { StatCard } from '@/components/stat-card'
import { OrganizationsTable } from './components/organizations-table'
import { organizations, orgStats } from './data/organizations'

export function Organizations() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Organizations</h2>
            <p className='text-muted-foreground'>
              Manage organizations and their plans across the workspace.
            </p>
          </div>
          <Button>
            <Plus className='h-4 w-4' />
            New Organization
          </Button>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {orgStats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              valueTone={stat.valueTone}
            />
          ))}
        </div>

        <OrganizationsTable organizations={organizations} />
      </Main>
    </>
  )
}
