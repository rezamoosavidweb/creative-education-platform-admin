import type { AuthCapability } from '@/lib/auth'
import type {
  CapabilityGroup,
  CapabilityKey,
  UserCapabilitiesResponse,
} from '../types'

export const CAPABILITY_READ_CAPABILITY =
  'identity.capability.read' satisfies AuthCapability

export const CAPABILITY_MANAGE_CAPABILITY =
  'identity.capability.manage' satisfies AuthCapability

export function getUserCapabilityKeys(
  raw: UserCapabilitiesResponse | undefined
): CapabilityKey[] {
  return raw?.capabilities ?? []
}

export function groupCapabilities(
  capabilities: readonly CapabilityKey[]
): CapabilityGroup[] {
  const groups = new Map<string, CapabilityKey[]>()

  for (const capability of capabilities) {
    const groupName = getCapabilityGroupName(capability)
    const group = groups.get(groupName) ?? []
    group.push(capability)
    groups.set(groupName, group)
  }

  return Array.from(groups.entries())
    .map(([name, groupCapabilities]) => ({
      capabilities: [...groupCapabilities].sort(compareCapabilities),
      name,
    }))
    .sort((left, right) => left.name.localeCompare(right.name))
}

export function getCapabilityGroupName(capability: CapabilityKey): string {
  const [namespace] = capability.split('.')
  return namespace?.trim() || 'ungrouped'
}

function compareCapabilities(
  left: CapabilityKey,
  right: CapabilityKey
): number {
  return left.localeCompare(right)
}
