import { UnsupportedFeature } from '@/features/unsupported'

export function Projects() {
  return (
    <UnsupportedFeature
      title='Projects'
      eyebrow='Template project tracking has been removed from Admin navigation.'
      emptyTitle='No Admin projects API available'
      emptyDescription='The backend exposes domain-specific courses, events, services, jobs, and collaborations, but no generic Admin projects contract.'
    />
  )
}
