import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Profiles } from '@/features/profiles'

const booleanFilterSchema = z.unknown().transform((value) => {
  if (value === true || value === 'true' || value === '"true"') return true
  if (value === false || value === 'false' || value === '"false"') return false
  return undefined
})

export const Route = createFileRoute('/_authenticated/profiles/')({
  validateSearch: z.object({
    availableForHire: booleanFilterSchema.optional().catch(undefined),
    country: z.string().optional().catch(undefined),
    page: z.number().optional().catch(1),
    take: z.number().optional().catch(10),
    verified: booleanFilterSchema.optional().catch(undefined),
  }),
  component: Profiles,
})
