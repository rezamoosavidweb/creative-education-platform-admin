import type { AxiosRequestConfig } from 'axios'
import { apiClient } from './client'

export async function orvalApiClient<TData>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<TData> {
  const response = await apiClient.request<TData>({
    ...config,
    ...options,
    headers: {
      ...config.headers,
      ...options?.headers,
    },
  })

  return response.data
}
