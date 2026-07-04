import { FileSearch } from 'lucide-react'
import { ApiEmpty } from '@/components/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

export function AuditLogs() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Audit Logs</h2>
          <p className='text-muted-foreground'>
            Backend audit events are currently emitted to structured logs only.
          </p>
        </div>

        <div className='rounded-md border bg-[var(--sur)] p-6'>
          <FileSearch className='mx-auto mb-3 size-8 text-muted-foreground' />
          <ApiEmpty
            title='No audit log API available'
            description='The backend does not expose a supported audit-log listing or export endpoint yet.'
          />
        </div>
      </Main>
    </>
  )
}
