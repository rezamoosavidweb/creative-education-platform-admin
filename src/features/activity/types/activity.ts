export type ActivityCategory =
  | 'Users'
  | 'Projects'
  | 'API Keys'
  | 'Security'
  | 'Settings'
  | 'System'
  | 'Billing'
  | 'Monitoring'
  | 'Teams'
  | 'Integrations'

export type ActivityEvent = {
  id: string
  category: ActivityCategory
  title: string
  body: string
  actor: string
  time: string
  date: string
}
