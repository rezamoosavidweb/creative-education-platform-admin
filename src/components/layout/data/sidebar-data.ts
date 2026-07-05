import {
  Bell,
  BookOpenText,
  Briefcase,
  Building2,
  CalendarDays,
  CreditCard,
  GraduationCap,
  Image,
  KeyRound,
  LayoutDashboard,
  Lock,
  Search,
  Settings,
  ShieldCheck,
  Star,
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
      title: 'Learning',
      items: [
        {
          title: 'Courses',
          url: '/courses',
          icon: GraduationCap,
        },
        {
          title: 'Events',
          url: '/events',
          icon: CalendarDays,
        },
        {
          title: 'Marketplace',
          url: '/marketplace',
          icon: Briefcase,
        },
        {
          title: 'Reviews',
          url: '/reviews',
          icon: Star,
        },
        {
          title: 'Media',
          url: '/media',
          icon: Image,
        },
      ],
    },
    {
      title: 'Discovery',
      items: [
        {
          title: 'Search',
          url: '/search',
          icon: Search,
        },
      ],
    },
    {
      title: 'Configuration',
      items: [
        {
          title: 'Notifications',
          url: '/notifications',
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
