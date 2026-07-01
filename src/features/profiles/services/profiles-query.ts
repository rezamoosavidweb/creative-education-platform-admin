import { createQueryKey } from '@/lib/query'
import type { ServerTableMeta } from '@/components/data-table'
import type { PillTone } from '@/components/status-pill'
import type {
  DirectoryEntry,
  DirectoryQuery,
  DirectoryResponse,
  Profile,
  VerificationStatus,
} from '../types'

export const profileQueryKeys = {
  directory: () => createQueryKey('profiles', 'directory'),
  directoryQuery: (query: DirectoryQuery) =>
    createQueryKey('profiles', 'directory', query),
}

export type ProfileStat = {
  id: string
  label: string
  value: string
  foot?: string
  footTone?: 'ok' | 'warn' | 'err' | 'muted'
}

export function normalizeDirectoryQuery(
  query: DirectoryQuery | undefined
): DirectoryQuery {
  return stripEmptyValues({
    availableForHire: normalizeBooleanString(query?.availableForHire),
    country: query?.country,
    disciplineId: query?.disciplineId,
    genreId: query?.genreId,
    skillId: query?.skillId,
    specializationId: query?.specializationId,
    verified: normalizeBooleanString(query?.verified),
  })
}

export function getDirectoryEntries(
  raw: DirectoryResponse | undefined
): DirectoryEntry[] {
  return raw ?? []
}

export function getDirectoryTableMeta(
  entries: readonly DirectoryEntry[]
): ServerTableMeta {
  return {
    hasNextPage: false,
    hasPreviousPage: false,
    nextCursor: null,
    pageCount: entries.length > 0 ? 1 : 0,
    rowCount: entries.length,
  }
}

export function getProfileStats({
  directoryEntries,
  instructorProfile,
  practitionerProfile,
  profile,
  studioProfile,
}: {
  directoryEntries: readonly DirectoryEntry[]
  instructorProfile?: unknown
  practitionerProfile?: unknown
  profile?: Profile
  studioProfile?: unknown
}): ProfileStat[] {
  const publishedCount = directoryEntries.filter(
    (entry) => entry.handle === profile?.handle
  ).length
  const personaCount = [
    practitionerProfile,
    instructorProfile,
    studioProfile,
  ].filter(Boolean).length

  return [
    {
      id: 'directory',
      label: 'Directory Profiles',
      value: directoryEntries.length.toLocaleString(),
      foot: 'Matching published profiles',
    },
    {
      id: 'published',
      label: 'My Profile',
      value: profile?.published ? 'Published' : 'Private',
      foot: profile?.handle ? `@${profile.handle}` : 'No current profile',
      footTone: profile?.published ? 'ok' : 'warn',
    },
    {
      id: 'public',
      label: 'Directory Match',
      value: publishedCount.toLocaleString(),
      foot: 'Current handle in results',
    },
    {
      id: 'personas',
      label: 'Persona Profiles',
      value: personaCount.toLocaleString(),
      foot: 'Practitioner, instructor, studio',
    },
  ]
}

export function getVerificationStatusTone(
  status: VerificationStatus
): PillTone {
  if (status === 'VERIFIED') return 'ok'
  if (status === 'PENDING') return 'warn'
  if (status === 'REJECTED') return 'err'
  return 'neutral'
}

export function formatProfileDateTime(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function normalizeBooleanString(value: unknown): string | undefined {
  if (value === true || value === 'true') return 'true'
  if (value === false || value === 'false') return 'false'
  return undefined
}

function stripEmptyValues<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (typeof entry === 'string') return entry.trim().length > 0
      return entry !== undefined && entry !== null
    })
  ) as T
}
