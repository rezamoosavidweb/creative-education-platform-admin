import { getInitials } from '@/lib/avatar'
import type { AuthOrganization, AuthUser } from './types'

export function getAuthUserDisplayName(
  user: AuthUser | null | undefined
): string {
  const fullName = [normalizeText(user?.firstName), normalizeText(user?.lastName)]
    .filter(Boolean)
    .join(' ')

  return fullName || normalizeText(user?.email) || 'Account'
}

export function getAuthUserGreetingName(
  user: AuthUser | null | undefined
): string {
  const firstName = normalizeText(user?.firstName)
  if (firstName) return firstName

  const displayName = getAuthUserDisplayName(user)
  if (displayName === 'Account' || displayName.includes('@')) return 'there'

  return displayName.split(/\s+/)[0] ?? 'there'
}

export function getAuthUserEmail(user: AuthUser | null | undefined): string {
  return normalizeText(user?.email) || 'account'
}

export function getAuthUserAvatar(user: AuthUser | null | undefined): string {
  return normalizeText(user?.avatar) || ''
}

export function getAuthUserInitials(
  user: AuthUser | null | undefined
): string {
  const initials = getInitials(getAuthUserDisplayName(user))
  return initials === '?' ? 'A' : initials
}

export function getAuthUserRoleLabel(
  user: AuthUser | null | undefined
): string {
  return toTitleLabel(user?.role, 'User')
}

export function getAuthOrganizationPlanLabel(
  organization: AuthOrganization | null | undefined
): string {
  return toTitleLabel(organization?.type, 'Organization')
}

function toTitleLabel(value: string | null | undefined, fallback: string): string {
  const normalized = normalizeText(value)
  if (!normalized) return fallback

  const label = normalized
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')

  return label || fallback
}

function normalizeText(value: string | null | undefined): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}
