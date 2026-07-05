import { describe, expect, it } from 'vitest'
import type {
  CommunityCollaboration,
  CommunityGroup,
  CommunityInvitation,
  CommunityMember,
  CommunitySession,
} from '../types'
import {
  filterCollaborations,
  filterGroups,
  filterSessions,
  formatCommunityDate,
  getCollaborationTone,
  getInvitationTone,
  getMemberTone,
  parseParticipantIds,
} from './community-query'

const group = {
  bio: 'Piano study circle',
  createdAt: '2026-01-01T00:00:00.000Z',
  id: 'group-1',
  name: 'Piano Group',
  updatedAt: '2026-01-01T00:00:00.000Z',
} satisfies CommunityGroup

const collaboration = {
  createdAt: '2026-01-01T00:00:00.000Z',
  creatorUserId: 'user-1',
  id: 'collaboration-1',
  name: 'Quartet',
  participantIds: ['user-2'],
  status: 'ACTIVE',
  updatedAt: '2026-01-01T00:00:00.000Z',
} satisfies CommunityCollaboration

const session = {
  createdAt: '2026-01-01T00:00:00.000Z',
  creatorUserId: 'user-1',
  id: 'session-1',
  isOnline: true,
  location: null,
  participantIds: ['user-2'],
  scheduledAt: '2026-01-02T00:00:00.000Z',
  title: 'Practice',
  updatedAt: '2026-01-01T00:00:00.000Z',
} satisfies CommunitySession

describe('community-query', () => {
  it('filters community records by searchable fields', () => {
    expect(filterGroups([group], 'piano')).toEqual([group])
    expect(filterGroups([group], 'guitar')).toEqual([])
    expect(filterCollaborations([collaboration], 'quartet')).toEqual([
      collaboration,
    ])
    expect(filterCollaborations([collaboration], 'missing')).toEqual([])
    expect(filterSessions([session], 'practice')).toEqual([session])
    expect(filterSessions([session], 'offline')).toEqual([])
  })

  it('maps backend statuses to status tones', () => {
    expect(
      getInvitationTone('PENDING' satisfies CommunityInvitation['status'])
    ).toBe('warn')
    expect(getInvitationTone('ACCEPTED')).toBe('ok')
    expect(getInvitationTone('DECLINED')).toBe('neutral')
    expect(getMemberTone('ACTIVE' satisfies CommunityMember['status'])).toBe(
      'ok'
    )
    expect(getMemberTone('REMOVED')).toBe('neutral')
    expect(getCollaborationTone('ACTIVE')).toBe('ok')
    expect(getCollaborationTone('COMPLETED')).toBe('neutral')
    expect(getCollaborationTone('CANCELLED')).toBe('err')
  })

  it('formats dates and parses participant IDs', () => {
    expect(formatCommunityDate('2026-01-02T00:00:00.000Z')).toContain('2026')
    expect(parseParticipantIds('user-1\n\n user-2 ')).toEqual([
      'user-1',
      'user-2',
    ])
  })
})
