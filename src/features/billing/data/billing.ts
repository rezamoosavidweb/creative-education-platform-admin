export type UsageMetric = {
  id: string
  label: string
  current: number
  limit: number
  unit: string
  display: string
}

export type Invoice = {
  id: string
  date: string
  amount: string
  status: 'Paid' | 'Pending'
}

export const currentPlan = {
  name: 'Professional',
  description: 'For growing teams that need more power.',
  price: 299,
  period: 'month',
  features: [
    'Up to 500 team members',
    '50 projects',
    '100GB storage',
    'Priority support',
    'Advanced analytics',
    'Custom integrations',
  ],
}

export const usage: UsageMetric[] = [
  {
    id: 'api',
    label: 'API Calls',
    current: 1_240_000,
    limit: 5_000_000,
    unit: '',
    display: '1.24M / 5M',
  },
  {
    id: 'storage',
    label: 'Storage',
    current: 42,
    limit: 100,
    unit: 'GB',
    display: '42 GB / 100 GB',
  },
  {
    id: 'members',
    label: 'Team Members',
    current: 84,
    limit: 500,
    unit: '',
    display: '84 / 500',
  },
  {
    id: 'projects',
    label: 'Projects',
    current: 9,
    limit: 50,
    unit: '',
    display: '9 / 50',
  },
]

export const invoices: Invoice[] = [
  { id: 'INV-2026-06', date: 'Jun 1, 2026', amount: '$299.00', status: 'Paid' },
  { id: 'INV-2026-05', date: 'May 1, 2026', amount: '$299.00', status: 'Paid' },
  { id: 'INV-2026-04', date: 'Apr 1, 2026', amount: '$299.00', status: 'Paid' },
  { id: 'INV-2026-03', date: 'Mar 1, 2026', amount: '$299.00', status: 'Paid' },
  { id: 'INV-2026-02', date: 'Feb 1, 2026', amount: '$299.00', status: 'Paid' },
  { id: 'INV-2026-01', date: 'Jan 1, 2026', amount: '$249.00', status: 'Paid' },
]
