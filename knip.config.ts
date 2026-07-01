import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignore: [
    'src/components/ui/**',
    'src/components/layout/app-title.tsx',
    'src/tanstack-table.d.ts',
    // Generated from ../api/openapi.json via `pnpm generate:api-types`
    'src/lib/api/schema.d.ts',
  ],
}

export default config