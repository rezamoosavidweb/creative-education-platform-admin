import type { AuthCapability } from '@/lib/auth/types'

export type CapabilityKey = AuthCapability

export type CapabilityRequirement =
  | CapabilityKey
  | readonly CapabilityKey[]
  | null
  | undefined

export type CapabilityMode = 'all' | 'any'
