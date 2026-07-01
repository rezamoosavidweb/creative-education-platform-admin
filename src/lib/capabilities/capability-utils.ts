import type {
  CapabilityKey,
  CapabilityMode,
  CapabilityRequirement,
} from './types'

export function normalizeCapabilityRequirement(
  requirement: CapabilityRequirement
): CapabilityKey[] {
  if (!requirement) return []
  return Array.isArray(requirement)
    ? [...requirement]
    : [requirement as CapabilityKey]
}

export function hasAllCapabilities(
  grantedCapabilities: readonly CapabilityKey[],
  requiredCapabilities: CapabilityRequirement
): boolean {
  const required = normalizeCapabilityRequirement(requiredCapabilities)
  if (required.length === 0) return true

  const granted = new Set(grantedCapabilities)
  return required.every((capability) => granted.has(capability))
}

export function hasAnyCapability(
  grantedCapabilities: readonly CapabilityKey[],
  requiredCapabilities: CapabilityRequirement
): boolean {
  const required = normalizeCapabilityRequirement(requiredCapabilities)
  if (required.length === 0) return true

  const granted = new Set(grantedCapabilities)
  return required.some((capability) => granted.has(capability))
}

export function canAccessWithCapabilities({
  grantedCapabilities,
  mode = 'all',
  requiredCapabilities,
}: {
  grantedCapabilities: readonly CapabilityKey[]
  mode?: CapabilityMode
  requiredCapabilities: CapabilityRequirement
}): boolean {
  return mode === 'any'
    ? hasAnyCapability(grantedCapabilities, requiredCapabilities)
    : hasAllCapabilities(grantedCapabilities, requiredCapabilities)
}

export function getMissingCapabilities(
  grantedCapabilities: readonly CapabilityKey[],
  requiredCapabilities: CapabilityRequirement
): CapabilityKey[] {
  const granted = new Set(grantedCapabilities)
  return normalizeCapabilityRequirement(requiredCapabilities).filter(
    (capability) => !granted.has(capability)
  )
}
