import { describe, expect, it } from 'vitest'
import {
  getOutboxBacklogFromHealth,
  mapDashboardMetrics,
  mapHealthMetrics,
} from './dashboard-service'

describe('dashboard service mappers', () => {
  it('maps health and outbox responses into operational dashboard metrics', () => {
    const metrics = mapDashboardMetrics({
      canReadOutbox: true,
      health: {
        status: 'ok',
        details: {
          database: { status: 'up' },
          outbox: { status: 'up', pending: 2, failed: 1 },
        },
      },
      outboxStats: { failed: 3, pending: 5, processed: 42 },
    })

    expect(metrics).toEqual([
      expect.objectContaining({
        id: 'system-status',
        tone: 'success',
        value: 'Ok',
      }),
      expect.objectContaining({
        id: 'pending-events',
        tone: 'warning',
        value: '5',
      }),
      expect.objectContaining({
        id: 'failed-events',
        tone: 'danger',
        value: '3',
      }),
      expect.objectContaining({
        id: 'processed-events',
        value: '42',
      }),
    ])
  })

  it('falls back to informational outbox backlog from health when admin stats are restricted', () => {
    const metrics = mapDashboardMetrics({
      canReadOutbox: false,
      health: {
        status: 'ok',
        details: {
          outbox: { status: 'up', pending: 7, failed: 0 },
        },
      },
      outboxStats: null,
    })

    expect(metrics).toEqual([
      expect.any(Object),
      expect.objectContaining({ id: 'pending-events', value: '7' }),
      expect.objectContaining({ id: 'failed-events', value: '0' }),
      expect.objectContaining({
        description: 'Requires platform.outbox.manage',
        id: 'processed-events',
        value: 'Restricted',
      }),
    ])
  })

  it('maps health details into display rows without assuming fixed indicators', () => {
    expect(
      mapHealthMetrics({
        status: 'ok',
        details: {
          database: { status: 'up' },
          outbox: { status: 'up', pending: 2, failed: 1 },
        },
      })
    ).toEqual([
      {
        details: '',
        id: 'database',
        label: 'Database',
        status: 'up',
      },
      {
        details: 'Pending: 2 · Failed: 1',
        id: 'outbox',
        label: 'Outbox',
        status: 'up',
      },
    ])
  })

  it('treats missing numeric outbox details as unavailable', () => {
    expect(
      getOutboxBacklogFromHealth({
        status: 'ok',
        details: {
          outbox: { status: 'up', pending: 'unknown', failed: undefined },
        },
      })
    ).toEqual({ failed: null, pending: null })
  })
})
