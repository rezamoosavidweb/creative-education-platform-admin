import { z } from 'zod'

export const trendDirectionSchema = z.enum(['up', 'down', 'neutral'])

export const metricTrendSchema = z.object({
  value: z.number(),
  direction: trendDirectionSchema,
  label: z.string(),
})

export const metricCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  value: z.union([z.string(), z.number()]),
  trend: metricTrendSchema.optional(),
  description: z.string().optional(),
  isLoading: z.boolean().optional(),
  error: z.string().nullable().optional(),
})

export const dashboardStatsSchema = z.object({
  totalRevenue: z.number(),
  revenue_trend: metricTrendSchema,
  activeUsers: z.number(),
  users_trend: metricTrendSchema,
  conversion: z.number(),
  conversion_trend: metricTrendSchema,
  growth: z.number(),
  growth_trend: metricTrendSchema,
})

export const chartDataPointSchema = z.object({
  name: z.string(),
  value: z.number(),
})

export const revenueDataSchema = chartDataPointSchema.extend({
  revenue: z.number(),
  cost: z.number(),
  profit: z.number(),
})

export const activityDataSchema = chartDataPointSchema.extend({
  count: z.number(),
})

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  price: z.number().positive(),
  sales: z.number().int().nonnegative(),
  revenue: z.number().nonnegative(),
  trend: trendDirectionSchema,
})

export const activitySchema = z.object({
  id: z.string(),
  type: z.enum(['sale', 'user_signup', 'payment', 'error']),
  title: z.string(),
  description: z.string(),
  timestamp: z.coerce.date(),
})

export const dashboardFilterSchema = z.object({
  dateRange: z
    .object({
      from: z.coerce.date(),
      to: z.coerce.date(),
    })
    .optional(),
  segment: z.string().optional(),
  region: z.string().optional(),
  productCategory: z.string().optional(),
})
