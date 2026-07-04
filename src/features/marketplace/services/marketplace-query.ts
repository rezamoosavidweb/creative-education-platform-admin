import type { PillTone } from '@/components/status-pill'
import type {
  MarketplaceApplication,
  MarketplaceApplicationStatus,
  MarketplaceContractStatus,
  MarketplaceJob,
  MarketplaceJobStatus,
  MarketplaceService,
  MarketplaceServiceStatus,
} from '../types'

export function formatMarketplaceMoney(
  amount: number | null | undefined,
  currency: string | null | undefined
): string {
  if (amount == null || !currency) return 'Not set'

  return new Intl.NumberFormat('en-US', {
    currency,
    style: 'currency',
  }).format(amount / 100)
}

export function getServiceStatusTone(
  status: MarketplaceServiceStatus
): PillTone {
  switch (status) {
    case 'PUBLISHED':
      return 'ok'
    case 'UNLISTED':
      return 'neutral'
    case 'DRAFT':
    default:
      return 'warn'
  }
}

export function getJobStatusTone(status: MarketplaceJobStatus): PillTone {
  switch (status) {
    case 'OPEN':
      return 'ok'
    case 'FILLED':
      return 'primary'
    case 'CLOSED':
      return 'neutral'
    case 'CANCELLED':
    default:
      return 'err'
  }
}

export function getApplicationStatusTone(
  status: MarketplaceApplicationStatus
): PillTone {
  switch (status) {
    case 'ACCEPTED':
      return 'ok'
    case 'SUBMITTED':
      return 'warn'
    case 'WITHDRAWN':
      return 'neutral'
    case 'REJECTED':
    default:
      return 'err'
  }
}

export function getContractStatusTone(
  status: MarketplaceContractStatus
): PillTone {
  switch (status) {
    case 'ACTIVE':
      return 'ok'
    case 'COMPLETED':
      return 'primary'
    case 'CANCELLED':
    default:
      return 'neutral'
  }
}

export function getTagCount(
  item: Pick<
    MarketplaceJob | MarketplaceService,
    'disciplineIds' | 'specializationIds' | 'genreIds' | 'skillIds'
  >
): number {
  return (
    item.disciplineIds.length +
    item.specializationIds.length +
    item.genreIds.length +
    item.skillIds.length
  )
}

export function filterMarketplaceItems<
  T extends { title: string; description?: string | null; status: string },
>(items: T[], query: string): T[] {
  const normalized = query.trim().toLowerCase()

  return items.filter((item) =>
    normalized
      ? [item.title, item.description, item.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalized))
      : true
  )
}

export function getApplicationJob(
  application: MarketplaceApplication,
  jobs: MarketplaceJob[]
): MarketplaceJob | undefined {
  return jobs.find((job) => job.id === application.jobId)
}
