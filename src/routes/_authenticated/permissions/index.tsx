import { createFileRoute } from '@tanstack/react-router'
import { requireCapabilities } from '@/lib/capabilities'
import { Permissions } from '@/features/permissions'

export const Route = createFileRoute('/_authenticated/permissions/')({
  staticData: requireCapabilities('identity.capability.read'),
  component: Permissions,
})
