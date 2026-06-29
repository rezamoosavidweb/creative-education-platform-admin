import { type StatTone } from '@/components/stat-card'

export type AnalyticsStat = {
  id: string
  label: string
  value: string
  foot: string
  footTone: StatTone
  footDirection?: 'up' | 'down'
}

export type TrafficSource = {
  name: string
  value: number
  color: string
}

export type TrafficPoint = {
  label: string
  views: number
}

export type HourPoint = {
  label: string
  count: number
}

export type TopPage = {
  path: string
  views: number
  unique: number
  bounce: string
  avgTime: string
}

export type TimeRange = '7d' | '30d' | '90d' | 'custom'
