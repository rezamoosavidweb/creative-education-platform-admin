import {
  TrendingUp,
  Users,
  Activity,
  Zap,
} from 'lucide-react'

export const DASHBOARD_METRIC_CARDS = [
  {
    id: 'revenue',
    title: 'Total Revenue',
    icon: TrendingUp,
    description: 'Total revenue from all sources',
  },
  {
    id: 'users',
    title: 'Active Users',
    icon: Users,
    description: 'Currently active users',
  },
  {
    id: 'conversion',
    title: 'Conversion Rate',
    icon: Activity,
    description: 'Overall conversion rate',
  },
  {
    id: 'growth',
    title: 'Growth Rate',
    icon: Zap,
    description: 'Month over month growth',
  },
]

export const DATE_RANGE_PRESETS = {
  TODAY: { label: 'Today', days: 1 },
  THIS_WEEK: { label: 'This Week', days: 7 },
  THIS_MONTH: { label: 'This Month', days: 30 },
  THIS_QUARTER: { label: 'This Quarter', days: 90 },
  THIS_YEAR: { label: 'This Year', days: 365 },
}

export const ACTIVITY_TYPES = {
  sale: { label: 'Sale', color: 'bg-green-100 text-green-800' },
  user_signup: { label: 'User Signup', color: 'bg-blue-100 text-blue-800' },
  payment: { label: 'Payment', color: 'bg-yellow-100 text-yellow-800' },
  error: { label: 'Error', color: 'bg-red-100 text-red-800' },
}

export const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  muted: 'hsl(var(--muted))',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
}

export const DEFAULT_FILTERS = {
  dateRange: {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  },
  segment: 'all',
  region: 'all',
  productCategory: 'all',
}
