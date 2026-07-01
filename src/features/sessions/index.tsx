import { getRouteApi } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { SessionsList } from './components/sessions-list'

const route = getRouteApi('/_authenticated/sessions/')

export function Sessions() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Sessions</h2>
          <p className='text-muted-foreground'>
            Review and revoke active sessions across your devices.
          </p>
        </div>

        <SessionsList search={search} navigate={navigate} />
      </Main>
    </>
  )
}
