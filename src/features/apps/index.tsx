import { UnsupportedFeature } from '@/features/unsupported'

export function Apps() {
  return (
    <UnsupportedFeature
      title='Apps'
      eyebrow='Template app marketplace has been removed from Admin navigation.'
      emptyTitle='No app marketplace API available'
      emptyDescription='The backend does not expose a supported Admin app catalog or app connection contract.'
    />
  )
}
