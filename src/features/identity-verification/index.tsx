import { useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RequestVerificationDialog } from './components/request-verification-dialog'
import { VerificationQueueTable } from './components/verification-queue-table'

const route = getRouteApi('/_authenticated/identity-verification/')

export function IdentityVerification() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const [requestOpen, setRequestOpen] = useState(false)

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
            <h2 className='text-2xl font-bold tracking-tight'>
              Identity Verification
            </h2>
            <p className='text-muted-foreground'>
              Review profile verification requests from the backend queue.
            </p>
          </div>
          <Button type='button' onClick={() => setRequestOpen(true)}>
            <ShieldCheck className='size-4' />
            Request verification
          </Button>
        </div>

        <VerificationQueueTable search={search} navigate={navigate} />
        <RequestVerificationDialog
          open={requestOpen}
          onOpenChange={setRequestOpen}
        />
      </Main>
    </>
  )
}
