export type NotificationPreference = {
  id: string
  label: string
  description: string
  defaultOn: boolean
}

export type NotificationGroup = {
  id: string
  title: string
  preferences: NotificationPreference[]
}

export const notificationGroups: NotificationGroup[] = [
  {
    id: 'account',
    title: 'Account',
    preferences: [
      {
        id: 'member-activity',
        label: 'Member activity',
        description: 'When members join, leave, or change roles.',
        defaultOn: true,
      },
      {
        id: 'mentions',
        label: 'Mentions',
        description: 'When someone mentions you in a comment.',
        defaultOn: true,
      },
    ],
  },
  {
    id: 'projects',
    title: 'Projects & Tasks',
    preferences: [
      {
        id: 'task-assigned',
        label: 'Task assigned',
        description: 'When a task is assigned to you.',
        defaultOn: true,
      },
      {
        id: 'due-reminders',
        label: 'Due date reminders',
        description: 'Reminders before a task is due.',
        defaultOn: true,
      },
      {
        id: 'project-status',
        label: 'Project status changes',
        description: 'When a project is completed or archived.',
        defaultOn: false,
      },
    ],
  },
  {
    id: 'security',
    title: 'Security',
    preferences: [
      {
        id: 'new-signins',
        label: 'New sign-ins',
        description: 'When your account is accessed from a new device.',
        defaultOn: true,
      },
      {
        id: 'failed-logins',
        label: 'Failed login attempts',
        description: 'When a sign-in attempt is blocked.',
        defaultOn: true,
      },
    ],
  },
  {
    id: 'billing',
    title: 'Billing',
    preferences: [
      {
        id: 'invoices',
        label: 'Invoices',
        description: 'When a new invoice is issued or paid.',
        defaultOn: true,
      },
      {
        id: 'usage-limits',
        label: 'Usage limits',
        description: 'When you approach a plan limit.',
        defaultOn: false,
      },
    ],
  },
]
