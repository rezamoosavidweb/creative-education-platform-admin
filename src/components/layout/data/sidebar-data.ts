import {
  Activity,
  BarChart3,
  Bell,
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
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Jordan Davis',
    email: 'jordan@acme.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Corp',
      logo: Command,
      plan: 'Professional Plan',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Startup',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
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
          icon: ListTodo,
        },
        {
          title: 'Chat',
          url: '/chats',
          badge: '4',
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
          icon: Lock,
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
          icon: Bell,
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
