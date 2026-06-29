import { type NotificationCategory } from '../constants/notification-config'

export type NotificationItem = {
  id: string
  category: NotificationCategory
  title: string
  body: string
  time: string
  unread: boolean
  mention?: boolean
  system?: boolean
}

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    category: 'user',
    title: 'New user registered',
    body: 'sarah.chen@acme.com joined the workspace.',
    time: '2 minutes ago',
    unread: true,
  },
  {
    id: 'n2',
    category: 'api',
    title: 'API key expiring soon',
    body: 'Production key expires in 3 days.',
    time: '1 hour ago',
    unread: true,
    system: true,
  },
  {
    id: 'n3',
    category: 'system',
    title: 'System health alert',
    body: 'CPU usage above 85% for 10 minutes.',
    time: '3 hours ago',
    unread: true,
    system: true,
  },
  {
    id: 'n4',
    category: 'mention',
    title: 'Mark Rivera mentioned you',
    body: 'In Project Atlas: “can you review the updated API spec?”',
    time: '5 hours ago',
    unread: false,
    mention: true,
  },
  {
    id: 'n5',
    category: 'billing',
    title: 'Invoice paid',
    body: 'INV-2026-06 · $299.00 was paid successfully.',
    time: 'Yesterday',
    unread: false,
    system: true,
  },
  {
    id: 'n6',
    category: 'project',
    title: 'Project “Phoenix Auth” completed',
    body: 'All 18 tasks are done — nice work, team.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 'n7',
    category: 'security',
    title: 'New sign-in detected',
    body: 'Chrome · macOS from San Francisco, US.',
    time: '2 days ago',
    unread: false,
    system: true,
  },
  {
    id: 'n8',
    category: 'mention',
    title: 'Aiko Kobayashi mentioned you',
    body: 'In the standup thread: “let’s sync on the rollout plan.”',
    time: '2 days ago',
    unread: false,
    mention: true,
  },
]
