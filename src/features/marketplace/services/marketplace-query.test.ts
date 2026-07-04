import { describe, expect, it } from 'vitest'
import {
  filterMarketplaceItems,
  formatMarketplaceMoney,
  getApplicationStatusTone,
  getContractStatusTone,
  getJobStatusTone,
  getServiceStatusTone,
  getTagCount,
} from './marketplace-query'

describe('marketplace-query', () => {
  it('formats money and maps status tones', () => {
    expect(formatMarketplaceMoney(null, 'USD')).toBe('Not set')
    expect(formatMarketplaceMoney(2500, 'USD')).toBe('$25.00')
    expect(getServiceStatusTone('PUBLISHED')).toBe('ok')
    expect(getJobStatusTone('OPEN')).toBe('ok')
    expect(getApplicationStatusTone('SUBMITTED')).toBe('warn')
    expect(getContractStatusTone('COMPLETED')).toBe('primary')
  })

  it('filters items and counts taxonomy tags', () => {
    const item = {
      description: 'Mixing session',
      disciplineIds: ['d1'],
      genreIds: ['g1'],
      skillIds: [],
      specializationIds: ['s1'],
      status: 'PUBLISHED',
      title: 'Studio Mix',
    }

    expect(filterMarketplaceItems([item], 'mix')).toEqual([item])
    expect(filterMarketplaceItems([item], 'nope')).toEqual([])
    expect(getTagCount(item)).toBe(3)
  })
})
