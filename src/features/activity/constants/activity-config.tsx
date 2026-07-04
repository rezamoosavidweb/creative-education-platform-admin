import {
  Activity as ActivityIcon,
  CreditCard,
  FolderKanban,
  KeyRound,
  type LucideIcon,
  Plug,
  Server,
  Settings,
  ShieldAlert,
  UserPlus,
  Users,
} from 'lucide-react'
import { type ActivityCategory } from '../types/activity'

export type ActivityCategoryStyle = {
  icon: LucideIcon
  color: string
  bg: string
}

// Icon + color per category. Colors use design tokens where available;
// purple (Projects) has no token, so it uses an explicit accent tint.
export const ACTIVITY_CATEGORY: Record<
  ActivityCategory,
  ActivityCategoryStyle
> = {
  Users: { icon: UserPlus, color: 'var(--pri)', bg: 'var(--pris)' },
  Projects: {
    icon: FolderKanban,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
  },
  'API Keys': { icon: KeyRound, color: 'var(--warn)', bg: 'var(--warns)' },
  Security: { icon: ShieldAlert, color: 'var(--err)', bg: 'var(--errs)' },
  Settings: { icon: Settings, color: 'var(--t2)', bg: 'var(--sur3)' },
  System: { icon: Server, color: 'var(--ok)', bg: 'var(--oks)' },
  Billing: { icon: CreditCard, color: 'var(--warn)', bg: 'var(--warns)' },
  Monitoring: { icon: ActivityIcon, color: 'var(--ok)', bg: 'var(--oks)' },
  Teams: { icon: Users, color: 'var(--info)', bg: 'var(--infos)' },
  Integrations: { icon: Plug, color: 'var(--info)', bg: 'var(--infos)' },
}
