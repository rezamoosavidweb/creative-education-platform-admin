import type { PillTone } from '@/components/status-pill'
import type {
  CommunityCollaboration,
  CommunityGroup,
  CommunityInvitation,
  CommunityMember,
  CommunitySession,
} from '../types'

export function formatCommunityDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function getInvitationTone(
  status: CommunityInvitation['status']
): PillTone {
  switch (status) {
    case 'ACCEPTED':
      return 'ok'
    case 'DECLINED':
      return 'neutral'
    case 'PENDING':
    default:
      return 'warn'
  }
}

export function getMemberTone(status: CommunityMember['status']): PillTone {
  switch (status) {
    case 'ACTIVE':
      return 'ok'
    case 'REMOVED':
    default:
      return 'neutral'
  }
}

export function getCollaborationTone(
  status: CommunityCollaboration['status']
): PillTone {
  switch (status) {
    case 'ACTIVE':
      return 'ok'
    case 'COMPLETED':
      return 'neutral'
    case 'CANCELLED':
      return 'err'
    default:
      return 'warn'
  }
}

export function filterGroups(
  groups: CommunityGroup[],
  query: string
): CommunityGroup[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return groups

  return groups.filter((group) =>
    [group.name, group.bio]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalized))
  )
}

export function filterCollaborations(
  collaborations: CommunityCollaboration[],
  query: string
): CommunityCollaboration[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return collaborations

  return collaborations.filter((collaboration) =>
    [collaboration.name, collaboration.status, collaboration.creatorUserId]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalized))
  )
}

export function filterSessions(
  sessions: CommunitySession[],
  query: string
): CommunitySession[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return sessions

  return sessions.filter((session) =>
    [session.title, session.location, session.creatorUserId]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(normalized))
  )
}

export function parseParticipantIds(value: string): string[] {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}
