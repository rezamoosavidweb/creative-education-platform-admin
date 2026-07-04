export type DashboardMetricTone = 'success' | 'warning' | 'danger' | 'neutral'

export type DashboardMetric = {
  id: string
  title: string
  value: string | number
  description: string
  tone: DashboardMetricTone
}

export type HealthMetric = {
  id: string
  label: string
  status: string
  details: string
}
