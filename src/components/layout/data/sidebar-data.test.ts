import { describe, expect, it } from 'vitest'
import { sidebarData } from './sidebar-data'

const unsupportedTemplateUrls = [
  '/tasks',
  '/chats',
  '/roles',
  '/teams',
  '/projects',
  '/activity',
  '/logs',
  '/monitoring',
  '/integrations',
  '/api-keys',
  '/security',
]

describe('sidebarData', () => {
  it('does not advertise unsupported template modules', () => {
    const urls = sidebarData.navGroups.flatMap((group) =>
      group.items.map((item) => item.url)
    )

    expect(urls).not.toContain('/apps')
    expect(urls).not.toEqual(expect.arrayContaining(unsupportedTemplateUrls))
  })
})
