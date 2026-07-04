import { UnsupportedFeature } from '@/features/unsupported'

export function Activity() {
  return (
    <UnsupportedFeature
      title='Activity'
      eyebrow='Template activity feeds have been removed from Admin navigation.'
      emptyTitle='No Admin activity feed API available'
      emptyDescription='The backend does not expose a supported cross-domain activity feed contract for Admin.'
    />
  )
}
