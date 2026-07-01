import { describe, expect, it } from 'vitest'
import type { Organization, OrgMembership, Team } from '../types'
import {
  getArrayServerTableMeta,
  getMembershipStatusTone,
  getOrganizationItems,
  getOrganizationMembers,
  getOrganizationStats,
  getOrganizationTeams,
  getOrgRoleTone,
} from './organizations-query'

const organization: Organization = {
  id: 'org-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
  name: 'Creative Studio',
  type: 'STUDIO',
  disciplineIds: ['discipline-1'],
}

const membership: OrgMembership = {
  id: 'membership-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
  orgId: 'org-1',
  userId: 'user-1',
  role: 'OWNER',
  status: 'ACTIVE',
}

const team: Team = {
  id: 'team-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
  orgId: 'org-1',
  name: 'Studio Team',
}

describe('organizations query helpers', () => {
  it('normalizes array responses without fake pagination', () => {
    expect(getOrganizationItems([organization])).toEqual([organization])
    expect(getOrganizationMembers([membership])).toEqual([membership])
    expect(getOrganizationTeams([team])).toEqual([team])
    expect(getArrayServerTableMeta([organization])).toEqual({
      hasNextPage: false,
      hasPreviousPage: false,
      nextCursor: null,
      pageCount: 1,
      rowCount: 1,
    })
  })

  it('computes stats from backend organization DTOs', () => {
    expect(getOrganizationStats([organization])).toEqual([
      { id: 'total', label: 'My Organizations', value: '1' },
      { id: 'types', label: 'Organization Types', value: '1' },
      {
        id: 'disciplines',
        label: 'With Disciplines',
        value: '1',
        valueTone: 'ok',
      },
      {
        id: 'latest',
        label: 'Latest Updated',
        value: expect.any(String),
      },
    ])
  })

  it('maps generated membership statuses and roles to existing tones', () => {
    expect(getMembershipStatusTone('ACTIVE')).toBe('ok')
    expect(getMembershipStatusTone('INVITED')).toBe('warn')
    expect(getMembershipStatusTone('REMOVED')).toBe('err')
    expect(getOrgRoleTone('OWNER')).toBe('primary')
    expect(getOrgRoleTone('ADMIN')).toBe('warn')
    expect(getOrgRoleTone('MEMBER')).toBe('neutral')
  })
})
