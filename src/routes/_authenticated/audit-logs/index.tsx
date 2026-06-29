import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/audit-logs/')({
  component: () => (
    <PlaceholderPage
      title='Audit Logs'
      description='Security-relevant events and administrative changes.'
    />
  ),
})
