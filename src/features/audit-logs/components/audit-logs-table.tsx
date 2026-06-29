import { memo } from 'react'
import { getAvatarColor, getInitials } from '@/lib/avatar'
import { StatusPill, type PillTone } from '@/components/status-pill'
import { type AuditActionType, type AuditLog } from '../data/audit-logs'

type AuditLogsTableProps = {
  logs: AuditLog[]
}

const ACTION_TONE: Record<AuditActionType, PillTone> = {
  create: 'ok',
  update: 'info',
  delete: 'err',
  auth: 'neutral',
  security: 'warn',
}

export const AuditLogsTable = memo(function AuditLogsTable({
  logs,
}: AuditLogsTableProps) {
  return (
    <div className='overflow-x-auto rounded-[10px] border border-[var(--bdr)] bg-[var(--sur)]'>
      <table className='w-full border-collapse text-[13.5px]'>
        <thead>
          <tr className='border-b border-[var(--bdr)] bg-[var(--sur2)]'>
            {['Actor', 'Action', 'Target', 'IP Address', 'Timestamp'].map(
              (header) => (
                <th
                  key={header}
                  className='px-[14px] py-[10px] text-left text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              className='border-b border-[var(--bdr)] transition-colors last:border-b-0 hover:bg-[var(--sur2)]'
            >
              <td className='px-[14px] py-[12px]'>
                <div className='flex items-center gap-2.5'>
                  <span
                    className='flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white'
                    style={{ backgroundColor: getAvatarColor(log.actor) }}
                  >
                    {getInitials(log.actor)}
                  </span>
                  <span className='font-medium text-[var(--t1)]'>
                    {log.actor}
                  </span>
                </div>
              </td>
              <td className='px-[14px] py-[12px]'>
                <StatusPill tone={ACTION_TONE[log.type]}>
                  {log.action}
                </StatusPill>
              </td>
              <td className='px-[14px] py-[12px] text-[var(--t2)]'>
                {log.target}
              </td>
              <td className='px-[14px] py-[12px] font-mono text-[12.5px] text-[var(--t2)]'>
                {log.ip}
              </td>
              <td className='px-[14px] py-[12px] text-[var(--t2)]'>
                {log.timestamp}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
AuditLogsTable.displayName = 'AuditLogsTable'
