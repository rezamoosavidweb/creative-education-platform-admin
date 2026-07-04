import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { requireCapabilities } from '@/lib/capabilities'
import { Users } from '@/features/users'
import {
  normalizeUsersOrder,
  USER_READ_CAPABILITY,
} from '@/features/users/services/users-query'

const usersSearchSchema = z.object({
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

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: usersSearchSchema,
  staticData: requireCapabilities(USER_READ_CAPABILITY),
  component: Users,
})
