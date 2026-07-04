import { UnsupportedFeature } from '@/features/unsupported'

export function Tasks() {
  return (
    <UnsupportedFeature
      title='Tasks'
      eyebrow='Template task management has been removed from Admin navigation.'
      emptyTitle='No Admin tasks API available'
      emptyDescription='The backend does not expose a supported task-management contract for this Admin surface.'
    />
  )
}
