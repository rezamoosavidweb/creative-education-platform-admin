import { type Organization } from '../types/organization'

export type OrgStat = {
  id: string
  label: string
  value: string
  valueTone?: 'default' | 'ok'
}

export const orgStats: OrgStat[] = [
  { id: 'total', label: 'Total Organizations', value: '142' },
  { id: 'active', label: 'Active', value: '138', valueTone: 'ok' },
  { id: 'enterprise', label: 'Enterprise Plan', value: '24' },
  { id: 'members', label: 'Total Members', value: '8,291' },
]

export const organizations: Organization[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    slug: 'stripe.acme.com',
    plan: 'Enterprise',
    members: 1240,
    status: 'Active',
    admin: 'Jordan Davis',
    created: 'Jan 8, 2024',
    logoColor: '#635bff',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    slug: 'vercel.acme.com',
    plan: 'Enterprise',
    members: 890,
    status: 'Active',
    admin: 'Sarah Chen',
    created: 'Feb 2, 2024',
    logoColor: '#0ea5e9',
  },
  {
    id: 'linear',
    name: 'Linear',
    slug: 'linear.acme.com',
    plan: 'Professional',
    members: 420,
    status: 'Active',
    admin: 'Mark Rivera',
    created: 'Mar 15, 2024',
    logoColor: '#8b5cf6',
  },
  {
    id: 'figma',
    name: 'Figma',
    slug: 'figma.acme.com',
    plan: 'Enterprise',
    members: 1510,
    status: 'Active',
    admin: 'Aiko Kobayashi',
    created: 'Apr 1, 2024',
    logoColor: '#f24e1e',
  },
  {
    id: 'github',
    name: 'GitHub',
    slug: 'github.acme.com',
    plan: 'Enterprise',
    members: 2100,
    status: 'Active',
    admin: 'Raj Kumar',
    created: 'Apr 22, 2024',
    logoColor: '#1b1f23',
  },
  {
    id: 'notion',
    name: 'Notion',
    slug: 'notion.acme.com',
    plan: 'Professional',
    members: 610,
    status: 'Active',
    admin: 'Lena Müller',
    created: 'May 9, 2024',
    logoColor: '#14b8a6',
  },
  {
    id: 'slack',
    name: 'Slack',
    slug: 'slack.acme.com',
    plan: 'Standard',
    members: 180,
    status: 'Suspended',
    admin: 'Theo Nakamura',
    created: 'Jun 7, 2024',
    logoColor: '#4a154b',
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    slug: 'airbnb.acme.com',
    plan: 'Professional',
    members: 540,
    status: 'Active',
    admin: 'Amara Bello',
    created: 'Jul 18, 2024',
    logoColor: '#ef4444',
  },
  {
    id: 'datadog',
    name: 'Datadog',
    slug: 'datadog.acme.com',
    plan: 'Standard',
    members: 90,
    status: 'Active',
    admin: 'Chris Wang',
    created: 'Aug 15, 2024',
    logoColor: '#632ca6',
  },
]
