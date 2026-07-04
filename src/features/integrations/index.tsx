import { UnsupportedFeature } from '@/features/unsupported'

export function Integrations() {
  return (
    <UnsupportedFeature
      title='Integrations'
      eyebrow='Template integrations have been removed from Admin navigation.'
      emptyTitle='No integration management API available'
      emptyDescription='The backend has an internal integration-event bus, but no supported Admin integration configuration contract.'
    />
  )
}
