import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { RolesTable } from './components/roles-table'
import { roles } from './data/roles'

export function Roles() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Roles</h2>
            <p className='text-muted-foreground'>
              Define permission sets that can be assigned to workspace members.
            </p>
          </div>
          <Button>
            <Plus className='h-4 w-4' />
            Create Role
          </Button>
        </div>

        <RolesTable roles={roles} />
      </Main>
    </>
  )
}
