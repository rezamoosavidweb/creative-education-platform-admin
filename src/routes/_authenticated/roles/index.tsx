import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/roles/')({
  component: () => (
    <PlaceholderPage
      title='Roles'
      description='Define permission sets that can be assigned to workspace members.'
    />
  ),
})
