import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { WorkspaceSettings } from './components/workspace-settings'

export function Settings() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='mx-auto w-full max-w-[880px]'>
          <h2 className='text-2xl font-bold tracking-tight'>Settings</h2>
          <p className='text-muted-foreground'>
            Configure workspace preferences, security policies, and
            integrations.
          </p>
        </div>

        <WorkspaceSettings />
      </Main>
    </>
  )
}
