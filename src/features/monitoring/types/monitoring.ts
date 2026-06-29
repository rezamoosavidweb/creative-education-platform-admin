export type StatTone = 'ok' | 'warn' | 'err' | 'muted'

export type MonitoringStat = {
  id: string
  label: string
  value: string
  valueTone?: 'default' | 'ok'
  foot: string
  footTone: StatTone
  footDirection?: 'up' | 'down'
}

export type ServiceStatus = 'Operational' | 'Degraded' | 'Outage'

export type Service = {
  id: string
  name: string
  status: ServiceStatus
  uptime: string
  latency: string
}

export type LatencyPoint = {
  label: string
  latency: number
}
