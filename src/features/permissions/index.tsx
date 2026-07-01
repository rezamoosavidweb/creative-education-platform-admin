import { useCallback, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CapabilityAssignmentDialog } from './components/capability-assignment-dialog'
import { CapabilityUsersTable } from './components/capability-users-table'
import type { CapabilityUser } from './types'

const route = getRouteApi('/_authenticated/permissions/')

export function Permissions() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [selectedUser, setSelectedUser] = useState<CapabilityUser | null>(null)
  const dialogOpen = !!selectedUser
  const handleManageUser = useCallback((user: CapabilityUser) => {
    setSelectedUser(user)
  }, [])

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
            <h2 className='text-2xl font-bold tracking-tight'>Permissions</h2>
            <p className='text-muted-foreground'>
              Manage backend capability grants for platform users.
            </p>
          </div>
        </div>

        <CapabilityUsersTable
          search={search}
          navigate={navigate}
          onManageUser={handleManageUser}
        />
        <CapabilityAssignmentDialog
          open={dialogOpen}
          user={selectedUser}
          onOpenChange={(open) => {
            if (!open) setSelectedUser(null)
          }}
        />
      </Main>
    </>
  )
}
