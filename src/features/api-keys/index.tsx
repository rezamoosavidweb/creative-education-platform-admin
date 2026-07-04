import { UnsupportedFeature } from '@/features/unsupported'

export function ApiKeys() {
  return (
    <UnsupportedFeature
      title='API Keys'
      eyebrow='Template developer keys have been removed from Admin navigation.'
      emptyTitle='No API key management API available'
      emptyDescription='The backend does not expose a supported API key listing, creation, rotation, or revocation contract.'
    />
  )
}
