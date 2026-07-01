import { useContext } from 'react'
import { useCurrentCapabilities } from '@/lib/auth/auth-hooks'
import { CapabilityContext } from './capability-context-value'
import { hasAllCapabilities, hasAnyCapability } from './capability-utils'
import type {
  CapabilityKey,
  CapabilityMode,
  CapabilityRequirement,
} from './types'

export function useCapabilities(): readonly CapabilityKey[] {
  const contextCapabilities = useContext(CapabilityContext)
  const storeCapabilities = useCurrentCapabilities()
  return contextCapabilities ?? storeCapabilities
}

export function useHasAll(
  requiredCapabilities: CapabilityRequirement
): boolean {
  return hasAllCapabilities(useCapabilities(), requiredCapabilities)
}

export function useHasAny(
  requiredCapabilities: CapabilityRequirement
): boolean {
  return hasAnyCapability(useCapabilities(), requiredCapabilities)
}

export function useCapability(capability: CapabilityKey): boolean {
  return useHasAll(capability)
}

export function useCan(
  requiredCapabilities: CapabilityRequirement,
  mode: CapabilityMode = 'all'
): boolean {
  const hasAll = useHasAll(requiredCapabilities)
  const hasAny = useHasAny(requiredCapabilities)

  return mode === 'any' ? hasAny : hasAll
}
