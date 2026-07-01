import { describe, expect, it } from 'vitest'
import type { AuthOrganization, AuthUser } from './types'
import {
  getAuthOrganizationPlanLabel,
  getAuthUserAvatar,
  getAuthUserDisplayName,
  getAuthUserEmail,
  getAuthUserGreetingName,
  getAuthUserInitials,
  getAuthUserRoleLabel,
} from './current-user-display'

const sampleUser: AuthUser = {
  id: 'user-1',
  avatar: 'https://example.com/avatar.png',
  createdAt: '2026-01-01T00:00:00.000Z',
  email: 'jordan@example.com',
  firstName: 'Jordan',
  lastName: 'Davis',
  role: 'ADMIN',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

const sampleOrganization: AuthOrganization = {
  id: 'org-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  disciplineIds: [],
  name: 'Creative Studio',
  type: 'STUDIO',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('current user display helpers', () => {
  it('formats current user identity from the generated UserDto fields', () => {
    expect(getAuthUserDisplayName(sampleUser)).toBe('Jordan Davis')
    expect(getAuthUserGreetingName(sampleUser)).toBe('Jordan')
    expect(getAuthUserEmail(sampleUser)).toBe('jordan@example.com')
    expect(getAuthUserAvatar(sampleUser)).toBe('https://example.com/avatar.png')
    expect(getAuthUserInitials(sampleUser)).toBe('JD')
    expect(getAuthUserRoleLabel(sampleUser)).toBe('Admin')
  })

  it('falls back without inventing profile fields', () => {
    const emailOnlyUser: AuthUser = {
      ...sampleUser,
      avatar: null,
      email: 'account@example.com',
      firstName: null,
      lastName: null,
      role: undefined,
    }

    expect(getAuthUserDisplayName(emailOnlyUser)).toBe('account@example.com')
    expect(getAuthUserGreetingName(emailOnlyUser)).toBe('there')
    expect(getAuthUserAvatar(emailOnlyUser)).toBe('')
    expect(getAuthUserInitials(emailOnlyUser)).toBe('AC')
    expect(getAuthUserRoleLabel(emailOnlyUser)).toBe('User')
  })

  it('formats current organization labels from the generated OrganizationDto type', () => {
    expect(getAuthOrganizationPlanLabel(sampleOrganization)).toBe('Studio')
    expect(getAuthOrganizationPlanLabel(null)).toBe('Organization')
  })
})
