import type { PropsWithChildren } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { IdentityVerification } from '.'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}))

vi.mock('@tanstack/react-router', () => ({
  getRouteApi: () => ({
    useNavigate: () => mocks.navigate,
    useSearch: () => ({}),
  }),
}))

vi.mock('@/components/config-drawer', () => ({
  ConfigDrawer: () => <div>Config drawer</div>,
}))

vi.mock('@/components/layout/header', () => ({
  Header: ({ children }: PropsWithChildren) => <header>{children}</header>,
}))

vi.mock('@/components/layout/main', () => ({
  Main: ({ children }: PropsWithChildren) => <main>{children}</main>,
}))

vi.mock('@/components/profile-dropdown', () => ({
  ProfileDropdown: () => <div>Profile dropdown</div>,
}))

vi.mock('@/components/search', () => ({
  Search: () => <div>Search</div>,
}))

vi.mock('@/components/theme-switch', () => ({
  ThemeSwitch: () => <div>Theme switch</div>,
}))

vi.mock('./components/verification-queue-table', () => ({
  VerificationQueueTable: () => <div>Verification queue table</div>,
}))

describe('IdentityVerification', () => {
  it('renders the staff review queue without self-service request controls', async () => {
    const screen = await render(<IdentityVerification />)

    await expect
      .element(screen.getByText('Identity Verification'))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('Verification queue table'))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('Request verification'))
      .not.toBeInTheDocument()
  })
})
