import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ApiKeysTable } from './components/api-keys-table'
import { apiKeys } from './data/api-keys'

export function ApiKeys() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>API Keys</h2>
            <p className='text-muted-foreground'>
              Create, rotate, and revoke API credentials.
            </p>
          </div>
          <Button>
            <Plus className='h-4 w-4' />
            Create API Key
          </Button>
        </div>

        <ApiKeysTable apiKeys={apiKeys} />
      </Main>
    </>
  )
}
