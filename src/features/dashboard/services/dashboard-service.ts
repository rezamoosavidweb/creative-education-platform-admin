import { subDays, format } from 'date-fns'
import type {
  DashboardStats,
  RevenueData,
  ActivityData,
  Product,
  Activity,
  DashboardFilter,
} from '../types/dashboard'

// Mock data generator - in production, replace with API calls
function generateMockStats(): DashboardStats {
  const baseRevenue = 45231.89
  return {
    totalRevenue: baseRevenue,
    revenue_trend: {
      value: 20.1,
      direction: 'up',
      label: 'from last month',
    },
    activeUsers: 2350,
    users_trend: {
      value: 180.1,
      direction: 'up',
      label: 'from last month',
    },
    conversion: 3.24,
    conversion_trend: {
      value: 12.5,
      direction: 'up',
      label: 'from last month',
    },
    growth: 23.5,
    growth_trend: {
      value: 5.2,
      direction: 'up',
      label: 'from last month',
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

function generateMockProducts(): Product[] {
  return [
    {
      id: '1',
      name: 'Premium Plan',
      sku: 'PREM-001',
      price: 299,
      sales: 1250,
      revenue: 373750,
      trend: 'up',
    },
    {
      id: '2',
      name: 'Enterprise Plan',
      sku: 'ENT-001',
      price: 999,
      sales: 340,
      revenue: 339660,
      trend: 'up',
    },
    {
      id: '3',
      name: 'Starter Plan',
      sku: 'START-001',
      price: 99,
      sales: 5230,
      revenue: 517770,
      trend: 'down',
    },
    {
      id: '4',
      name: 'Pro Plan',
      sku: 'PRO-001',
      price: 599,
      sales: 890,
      revenue: 533010,
      trend: 'up',
    },
  ]
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

  async getTopProducts(_filters?: DashboardFilter): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return generateMockProducts()
  },

  async getRecentActivities(
    _filters?: DashboardFilter
  ): Promise<Activity[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return generateMockActivities()
  },
}
