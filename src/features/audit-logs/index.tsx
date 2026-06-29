import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { AuditLogsTable } from './components/audit-logs-table'
import { auditLogs } from './data/audit-logs'

export function AuditLogs() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Audit Logs</h2>
            <p className='text-muted-foreground'>
              Security-relevant events and administrative changes.
            </p>
          </div>
          <Button variant='outline'>
            <Download className='h-4 w-4' />
            Export
          </Button>
        </div>

        <AuditLogsTable logs={auditLogs} />
      </Main>
    </>
  )
}
