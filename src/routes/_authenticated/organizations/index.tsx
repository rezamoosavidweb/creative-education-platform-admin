import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/organizations/')({
  component: () => (
    <PlaceholderPage
      title='Organizations'
      description='Manage organizations and their plans across the workspace.'
    />
  ),
})
