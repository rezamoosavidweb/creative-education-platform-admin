import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  entry: ['orval.config.ts'],
  ignore: [
    'src/components/ui/**',
    'src/components/layout/app-title.tsx',
    'src/components/layout/top-nav.tsx',
    'src/features/settings/components/sidebar-nav.tsx',
    'src/tanstack-table.d.ts',
    // Generated from ../api/openapi.json via `pnpm generate:api-types`
    'src/lib/api/schema.d.ts',
    // Generated from ../api/openapi.json via `pnpm generate:api`
    'src/lib/api/generated/**',
  ],
  ignoreIssues: {
    '**/*': ['exports', 'types'],
  },
}

export default config
