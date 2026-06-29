import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/api-keys/')({
  component: () => (
    <PlaceholderPage
      title='API Keys'
      description='Create, rotate, and revoke API credentials.'
    />
  ),
})
