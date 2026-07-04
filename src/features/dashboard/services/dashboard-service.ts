import { subDays, format } from 'date-fns'
import type {
  DashboardStats,
  RevenueData,
  ActivityData,
  Activity,
  DashboardFilter,
} from '../types/dashboard'

// Mock data generator - in production, replace with API calls
function generateMockStats(): DashboardStats {
  return {
    totalRevenue: 128420,
    revenue_trend: {
      value: 12.4,
      direction: 'up',
      label: 'vs last month',
    },
    activeUsers: 24891,
    users_trend: {
      value: 8.1,
      direction: 'up',
      label: 'vs last month',
    },
    conversion: 3.24,
    conversion_trend: {
      value: 0.6,
      direction: 'up',
      label: 'vs last month',
    },
    // Represents API Requests (count) for the 4th KPI card.
    growth: 1_240_000,
    growth_trend: {
      value: 21.3,
      direction: 'up',
      label: 'vs last month',
    },
  }
}

function generateMockRevenueData(): RevenueData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  return months.map((name) => ({
    name,
    value: Math.floor(Math.random() * 50000) + 10000,
    revenue: Math.floor(Math.random() * 45000) + 15000,
    cost: Math.floor(Math.random() * 20000) + 5000,
    profit: Math.floor(Math.random() * 25000) + 8000,
  }))
}

function generateMockActivityData(): ActivityData[] {
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    return {
      name: format(date, 'MMM d'),
      value: Math.floor(Math.random() * 100) + 20,
      count: Math.floor(Math.random() * 100) + 20,
    }
  })
  return days
}

function generateMockActivities(): Activity[] {
  return [
    {
      id: '1',
      type: 'sale',
      title: 'New Sale',
      description: 'Customer purchased Premium Plan',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: '2',
      type: 'user_signup',
      title: 'New Signup',
      description: 'New user created account',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      description: 'Invoice #INV-2024-001 paid',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: '4',
      type: 'sale',
      title: 'New Sale',
      description: 'Customer purchased Enterprise Plan',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
    },
    {
      id: '5',
      type: 'error',
      title: 'Error Occurred',
      description: 'Payment processing failed',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
    },
  ]
}

export const dashboardService = {
  async getStats(_filters?: DashboardFilter): Promise<DashboardStats> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return generateMockStats()
  },

  async getRevenueData(_filters?: DashboardFilter): Promise<RevenueData[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return generateMockRevenueData()
  },

  async getActivityData(_filters?: DashboardFilter): Promise<ActivityData[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return generateMockActivityData()
  },

  async getRecentActivities(_filters?: DashboardFilter): Promise<Activity[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return generateMockActivities()
  },
}
