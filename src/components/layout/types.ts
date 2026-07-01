import { type LinkProps } from '@tanstack/react-router'
import type { CapabilityRequirement } from '@/lib/capabilities'

type NavBadgeVariant = 'primary' | 'destructive' | 'neutral'

type BaseNavItem = {
  title: string
  badge?: string
  badgeVariant?: NavBadgeVariant
  requiredCapabilities?: CapabilityRequirement
  icon?: React.ElementType
}

type NavLink = BaseNavItem & {
  url: LinkProps['to'] | (string & {})
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] | (string & {}) })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

type NavGroup = {
  title: string
  items: NavItem[]
}

type SidebarData = {
  navGroups: NavGroup[]
}

export type {
  SidebarData,
  NavGroup,
  NavItem,
  NavCollapsible,
  NavLink,
  NavBadgeVariant,
}
