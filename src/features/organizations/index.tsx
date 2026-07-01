import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { StatCard } from '@/components/stat-card'
import { ThemeSwitch } from '@/components/theme-switch'
import { useOrganizationsList } from './hooks/use-organizations-list'
import {
  getOrganizationItems,
  getOrganizationStats,
} from './services/organizations-query'
import { CreateOrganizationDialog } from './components/create-organization-dialog'
import { OrganizationsTable } from './components/organizations-table'

const route = getRouteApi('/_authenticated/organizations/')

export function Organizations() {
  const [createOpen, setCreateOpen] = useState(false)
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const organizationsQuery = useOrganizationsList()
  const organizations = getOrganizationItems(organizationsQuery.data?.data)
  const stats = getOrganizationStats(organizations)

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Organizations</h2>
            <p className='text-muted-foreground'>
              Manage organizations, members, and teams across the workspace.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className='h-4 w-4' />
            New Organization
          </Button>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              valueTone={stat.valueTone}
            />
          ))}
        </div>

        <OrganizationsTable search={search} navigate={navigate} />
      </Main>

      <CreateOrganizationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </>
  )
}
