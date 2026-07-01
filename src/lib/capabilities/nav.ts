import type { NavGroup, NavItem } from '@/components/layout/types'
import { hasAllCapabilities } from './capability-utils'
import type { CapabilityKey } from './types'

export function filterNavGroupsByCapabilities(
  navGroups: readonly NavGroup[],
  grantedCapabilities: readonly CapabilityKey[]
): NavGroup[] {
  return navGroups
    .map((group) => ({
      ...group,
      items: group.items
        .map((item) => filterNavItemByCapabilities(item, grantedCapabilities))
        .filter((item): item is NavItem => item !== null),
    }))
    .filter((group) => group.items.length > 0)
}

function filterNavItemByCapabilities(
  item: NavItem,
  grantedCapabilities: readonly CapabilityKey[]
): NavItem | null {
  if (!hasAllCapabilities(grantedCapabilities, item.requiredCapabilities)) {
    return null
  }

  if (!item.items) return item

  const items = item.items.filter((subItem) =>
    hasAllCapabilities(grantedCapabilities, subItem.requiredCapabilities)
  )

  return items.length > 0 ? { ...item, items } : null
}
