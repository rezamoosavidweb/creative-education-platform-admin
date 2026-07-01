import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CapabilityContext } from './capability-context-value'
import { CapabilityGate } from './capability-gate'

describe('CapabilityGate', () => {
  it('hides actions when the backend capability is not granted', () => {
    const markup = renderToStaticMarkup(
      <CapabilityContext.Provider value={[]}>
        <CapabilityGate requiredCapabilities='identity.capability.read'>
          <button type='button'>Grant capability</button>
        </CapabilityGate>
      </CapabilityContext.Provider>
    )

    expect(markup).toBe('')
  })

  it('shows actions when the backend capability is granted', () => {
    const markup = renderToStaticMarkup(
      <CapabilityContext.Provider value={['identity.capability.read']}>
        <CapabilityGate requiredCapabilities='identity.capability.read'>
          <button type='button'>Grant capability</button>
        </CapabilityGate>
      </CapabilityContext.Provider>
    )

    expect(markup).toContain('Grant capability')
  })
})
