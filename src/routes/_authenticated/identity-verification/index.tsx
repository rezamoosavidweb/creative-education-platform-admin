import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { requireCapabilities } from '@/lib/capabilities'
import { IdentityVerification } from '@/features/identity-verification'
import { PROFILE_VERIFICATION_REVIEW_CAPABILITY } from '@/features/identity-verification/services/verification-query'

const identityVerificationSearchSchema = z.object({
  page: z.number().optional().catch(1),
  take: z.number().optional().catch(10),
})

export const Route = createFileRoute('/_authenticated/identity-verification/')({
  validateSearch: identityVerificationSearchSchema,
  staticData: requireCapabilities(PROFILE_VERIFICATION_REVIEW_CAPABILITY),
  component: IdentityVerification,
})
