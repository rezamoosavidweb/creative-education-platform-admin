export { CapabilityProvider } from './capability-context'
export { CapabilityGate } from './capability-gate'
export {
  useCan,
  useCapabilities,
  useCapability,
  useHasAll,
  useHasAny,
} from './capability-hooks'
export {
  canAccessWithCapabilities,
  getMissingCapabilities,
  hasAllCapabilities,
  hasAnyCapability,
  normalizeCapabilityRequirement,
} from './capability-utils'
export { filterNavGroupsByCapabilities } from './nav'
export {
  ensureCapabilityRouteAccess,
  getCapabilityRouteAccess,
  getRequiredCapabilitiesFromMatches,
} from './route-guard'
export {
  requireCapabilities,
  type CapabilityRouteStaticData,
} from './route-metadata'
export type {
  CapabilityKey,
  CapabilityMode,
  CapabilityRequirement,
} from './types'
