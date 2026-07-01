import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import {
  listActiveSessions,
  login,
  logout,
  revokeSession,
} from './auth-service'
import type { AuthCapability, AuthOrganization, LoginRequest } from './types'

export function useCurrentUser() {
  return useAuthStore((state) => state.auth.user)
}

export function useCurrentOrganization(): AuthOrganization | null {
  return useAuthStore((state) => {
    const { currentOrganizationId, organizations } = state.auth
    return (
      organizations.find(
        (organization) => organization.id === currentOrganizationId
      ) ?? null
    )
  })
}

export function useCurrentCapabilities(): AuthCapability[] {
  return useAuthStore((state) => state.auth.capabilities)
}

export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => state.auth.status === 'authenticated')
}

export function useCan(
  requiredCapabilities: AuthCapability | AuthCapability[]
) {
  const capabilities = useCurrentCapabilities()
  const required = Array.isArray(requiredCapabilities)
    ? requiredCapabilities
    : [requiredCapabilities]

  return required.every((capability) => capabilities.includes(capability))
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear()
    },
  })
}

export function useActiveSessions() {
  return useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: listActiveSessions,
  })
}

export function useRevokeSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: revokeSession,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] })
    },
  })
}
