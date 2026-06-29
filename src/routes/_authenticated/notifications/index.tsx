import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/notifications/')({
  component: () => (
    <PlaceholderPage
      title='Notifications'
      description='Configure how and when the workspace notifies your team.'
    />
  ),
})
