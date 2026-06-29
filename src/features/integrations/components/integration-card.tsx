import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { StatusPill } from '@/components/status-pill'
import { type Integration } from '../data/integrations'

type IntegrationCardProps = {
  integration: Integration
}

export const IntegrationCard = memo(function IntegrationCard({
  integration,
}: IntegrationCardProps) {
  const connected = integration.status === 'Connected'
  return (
    <div className='flex flex-col rounded-[10px] border border-[var(--bdr)] bg-[var(--sur)] p-5'>
      <div className='flex items-start justify-between'>
        <div
          className='flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold text-white'
          style={{ backgroundColor: integration.color }}
          aria-hidden
        >
          {integration.name.slice(0, 1)}
        </div>
        <StatusPill tone={connected ? 'ok' : 'neutral'}>
          {integration.status}
        </StatusPill>
      </div>

      <h3 className='mt-3 font-semibold text-[var(--t1)]'>{integration.name}</h3>
      <p className='mt-1 flex-1 text-[12.5px] leading-relaxed text-[var(--t2)]'>
        {integration.description}
      </p>

      <div className='mt-4'>
        <Button variant={connected ? 'outline' : 'default'} className='w-full'>
          {connected ? 'Disconnect' : 'Connect'}
        </Button>
      </div>
    </div>
  )
})
IntegrationCard.displayName = 'IntegrationCard'
