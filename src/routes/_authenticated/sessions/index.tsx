import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/sessions/')({
  component: () => (
    <PlaceholderPage
      title='Sessions'
      description='Review and revoke active sessions across your devices.'
    />
  ),
})
