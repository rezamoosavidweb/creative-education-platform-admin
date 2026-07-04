import { UnsupportedFeature } from '@/features/unsupported'

export function Teams() {
  return (
    <UnsupportedFeature
      title='Teams'
      eyebrow='Template team administration has been removed from Admin navigation.'
      emptyTitle='No global teams API available'
      emptyDescription='Organization teams are available only through organization-scoped contracts, not as a standalone global Admin teams module.'
    />
  )
}
