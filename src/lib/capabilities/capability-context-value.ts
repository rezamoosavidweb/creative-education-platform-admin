import { createContext } from 'react'
import type { CapabilityKey } from './types'

export const CapabilityContext = createContext<readonly CapabilityKey[] | null>(
  null
)
