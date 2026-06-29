import { memo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StatusPill } from '@/components/status-pill'
import { loginHistory } from '../data/security'

export const LoginHistoryTable = memo(function LoginHistoryTable() {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle className='text-[var(--t1)]'>Login History</CardTitle>
        <CardDescription className='text-[var(--t2)]'>
          Recent sign-in attempts on your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-[13.5px]'>
            <thead>
              <tr className='border-b border-[var(--bdr)]'>
                {['IP Address', 'Device', 'Location', 'Time', 'Status'].map(
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
              {loginHistory.map((event) => (
                <tr
                  key={event.id}
                  className='border-b border-[var(--bdr)] transition-colors last:border-b-0 hover:bg-[var(--sur2)]'
                >
                  <td className='px-[14px] py-[12px] font-mono text-[12.5px] text-[var(--t1)]'>
                    {event.ip}
                  </td>
                  <td className='px-[14px] py-[12px] text-[var(--t2)]'>
                    {event.device}
                  </td>
                  <td className='px-[14px] py-[12px] text-[var(--t2)]'>
                    {event.location}
                  </td>
                  <td className='px-[14px] py-[12px] text-[var(--t2)]'>
                    {event.time}
                  </td>
                  <td className='px-[14px] py-[12px]'>
                    <StatusPill
                      tone={event.status === 'Success' ? 'ok' : 'err'}
                    >
                      {event.status}
                    </StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
})
LoginHistoryTable.displayName = 'LoginHistoryTable'
