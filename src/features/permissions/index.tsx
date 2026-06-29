import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PermissionMatrix } from './components/permission-matrix'
import { permissionRoles, permissions } from './data/permissions'

export function Permissions() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Permissions</h2>
            <p className='text-muted-foreground'>
              Full permission matrix across all workspace roles.
            </p>
          </div>
          <Button variant='outline'>
            <Download className='h-4 w-4' />
            Export
          </Button>
        </div>

        <PermissionMatrix roles={permissionRoles} permissions={permissions} />
      </Main>
    </>
  )
}
