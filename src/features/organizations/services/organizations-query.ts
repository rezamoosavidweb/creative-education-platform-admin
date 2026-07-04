import type { ServerTableMeta } from '@/components/data-table'
import type {
  MembershipStatus,
  Organization,
  OrgMembership,
  OrgRole,
  Team,
} from '../types'

const ORG_TYPES = [
  'SCHOOL',
  'ACADEMY',
  'LABEL',
  'AGENCY',
  'STUDIO',
  'COMPANY',
  'ORCHESTRA',
  'VENUE',
  'COLLECTIVE',
] as const satisfies readonly Organization['type'][]

const ORG_ROLES = [
  'OWNER',
  'ADMIN',
  'MEMBER',
] as const satisfies readonly OrgRole[]

export const ORG_TYPE_OPTIONS: {
  label: string
  value: Organization['type']
}[] = ORG_TYPES.map((value) => ({ label: formatEnumLabel(value), value }))

export const ORG_ROLE_OPTIONS: { label: string; value: OrgRole }[] =
  ORG_ROLES.map((value) => ({ label: formatEnumLabel(value), value }))

type StatTone = 'default' | 'ok'

export type OrganizationStat = {
  id: string
  label: string
  value: string
  valueTone?: StatTone
}

export function getOrganizationItems(
  raw: Organization[] | null | undefined
): Organization[] {
  return raw ?? []
}

export function getOrganizationMembers(
  raw: OrgMembership[] | null | undefined
): OrgMembership[] {
  return raw ?? []
}

export function getOrganizationTeams(raw: Team[] | null | undefined): Team[] {
  return raw ?? []
}

export function getArrayServerTableMeta(
  items: readonly unknown[]
): ServerTableMeta {
  return {
    hasNextPage: false,
    hasPreviousPage: false,
    nextCursor: null,
    pageCount: items.length > 0 ? 1 : 0,
    rowCount: items.length,
  }
}

export function getOrganizationStats(
  organizations: readonly Organization[]
): OrganizationStat[] {
  const types = new Set(organizations.map((organization) => organization.type))
  const withDisciplines = organizations.filter(
    (organization) => organization.disciplineIds.length > 0
  )
  const latest = getLatestOrganization(organizations)

  return [
    {
      id: 'total',
      label: 'My Organizations',
      value: organizations.length.toLocaleString(),
    },
    {
      id: 'types',
      label: 'Organization Types',
      value: types.size.toLocaleString(),
    },
    {
      id: 'disciplines',
      label: 'With Disciplines',
      value: withDisciplines.length.toLocaleString(),
      valueTone: withDisciplines.length > 0 ? 'ok' : undefined,
    },
    {
      id: 'latest',
      label: 'Latest Updated',
      value: latest ? formatOrganizationDate(latest.updatedAt) : 'None',
    },
  ]
}

export function getMembershipStatusTone(
  status: MembershipStatus
): 'err' | 'neutral' | 'ok' | 'warn' {
  if (status === 'ACTIVE') return 'ok'
  if (status === 'INVITED') return 'warn'
  if (status === 'REMOVED') return 'err'
  return 'neutral'
}

export function getOrgRoleTone(role: OrgRole): 'neutral' | 'primary' | 'warn' {
  if (role === 'OWNER') return 'primary'
  if (role === 'ADMIN') return 'warn'
  return 'neutral'
}

export function formatOrganizationDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatOrganizationDateTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function getLatestOrganization(
  organizations: readonly Organization[]
): Organization | null {
  return organizations.reduce<Organization | null>((latest, organization) => {
    if (!latest) return organization

    return new Date(organization.updatedAt).getTime() >
      new Date(latest.updatedAt).getTime()
      ? organization
      : latest
  }, null)
}

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
