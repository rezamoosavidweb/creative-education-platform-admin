import {
  Activity,
  BarChart3,
  Bell,
  BookOpenText,
  Building2,
  CreditCard,
  FolderKanban,
  KeyRound,
  LayoutDashboard,
  ListTodo,
  Lock,
  MessagesSquare,
  Monitor,
  Plug,
  ScrollText,
  Settings,
  Shield,
  ShieldCheck,
  Terminal,
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
        {
          title: 'Tasks',
          url: '/tasks',
          badge: '20',
          badgeVariant: 'primary',
          icon: ListTodo,
        },
        {
          title: 'Chat',
          url: '/chats',
          badge: '4',
          badgeVariant: 'destructive',
          icon: MessagesSquare,
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
          icon: Users,
        },
        {
          title: 'Roles',
          url: '/roles',
          icon: ShieldCheck,
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
          icon: ShieldCheck,
        },
        {
          title: 'Teams',
          url: '/teams',
          icon: UserCircle,
        },
        {
          title: 'Organizations',
          url: '/organizations',
          icon: Building2,
        },
      ],
    },
    {
      title: 'Projects',
      items: [
        {
          title: 'Projects',
          url: '/projects',
          icon: FolderKanban,
        },
        {
          title: 'Activity',
          url: '/activity',
          icon: Activity,
        },
      ],
    },
    {
      title: 'Analytics & Logs',
      items: [
        {
          title: 'Analytics',
          url: '/analytics',
          icon: BarChart3,
        },
        {
          title: 'Audit Logs',
          url: '/audit-logs',
          icon: ScrollText,
        },
        {
          title: 'Logs',
          url: '/logs',
          icon: Terminal,
        },
        {
          title: 'Monitoring',
          url: '/monitoring',
          icon: Monitor,
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
        {
          title: 'Integrations',
          url: '/integrations',
          icon: Plug,
        },
        {
          title: 'API Keys',
          url: '/api-keys',
          icon: KeyRound,
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
          title: 'Security',
          url: '/security',
          icon: Shield,
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
