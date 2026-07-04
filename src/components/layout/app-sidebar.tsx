import {
  getAuthUserAvatar,
  getAuthUserDisplayName,
  getAuthUserEmail,
  getAuthUserInitials,
  useCurrentOrganization,
  useCurrentOrganizations,
  useCurrentUser,
  useSetCurrentOrganizationId,
} from '@/lib/auth'
import {
  filterNavGroupsByCapabilities,
  useCapabilities,
} from '@/lib/capabilities'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { SidebarSearch } from './sidebar-search'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const capabilities = useCapabilities()
  const user = useCurrentUser()
  const organizations = useCurrentOrganizations()
  const currentOrganization = useCurrentOrganization()
  const setCurrentOrganizationId = useSetCurrentOrganizationId()
  const navGroups = filterNavGroupsByCapabilities(
    sidebarData.navGroups,
    capabilities
  )
  const navUser = {
    avatar: getAuthUserAvatar(user),
    email: getAuthUserEmail(user),
    initials: getAuthUserInitials(user),
    name: getAuthUserDisplayName(user),
  }

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader className='gap-2'>
        <TeamSwitcher
          currentOrganization={currentOrganization}
          organizations={organizations}
          onOrganizationChange={setCurrentOrganizationId}
        />
        <SidebarSearch />
      </SidebarHeader>
      <SidebarContent className='gap-0'>
        {navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
