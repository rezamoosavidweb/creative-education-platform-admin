import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { DashboardLayout } from './dashboard-layout'

const mocks = vi.hoisted(() => ({
  useCurrentUser: vi.fn(),
  useDashboardData: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  getAuthUserGreetingName: () => 'Alex',
  useCurrentUser: mocks.useCurrentUser,
}))

vi.mock('../hooks/use-dashboard-data', () => ({
  useDashboardData: mocks.useDashboardData,
}))

const baseDashboardData = {
  canReadOutbox: true,
  error: null,
  healthError: null,
  healthMetrics: [
    {
      details: '',
      id: 'database',
      label: 'Database',
      status: 'up',
    },
  ],
  isFetching: false,
  isLoading: false,
  metrics: [
    {
      description: 'Reported by /health',
      id: 'system-status',
      title: 'System Status',
      tone: 'success',
      value: 'Ok',
    },
    {
      description: 'Outbox backlog',
      id: 'pending-events',
      title: 'Pending Events',
      tone: 'warning',
      value: '2',
    },
    {
      description: 'Needs operator review when above zero',
      id: 'failed-events',
      title: 'Failed Events',
      tone: 'danger',
      value: '1',
    },
    {
      description: 'Admin outbox stats',
      id: 'processed-events',
      title: 'Processed Events',
      tone: 'neutral',
      value: '40',
    },
  ],
  outboxError: null,
  outboxStats: { failed: 1, pending: 2, processed: 40 },
  refresh: vi.fn(),
}

describe('DashboardLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.useCurrentUser.mockReturnValue({ firstName: 'Alex' })
    mocks.useDashboardData.mockReturnValue(baseDashboardData)
  })

  it('renders backend-backed operational metrics', async () => {
    const screen = await render(<DashboardLayout />)

    await expect.element(screen.getByText('System Status')).toBeInTheDocument()
    await expect.element(screen.getByText('Pending Events')).toBeInTheDocument()
    await expect.element(screen.getByText('Failed Events')).toBeInTheDocument()
    await expect
      .element(screen.getByText('Processed Events'))
      .toBeInTheDocument()
    await expect.element(screen.getByText('Database')).toBeInTheDocument()
    await expect.element(screen.getByText(/^Processed$/)).toBeInTheDocument()
  })

  it('shows restricted outbox copy when capability is missing', async () => {
    mocks.useDashboardData.mockReturnValue({
      ...baseDashboardData,
      canReadOutbox: false,
      metrics: baseDashboardData.metrics.map((metric) =>
        metric.id === 'processed-events'
          ? {
              ...metric,
              description: 'Requires platform.outbox.manage',
              value: 'Restricted',
            }
          : metric
      ),
      outboxStats: null,
    })

    const screen = await render(<DashboardLayout />)

    await expect.element(screen.getByText('Restricted')).toBeInTheDocument()
    await expect
      .element(
        screen.getByText(
          'Requires platform.outbox.manage to view admin outbox totals.'
        )
      )
      .toBeInTheDocument()
  })

  it('renders error states without hiding the dashboard frame', async () => {
    mocks.useDashboardData.mockReturnValue({
      ...baseDashboardData,
      error: 'Request failed',
      healthError: 'Request failed',
      healthMetrics: [],
      outboxError: 'Outbox failed',
      outboxStats: null,
    })

    const screen = await render(<DashboardLayout />)

    await expect
      .element(
        screen.getByText('Failed to load dashboard data. Request failed')
      )
      .toBeInTheDocument()
    await expect.element(screen.getByText('Outbox failed')).toBeInTheDocument()
  })
})
