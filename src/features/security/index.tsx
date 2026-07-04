import { UnsupportedFeature } from '@/features/unsupported'

export function Security() {
  return (
    <UnsupportedFeature
      title='Security'
      eyebrow='Template security controls have been removed from Admin navigation.'
      emptyTitle='No standalone security center API available'
      emptyDescription='The backend exposes focused auth contracts for password and sessions, but no supported two-factor or login-history Admin security-center contract.'
    />
  )
}
