import {
  AtSign,
  CreditCard,
  FolderKanban,
  KeyRound,
  type LucideIcon,
  Server,
  ShieldAlert,
  UserPlus,
} from 'lucide-react'

export type NotificationCategory =
  | 'user'
  | 'api'
  | 'system'
  | 'security'
  | 'billing'
  | 'project'
  | 'mention'

export type NotificationStyle = {
  icon: LucideIcon
  color: string
  bg: string
  accent: string
}

export const NOTIFICATION_STYLE: Record<
  NotificationCategory,
  NotificationStyle
> = {
  user: {
    icon: UserPlus,
    color: 'var(--pri)',
    bg: 'var(--pris)',
    accent: 'var(--pri)',
  },
  api: {
    icon: KeyRound,
    color: 'var(--warn)',
    bg: 'var(--warns)',
    accent: 'var(--warn)',
  },
  system: {
    icon: Server,
    color: 'var(--ok)',
    bg: 'var(--oks)',
    accent: 'var(--ok)',
  },
  security: {
    icon: ShieldAlert,
    color: 'var(--err)',
    bg: 'var(--errs)',
    accent: 'var(--err)',
  },
  billing: {
    icon: CreditCard,
    color: 'var(--warn)',
    bg: 'var(--warns)',
    accent: 'var(--warn)',
  },
  project: {
    icon: FolderKanban,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    accent: '#8b5cf6',
  },
  mention: {
    icon: AtSign,
    color: 'var(--info)',
    bg: 'var(--infos)',
    accent: 'var(--info)',
  },
}
