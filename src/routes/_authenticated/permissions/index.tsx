import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { requireCapabilities } from '@/lib/capabilities'
import { Permissions } from '@/features/permissions'
import { normalizeUsersOrder } from '@/features/users/services/users-query'
import {
  CAPABILITY_MANAGEMENT_CAPABILITY,
} from '@/features/permissions/services/capabilities-query'

const permissionsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  take: z.number().optional().catch(10),
  q: z.string().optional().catch(''),
  order: z
    .unknown()
    .transform((value) => normalizeUsersOrder(value))
    .optional()
    .catch(undefined),
  sortBy: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/permissions/')({
  validateSearch: permissionsSearchSchema,
  staticData: requireCapabilities(CAPABILITY_MANAGEMENT_CAPABILITY),
  component: Permissions,
})
