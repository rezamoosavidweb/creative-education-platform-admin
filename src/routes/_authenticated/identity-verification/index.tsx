import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { IdentityVerification } from '@/features/identity-verification'

const identityVerificationSearchSchema = z.object({
  page: z.number().optional().catch(1),
  take: z.number().optional().catch(10),
})

export const Route = createFileRoute(
  '/_authenticated/identity-verification/'
)({
  validateSearch: identityVerificationSearchSchema,
  component: IdentityVerification,
})
