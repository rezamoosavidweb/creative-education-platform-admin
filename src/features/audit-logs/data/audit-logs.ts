export type AuditActionType =
  | 'create'
  | 'update'
  | 'delete'
  | 'auth'
  | 'security'

export type AuditLog = {
  id: string
  actor: string
  action: string
  type: AuditActionType
  target: string
  ip: string
  timestamp: string
}

export const auditLogs: AuditLog[] = [
  {
    id: 'e1',
    actor: 'Jordan Davis',
    action: 'Created API key',
    type: 'create',
    target: 'CI/CD',
    ip: '12.34.56.78',
    timestamp: 'Jun 29, 2026 · 09:41',
  },
  {
    id: 'e2',
    actor: 'Jordan Davis',
    action: 'Invited user',
    type: 'create',
    target: 'sarah.chen@acme.com',
    ip: '12.34.56.78',
    timestamp: 'Jun 29, 2026 · 09:17',
  },
  {
    id: 'e3',
    actor: 'Mark Rivera',
    action: 'Updated project',
    type: 'update',
    target: 'Phoenix Auth',
    ip: '98.76.54.32',
    timestamp: 'Jun 29, 2026 · 08:52',
  },
  {
    id: 'e4',
    actor: 'Aiko Kobayashi',
    action: 'Changed role',
    type: 'update',
    target: 'theo@acme.com → Manager',
    ip: '40.12.88.21',
    timestamp: 'Jun 28, 2026 · 17:30',
  },
  {
    id: 'e5',
    actor: 'Raj Kumar',
    action: 'Connected integration',
    type: 'create',
    target: 'Datadog',
    ip: '51.20.7.4',
    timestamp: 'Jun 28, 2026 · 15:02',
  },
  {
    id: 'e6',
    actor: 'Security',
    action: 'Blocked login',
    type: 'security',
    target: 'Unknown device',
    ip: '192.168.2.44',
    timestamp: 'Jun 28, 2026 · 13:48',
  },
  {
    id: 'e7',
    actor: 'Jordan Davis',
    action: 'Deleted project',
    type: 'delete',
    target: 'Legacy CMS',
    ip: '12.34.56.78',
    timestamp: 'Jun 27, 2026 · 11:09',
  },
  {
    id: 'e8',
    actor: 'Lena Müller',
    action: 'Exported report',
    type: 'update',
    target: 'Q2 Analytics',
    ip: '88.32.10.5',
    timestamp: 'Jun 27, 2026 · 10:21',
  },
  {
    id: 'e9',
    actor: 'Sarah Chen',
    action: 'Signed in',
    type: 'auth',
    target: 'Chrome · macOS',
    ip: '12.34.56.79',
    timestamp: 'Jun 27, 2026 · 09:00',
  },
  {
    id: 'e10',
    actor: 'Jordan Davis',
    action: 'Updated billing',
    type: 'update',
    target: 'Professional plan',
    ip: '12.34.56.78',
    timestamp: 'Jun 26, 2026 · 16:44',
  },
]
