import { UnsupportedFeature } from '@/features/unsupported'

export function Roles() {
  return (
    <UnsupportedFeature
      title='Roles'
      eyebrow='Template role administration has been removed from Admin navigation.'
      emptyTitle='No role catalog API available'
      emptyDescription='The backend exposes role assignment through user identity contracts, but no supported role listing or role-management contract.'
    />
  )
}
