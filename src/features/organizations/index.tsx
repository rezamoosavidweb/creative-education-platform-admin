import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { StatCard } from '@/components/stat-card'
import { ThemeSwitch } from '@/components/theme-switch'
import { OrganizationsTable } from './components/organizations-table'
import { organizations, orgStats } from './data/organizations'

export function Organizations() {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

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
