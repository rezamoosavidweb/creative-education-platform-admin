import { describe, expect, it } from 'vitest'
import {
  getCapabilityGroupName,
  getUserCapabilityKeys,
  groupCapabilities,
} from './capabilities-query'

describe('capabilities query helpers', () => {
  it('reads backend capability keys without local DTOs', () => {
    expect(
      getUserCapabilityKeys({
        capabilities: ['course.publish', 'identity.capability.read'],
      })
    ).toEqual(['course.publish', 'identity.capability.read'])
  })

  it('groups capability keys by backend namespace', () => {
    expect(
      groupCapabilities([
        'identity.capability.read',
        'course.sell',
        'course.publish',
        'org.manage',
      ])
    ).toEqual([
      {
        capabilities: ['course.publish', 'course.sell'],
        name: 'course',
      },
      {
        capabilities: ['identity.capability.read'],
        name: 'identity',
      },
      {
        capabilities: ['org.manage'],
        name: 'org',
      },
    ])
  })

  it('keeps malformed backend keys visible instead of inventing a catalog', () => {
    expect(getCapabilityGroupName('')).toBe('ungrouped')
    expect(groupCapabilities(['jobs.post', 'custom'])).toEqual([
      { capabilities: ['custom'], name: 'custom' },
      { capabilities: ['jobs.post'], name: 'jobs' },
    ])
  })
})
