import {
  Bell,
  BookOpenText,
  Building2,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  Lock,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'People & Access',
      items: [
        {
          title: 'Users',
          url: '/users',
          badge: '2.4k',
          badgeVariant: 'neutral',
          requiredCapabilities: ['identity.user.read'],
          icon: Users,
        },
        {
          title: 'Permissions',
          url: '/permissions',
          requiredCapabilities: ['identity.capability.read'],
          icon: Lock,
        },
        {
          title: 'Profiles',
          url: '/profiles',
          icon: UserCircle,
        },
        {
          title: 'Verification',
          url: '/identity-verification',
          requiredCapabilities: ['profiles.verification.review'],
          icon: ShieldCheck,
        },
        {
          title: 'Organizations',
          url: '/organizations',
          icon: Building2,
        },
      ],
    },
    {
      title: 'Configuration',
      items: [
        {
          title: 'Notifications',
          url: '/notifications',
          badge: '3',
          badgeVariant: 'destructive',
          icon: Bell,
        },
        {
          title: 'Reference',
          url: '/reference',
          icon: BookOpenText,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings,
        },
        {
          title: 'Billing',
          url: '/billing',
          icon: CreditCard,
        },
        {
          title: 'Sessions',
          url: '/sessions',
          icon: KeyRound,
        },
      ],
    },
  ],
}
