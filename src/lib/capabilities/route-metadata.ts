import { normalizeCapabilityRequirement } from './capability-utils'
import type { CapabilityKey, CapabilityRequirement } from './types'

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    requiredCapabilities?: CapabilityKey[]
  }
}

export type CapabilityRouteStaticData = {
  requiredCapabilities?: CapabilityKey[]
}

export function requireCapabilities(
  requiredCapabilities: CapabilityRequirement
): CapabilityRouteStaticData {
  return {
    requiredCapabilities: normalizeCapabilityRequirement(requiredCapabilities),
  }
}
