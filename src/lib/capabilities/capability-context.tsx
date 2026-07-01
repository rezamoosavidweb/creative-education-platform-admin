import { useMemo, type PropsWithChildren } from 'react'
import { useCurrentCapabilities } from '@/lib/auth/auth-hooks'
import { CapabilityContext } from './capability-context-value'

export function CapabilityProvider({ children }: PropsWithChildren) {
  const capabilities = useCurrentCapabilities()
  const value = useMemo(() => capabilities, [capabilities])

  return (
    <CapabilityContext.Provider value={value}>
      {children}
    </CapabilityContext.Provider>
  )
}
