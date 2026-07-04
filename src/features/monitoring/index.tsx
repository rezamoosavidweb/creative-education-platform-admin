import { UnsupportedFeature } from '@/features/unsupported'

export function Monitoring() {
  return (
    <UnsupportedFeature
      title='Monitoring'
      eyebrow='Template monitoring charts have been removed from Admin navigation.'
      emptyTitle='No Admin monitoring API available'
      emptyDescription='The backend exposes `/health` and Prometheus `/metrics`; the dashboard already uses supported health data, while `/metrics` is not an Admin UI contract.'
    />
  )
}
