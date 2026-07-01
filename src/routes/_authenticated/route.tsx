import { createFileRoute, redirect } from '@tanstack/react-router'
import { ensureAuthSession } from '@/lib/auth'
import { ensureCapabilityRouteAccess } from '@/lib/capabilities'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location, matches }) => {
    const isAuthenticated = await ensureAuthSession()

    if (!isAuthenticated) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      })
    }

    ensureCapabilityRouteAccess(matches)
  },
  component: AuthenticatedLayout,
})
