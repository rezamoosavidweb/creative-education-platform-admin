import { memo } from 'react'
import { Copy, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatusPill, type PillTone } from '@/components/status-pill'
import { type ApiKey, type ApiKeyStatus } from '../types/api-key'

type ApiKeysTableProps = {
  apiKeys: ApiKey[]
}

const STATUS_TONE: Record<ApiKeyStatus, PillTone> = {
  Active: 'ok',
  Expiring: 'warn',
  Expired: 'err',
}

export const ApiKeysTable = memo(function ApiKeysTable({
  apiKeys,
}: ApiKeysTableProps) {
  return (
    <div className='overflow-x-auto rounded-[10px] border border-[var(--bdr)] bg-[var(--sur)]'>
      <table className='w-full border-collapse text-[13.5px]'>
        <thead>
          <tr className='border-b border-[var(--bdr)] bg-[var(--sur2)]'>
            {['Name', 'Key', 'Scopes', 'Created', 'Expires', 'Status'].map(
              (header) => (
                <th
                  key={header}
                  className='px-[14px] py-[10px] text-left text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'
                >
                  {header}
                </th>
              )
            )}
            <th className='px-[14px] py-[10px]' />
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((apiKey) => (
            <tr
              key={apiKey.id}
              className='border-b border-[var(--bdr)] transition-colors last:border-b-0 hover:bg-[var(--sur2)]'
            >
              <td className='px-[14px] py-[12px] font-medium text-[var(--t1)]'>
                {apiKey.name}
              </td>
              <td className='px-[14px] py-[12px]'>
                <div className='flex items-center gap-2'>
                  <code className='font-mono text-[12.5px] text-[var(--t2)]'>
                    {apiKey.key}
                  </code>
                  <button
                    type='button'
                    aria-label={`Copy ${apiKey.name} key`}
                    className='text-[var(--t3)] transition-colors hover:text-[var(--t1)]'
                  >
                    <Copy className='h-3.5 w-3.5' />
                  </button>
                </div>
              </td>
              <td className='px-[14px] py-[12px]'>
                <div className='flex flex-wrap gap-1'>
                  {apiKey.scopes.map((scope) => (
                    <StatusPill key={scope} tone='neutral'>
                      {scope}
                    </StatusPill>
                  ))}
                </div>
              </td>
              <td className='px-[14px] py-[12px] text-[var(--t2)]'>
                {apiKey.created}
              </td>
              <td className='px-[14px] py-[12px] text-[var(--t2)]'>
                {apiKey.expires}
              </td>
              <td className='px-[14px] py-[12px]'>
                <StatusPill tone={STATUS_TONE[apiKey.status]}>
                  {apiKey.status}
                </StatusPill>
              </td>
              <td className='px-[14px] py-[12px]'>
                <div className='flex justify-end'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type='button'
                        aria-label={`Open ${apiKey.name} menu`}
                        className='inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--t2)] transition-colors hover:bg-[var(--sur3)] hover:text-[var(--t1)]'
                      >
                        <MoreHorizontal className='h-4 w-4' />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>Copy key</DropdownMenuItem>
                      <DropdownMenuItem>Roll key</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant='destructive'>
                        Revoke
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
ApiKeysTable.displayName = 'ApiKeysTable'
