import { describe, expect, it } from 'vitest'
import type { NavGroup } from '@/components/layout/types'
import { filterNavGroupsByCapabilities } from './nav'

const navGroups: NavGroup[] = [
  {
    title: 'General',
    items: [{ title: 'Dashboard', url: '/' }],
  },
  {
    title: 'People & Access',
    items: [
      {
        title: 'Permissions',
        requiredCapabilities: ['identity.capability.read'],
        url: '/permissions',
      },
      {
        title: 'Users',
        url: '/users',
      },
    ],
  },
  {
    title: 'Admin Only',
    items: [
      {
        title: 'Nested',
        items: [
          {
            title: 'Capability Grants',
            requiredCapabilities: ['identity.capability.read'],
            url: '/permissions',
          },
        ],
      },
    ],
  },
]

describe('capability-aware navigation', () => {
  it('keeps unrestricted nav items visible', () => {
    const filtered = filterNavGroupsByCapabilities(navGroups, [])

    expect(filtered.map((group) => group.title)).toEqual([
      'General',
      'People & Access',
    ])
    expect(filtered[1].items.map((item) => item.title)).toEqual(['Users'])
  })

  it('shows capability-protected nav items when backend grants the key', () => {
    const filtered = filterNavGroupsByCapabilities(navGroups, [
      'identity.capability.read',
    ])

    expect(filtered.map((group) => group.title)).toEqual([
      'General',
      'People & Access',
      'Admin Only',
    ])
    expect(filtered[1].items.map((item) => item.title)).toEqual([
      'Permissions',
      'Users',
    ])
  })
})
