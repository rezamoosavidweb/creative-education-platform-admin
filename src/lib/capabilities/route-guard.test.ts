import { describe, expect, it } from 'vitest'
import {
  getCapabilityRouteAccess,
  getRequiredCapabilitiesFromMatches,
} from './route-guard'

describe('capability route guard', () => {
  it('collects unique required capabilities from route metadata', () => {
    expect(
      getRequiredCapabilitiesFromMatches([
        { staticData: {} },
        {
          staticData: {
            requiredCapabilities: [
              'identity.capability.read',
              'identity.capability.read',
              'course.publish',
            ],
          },
        },
      ])
    ).toEqual(['identity.capability.read', 'course.publish'])
  })

  it('allows routes when all required backend capabilities are granted', () => {
    expect(
      getCapabilityRouteAccess({
        grantedCapabilities: ['identity.capability.read'],
        matches: [
          {
            staticData: {
              requiredCapabilities: ['identity.capability.read'],
            },
          },
        ],
      })
    ).toMatchObject({
      allowed: true,
      missingCapabilities: [],
      requiredCapabilities: ['identity.capability.read'],
    })
  })

  it('denies routes and reports missing backend capabilities', () => {
    expect(
      getCapabilityRouteAccess({
        grantedCapabilities: ['identity.capability.read'],
        matches: [
          {
            staticData: {
              requiredCapabilities: [
                'identity.capability.read',
                'course.publish',
              ],
            },
          },
        ],
      })
    ).toMatchObject({
      allowed: false,
      missingCapabilities: ['course.publish'],
    })
  })
})
