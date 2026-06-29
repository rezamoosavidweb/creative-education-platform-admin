import { createFileRoute } from '@tanstack/react-router'
import { PlaceholderPage } from '@/components/placeholder-page'

export const Route = createFileRoute('/_authenticated/security/')({
  component: () => (
    <PlaceholderPage
      title='Security'
      description='Passwords, two-factor authentication, and login history.'
    />
  ),
})
