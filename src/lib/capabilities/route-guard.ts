import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { getMissingCapabilities, hasAllCapabilities } from './capability-utils'
import type { CapabilityKey } from './types'

type CapabilityRouteMatch = {
  staticData?: {
    requiredCapabilities?: readonly CapabilityKey[]
  }
}

export function getRequiredCapabilitiesFromMatches(
  matches: readonly CapabilityRouteMatch[]
): CapabilityKey[] {
  return [
    ...new Set(
      matches.flatMap((match) => match.staticData?.requiredCapabilities ?? [])
    ),
  ]
}

export function getCapabilityRouteAccess({
  grantedCapabilities,
  matches,
}: {
  grantedCapabilities: readonly CapabilityKey[]
  matches: readonly CapabilityRouteMatch[]
}): {
  allowed: boolean
  missingCapabilities: CapabilityKey[]
  requiredCapabilities: CapabilityKey[]
} {
  const requiredCapabilities = getRequiredCapabilitiesFromMatches(matches)

  return {
    allowed: hasAllCapabilities(grantedCapabilities, requiredCapabilities),
    missingCapabilities: getMissingCapabilities(
      grantedCapabilities,
      requiredCapabilities
    ),
    requiredCapabilities,
  }
}

export function ensureCapabilityRouteAccess(
  matches: readonly CapabilityRouteMatch[]
): void {
  const { allowed } = getCapabilityRouteAccess({
    grantedCapabilities: useAuthStore.getState().auth.capabilities,
    matches,
  })

  if (!allowed) {
    throw redirect({
      to: '/403',
    })
  }
}
