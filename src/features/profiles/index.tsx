import { getRouteApi } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { StatCard } from '@/components/stat-card'
import { ThemeSwitch } from '@/components/theme-switch'
import { MyProfileCard } from './components/my-profile-card'
import { PersonaProfilesCard } from './components/persona-profiles-card'
import { PortfolioCard } from './components/portfolio-card'
import { ProfilesTable } from './components/profiles-table'
import { useDirectoryProfiles } from './hooks/use-directory-profiles'
import { useInstructorProfile } from './hooks/use-instructor-profile'
import { useMyProfile } from './hooks/use-my-profile'
import { usePractitionerProfile } from './hooks/use-practitioner-profile'
import { useStudioProfile } from './hooks/use-studio-profile'
import { getDirectoryEntries, getProfileStats } from './services/profiles-query'

const route = getRouteApi('/_authenticated/profiles/')

export function Profiles() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const directoryQuery = useDirectoryProfiles({
    availableForHire: readBooleanFilter(search.availableForHire),
    country: readString(search.country),
    verified: readBooleanFilter(search.verified),
  })
  const profileQuery = useMyProfile()
  const practitionerQuery = usePractitionerProfile()
  const instructorQuery = useInstructorProfile()
  const studioQuery = useStudioProfile()
  const directoryEntries = getDirectoryEntries(directoryQuery.data?.data)
  const stats = getProfileStats({
    directoryEntries,
    instructorProfile: instructorQuery.data?.data,
    practitionerProfile: practitionerQuery.data?.data,
    profile: profileQuery.data?.data,
    studioProfile: studioQuery.data?.data,
  })

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Profiles</h2>
          <p className='text-muted-foreground'>
            Manage public profile records and directory visibility.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              foot={stat.foot}
              footTone={stat.footTone}
            />
          ))}
        </div>

        <Tabs defaultValue='directory' className='gap-4'>
          <TabsList>
            <TabsTrigger value='directory'>Directory</TabsTrigger>
            <TabsTrigger value='profile'>My profile</TabsTrigger>
          </TabsList>
          <TabsContent value='directory' className='m-0'>
            <ProfilesTable search={search} navigate={navigate} />
          </TabsContent>
          <TabsContent value='profile' className='m-0 space-y-4'>
            <MyProfileCard />
            <PersonaProfilesCard />
            <PortfolioCard />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : undefined
}

function readBooleanFilter(value: unknown): string | undefined {
  if (value === true) return 'true'
  if (value === false) return 'false'
  if (value === '"true"') return 'true'
  if (value === '"false"') return 'false'
  return value === 'true' || value === 'false' ? value : undefined
}
