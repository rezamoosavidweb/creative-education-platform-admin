import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Reference } from '@/features/reference'
import { referenceCatalogIds } from '@/features/reference/types'

export const Route = createFileRoute('/_authenticated/reference/')({
  validateSearch: z.object({
    catalog: z.enum(referenceCatalogIds).optional().catch('disciplines'),
    disciplineId: z.string().optional().catch(undefined),
    page: z.number().optional().catch(1),
    take: z.number().optional().catch(10),
  }),
  component: Reference,
})
