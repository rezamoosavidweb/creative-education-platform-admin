import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Sessions } from '@/features/sessions'

const sessionsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  take: z.number().optional().catch(10),
})

export const Route = createFileRoute('/_authenticated/sessions/')({
  validateSearch: sessionsSearchSchema,
  component: Sessions,
})
