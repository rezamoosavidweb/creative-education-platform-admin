import { UnsupportedFeature } from '@/features/unsupported'

export function Chats() {
  return (
    <UnsupportedFeature
      title='Chat'
      eyebrow='Template chat has been removed from Admin navigation.'
      emptyTitle='No Admin chat API available'
      emptyDescription='The backend does not expose a supported Admin chat or messaging contract.'
    />
  )
}
