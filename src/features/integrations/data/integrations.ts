export type IntegrationStatus = 'Connected' | 'Disconnected'

export type Integration = {
  id: string
  name: string
  description: string
  status: IntegrationStatus
  color: string
}

export const integrations: Integration[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Code repository sync and PR automation.',
    status: 'Connected',
    color: '#1b1f23',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Notifications and workflow alerts.',
    status: 'Connected',
    color: '#4a154b',
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Issue sync and sprint tracking.',
    status: 'Connected',
    color: '#0052cc',
  },
  {
    id: 'datadog',
    name: 'Datadog',
    description: 'Infrastructure and APM monitoring.',
    status: 'Connected',
    color: '#632ca6',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and billing events.',
    status: 'Connected',
    color: '#635bff',
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Transactional email delivery.',
    status: 'Disconnected',
    color: '#1a82e2',
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Design file sync and comment import.',
    status: 'Disconnected',
    color: '#f24e1e',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'No-code workflow automation.',
    status: 'Disconnected',
    color: '#ff4a00',
  },
]
