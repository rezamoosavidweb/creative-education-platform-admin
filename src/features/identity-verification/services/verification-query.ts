import type { AuthCapability } from '@/lib/auth'
import type { ServerTableMeta } from '@/components/data-table'
import type { PillTone } from '@/components/status-pill'
import type {
  ProfileVerification,
  VerificationQueueResponse,
  VerificationStatus,
} from '../types'

export const PROFILE_VERIFICATION_REVIEW_CAPABILITY =
  'profiles.verification.review' satisfies AuthCapability

export function getVerificationQueueItems(
  raw: VerificationQueueResponse | undefined
): ProfileVerification[] {
  return raw ?? []
}

export function getVerificationQueueMeta(
  items: readonly ProfileVerification[]
): ServerTableMeta {
  return {
    hasNextPage: false,
    hasPreviousPage: false,
    nextCursor: null,
    pageCount: items.length > 0 ? 1 : 0,
    rowCount: items.length,
  }
}

export function getVerificationStatusTone(
  status: VerificationStatus
): PillTone {
  if (status === 'VERIFIED') return 'ok'
  if (status === 'PENDING') return 'warn'
  if (status === 'REJECTED') return 'err'
  return 'neutral'
}

export function formatVerificationDateTime(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
