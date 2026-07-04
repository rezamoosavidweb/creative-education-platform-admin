import { createFileRoute } from '@tanstack/react-router'
import { requireCapabilities } from '@/lib/capabilities'
import { USER_READ_CAPABILITY } from '@/features/users/services/users-query'
import { UserDetails } from '@/features/users/user-details'

export const Route = createFileRoute('/_authenticated/users/$userId')({
  staticData: requireCapabilities(USER_READ_CAPABILITY),
  component: UserDetails,
})
