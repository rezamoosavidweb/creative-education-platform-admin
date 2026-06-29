import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/billing/')({
  component: () => (
    <PlaceholderPage
      title='Billing'
      description='Manage your plan, usage, and invoice history.'
    />
  ),
})
