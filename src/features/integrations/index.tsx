import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { IntegrationCard } from './components/integration-card'
import { integrations } from './data/integrations'

export function Integrations() {
  return (
    <>
      <Header fixed />

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Integrations</h2>
          <p className='text-muted-foreground'>
            Connect third-party apps and services to your workspace.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {integrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      </Main>
    </>
  )
}
