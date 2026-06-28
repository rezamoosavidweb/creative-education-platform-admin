export type TrendDirection = 'up' | 'down' | 'neutral'

export type MetricTrend = {
  value: number
  direction: TrendDirection
  label: string
}

export type MetricCard = {
  id: string
  title: string
  value: string | number
  trend?: MetricTrend
  icon?: React.ReactNode
  description?: string
  isLoading?: boolean
  error?: string | null
}

export type ChartDataPoint = {
  name: string
  value: number
  [key: string]: string | number
}

export type DashboardStats = {
  totalRevenue: number
  revenue_trend: MetricTrend
  activeUsers: number
  users_trend: MetricTrend
  conversion: number
  conversion_trend: MetricTrend
  growth: number
  growth_trend: MetricTrend
}

export type RevenueData = ChartDataPoint & {
  revenue: number
  cost: number
  profit: number
}

export type ActivityData = ChartDataPoint & {
  count: number
}

export type Product = {
  id: string
  name: string
  sku: string
  price: number
  sales: number
  revenue: number
  trend: TrendDirection
}

export type Activity = {
  id: string
  type: 'sale' | 'user_signup' | 'payment' | 'error'
  title: string
  description: string
  timestamp: Date
  icon?: React.ReactNode
  metadata?: Record<string, unknown>
}

export type DashboardFilter = {
  dateRange?: {
    from: Date
    to: Date
  }
  segment?: string
  region?: string
  productCategory?: string
}

export type DashboardContextType = {
  stats: DashboardStats | null
  revenueData: RevenueData[]
  activityData: ActivityData[]
  topProducts: Product[]
  recentActivities: Activity[]
  isLoading: boolean
  error: string | null
  filters: DashboardFilter
  setFilters: (filters: DashboardFilter) => void
}
