import {
  type AnalyticsStat,
  type HourPoint,
  type TopPage,
  type TrafficPoint,
  type TrafficSource,
} from '../types/analytics'

export const analyticsStats: AnalyticsStat[] = [
  {
    id: 'page-views',
    label: 'Page Views',
    value: '842,310',
    foot: '+18.2%',
    footTone: 'ok',
    footDirection: 'up',
  },
  {
    id: 'sessions',
    label: 'Sessions',
    value: '294,718',
    foot: '+11.5%',
    footTone: 'ok',
    footDirection: 'up',
  },
  {
    id: 'bounce-rate',
    label: 'Bounce Rate',
    value: '34.8%',
    foot: '−2.1%',
    footTone: 'ok',
    footDirection: 'down',
  },
  {
    id: 'avg-duration',
    label: 'Avg Duration',
    value: '4m 12s',
    foot: '+0:34',
    footTone: 'ok',
    footDirection: 'up',
  },
]

export const trafficSources: TrafficSource[] = [
  { name: 'Direct', value: 42, color: '#1e8ec8' },
  { name: 'Organic', value: 28, color: '#3b82f6' },
  { name: 'Referral', value: 15, color: '#8b5cf6' },
  { name: 'Social', value: 10, color: '#f59e0b' },
  { name: 'Email', value: 5, color: '#22c55e' },
]

// Page views per day over the last 30 days — gentle upward trend with noise.
export const trafficSeries: TrafficPoint[] = Array.from(
  { length: 30 },
  (_, i) => ({
    label: `Day ${i + 1}`,
    views: Math.round(18000 + i * 520 + Math.sin(i / 2) * 1800 + (i % 4) * 700),
  })
)

const HOUR_LABELS = [
  '12am',
  '',
  '',
  '3am',
  '',
  '',
  '6am',
  '',
  '',
  '9am',
  '',
  '',
  '12pm',
  '',
  '',
  '3pm',
  '',
  '',
  '6pm',
  '',
  '',
  '9pm',
  '',
  '12am',
]

// Average event count by hour — peaks through the working day.
export const eventsByHour: HourPoint[] = HOUR_LABELS.map((label, i) => {
  const peak = Math.exp(-((i - 14) ** 2) / 40)
  return {
    label,
    count: Math.round(40 + peak * 220 + (i % 3) * 12),
  }
})

export const topPages: TopPage[] = [
  {
    path: '/',
    views: 124382,
    unique: 98201,
    bounce: '28.4%',
    avgTime: '5m 12s',
  },
  {
    path: '/dashboard',
    views: 84291,
    unique: 71038,
    bounce: '14.2%',
    avgTime: '8m 44s',
  },
  {
    path: '/analytics',
    views: 52108,
    unique: 41294,
    bounce: '18.9%',
    avgTime: '6m 22s',
  },
  {
    path: '/users',
    views: 38924,
    unique: 31012,
    bounce: '22.1%',
    avgTime: '4m 10s',
  },
  {
    path: '/settings',
    views: 21483,
    unique: 18392,
    bounce: '31.8%',
    avgTime: '3m 08s',
  },
  {
    path: '/billing',
    views: 14201,
    unique: 12834,
    bounce: '35.2%',
    avgTime: '2m 55s',
  },
]
