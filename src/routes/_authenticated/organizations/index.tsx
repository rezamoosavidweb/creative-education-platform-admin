import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Organizations } from '@/features/organizations'

export const Route = createFileRoute('/_authenticated/organizations/')({
  validateSearch: z.object({
    page: z.number().optional().catch(1),
    take: z.number().optional().catch(10),
  }),
  component: Organizations,
})
