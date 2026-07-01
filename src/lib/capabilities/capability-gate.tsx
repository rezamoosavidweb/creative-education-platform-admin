import type { ReactNode } from 'react'
import { useCan } from './capability-hooks'
import type { CapabilityMode, CapabilityRequirement } from './types'

type CapabilityGateProps = {
  children: ReactNode
  fallback?: ReactNode
  mode?: CapabilityMode
  requiredCapabilities?: CapabilityRequirement
}

export function CapabilityGate({
  children,
  fallback = null,
  mode = 'all',
  requiredCapabilities,
}: CapabilityGateProps) {
  const canRender = useCan(requiredCapabilities, mode)

  return canRender ? <>{children}</> : <>{fallback}</>
}
