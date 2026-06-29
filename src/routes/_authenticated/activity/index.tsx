import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/activity/')({
  component: () => (
    <PlaceholderPage
      title='Activity'
      description='A real-time timeline of everything happening in your workspace.'
    />
  ),
})
