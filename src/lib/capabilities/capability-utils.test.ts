import { describe, expect, it } from 'vitest'
import {
  canAccessWithCapabilities,
  getMissingCapabilities,
  hasAllCapabilities,
  hasAnyCapability,
  normalizeCapabilityRequirement,
} from './capability-utils'

describe('capability utilities', () => {
  it('normalizes backend capability keys without creating local models', () => {
    expect(normalizeCapabilityRequirement('identity.capability.read')).toEqual([
      'identity.capability.read',
    ])
    expect(
      normalizeCapabilityRequirement(['course.publish', 'course.sell'])
    ).toEqual(['course.publish', 'course.sell'])
    expect(normalizeCapabilityRequirement(undefined)).toEqual([])
  })

  it('allows unrestricted surfaces when no capability is declared', () => {
    expect(hasAllCapabilities([], undefined)).toBe(true)
    expect(hasAnyCapability([], [])).toBe(true)
  })

  it('requires every capability by default', () => {
    expect(
      hasAllCapabilities(
        ['identity.capability.read', 'course.publish'],
        ['identity.capability.read', 'course.publish']
      )
    ).toBe(true)
    expect(
      hasAllCapabilities(
        ['identity.capability.read'],
        ['identity.capability.read', 'course.publish']
      )
    ).toBe(false)
  })

  it('supports any-capability checks for shared primitives', () => {
    expect(
      canAccessWithCapabilities({
        grantedCapabilities: ['course.publish'],
        mode: 'any',
        requiredCapabilities: ['identity.capability.read', 'course.publish'],
      })
    ).toBe(true)
  })

  it('reports missing backend capability keys', () => {
    expect(
      getMissingCapabilities(
        ['identity.capability.read'],
        ['identity.capability.read', 'course.publish']
      )
    ).toEqual(['course.publish'])
  })
})
