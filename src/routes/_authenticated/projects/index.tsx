import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/projects/')({
  component: () => (
    <PlaceholderPage
      title='Projects'
      description='Track active, completed, and archived workspace projects.'
    />
  ),
})
