import { getRouteApi } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { StatCard } from '@/components/stat-card'
import { ThemeSwitch } from '@/components/theme-switch'
import { ReferenceDisciplineFilter } from './components/reference-discipline-filter'
import { ReferenceTable } from './components/reference-table'
import { useReferenceCatalogs } from './hooks/use-reference-catalogs'
import {
  getReferenceCatalogConfig,
  getReferenceItems,
  getReferenceStats,
  normalizeDisciplineId,
  normalizeReferenceCatalog,
  referenceCatalogConfigs,
} from './services/reference-query'
import type { ReferenceCatalogId, ReferenceItem } from './types'

const route = getRouteApi('/_authenticated/reference/')

export function Reference() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const activeCatalog = normalizeReferenceCatalog(search.catalog)
  const disciplineId = normalizeDisciplineId(search.disciplineId)
  const catalogQueries = useReferenceCatalogs({ disciplineId })
  const itemsByCatalog = referenceCatalogConfigs.reduce(
    (accumulator, config) => {
      accumulator[config.id] = getReferenceItems(
        catalogQueries[config.id].data?.data
      )
      return accumulator
    },
    {} as Record<ReferenceCatalogId, ReferenceItem[]>
  )
  const activeConfig = getReferenceCatalogConfig(activeCatalog)
  const disciplineItems = itemsByCatalog.disciplines
  const stats = getReferenceStats(itemsByCatalog, !!disciplineId)

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
          <h2 className='text-2xl font-bold tracking-tight'>
            Reference Catalogs
          </h2>
          <p className='text-muted-foreground'>
            Browse active, read-only taxonomy values used across the platform.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              foot={stat.foot}
            />
          ))}
        </div>

        <Tabs
          value={activeCatalog}
          className='gap-4'
          onValueChange={(value) => {
            navigate({
              search: (previous) => ({
                ...(previous as Record<string, unknown>),
                catalog: normalizeReferenceCatalog(value),
                page: undefined,
              }),
            })
          }}
        >
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <TabsList>
              {referenceCatalogConfigs.map((config) => (
                <TabsTrigger key={config.id} value={config.id}>
                  {config.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {activeConfig.supportsDisciplineFilter && (
              <ReferenceDisciplineFilter
                disciplines={disciplineItems}
                disabled={
                  catalogQueries.disciplines.isLoading ||
                  disciplineItems.length === 0
                }
                navigate={navigate}
                value={disciplineId}
              />
            )}
          </div>

          {referenceCatalogConfigs.map((config) => (
            <TabsContent key={config.id} value={config.id} className='m-0'>
              <ReferenceTable
                catalog={config.id}
                items={itemsByCatalog[config.id]}
                navigate={navigate}
                query={catalogQueries[config.id]}
                search={search}
              />
            </TabsContent>
          ))}
        </Tabs>
      </Main>
    </>
  )
}
