import { memo } from 'react'
import { Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusPill } from '@/components/status-pill'
import { invoices } from '../data/billing'

export const InvoicesTable = memo(function InvoicesTable() {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle className='text-[var(--t1)]'>Invoice History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-[13.5px]'>
            <thead>
              <tr className='border-b border-[var(--bdr)]'>
                {['Invoice', 'Date', 'Amount', 'Status'].map((header) => (
                  <th
                    key={header}
                    className='px-[14px] py-[10px] text-left text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'
                  >
                    {header}
                  </th>
                ))}
                <th className='px-[14px] py-[10px]' />
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className='border-b border-[var(--bdr)] transition-colors last:border-b-0 hover:bg-[var(--sur2)]'
                >
                  <td className='px-[14px] py-[12px] font-mono text-[12.5px] text-[var(--t1)]'>
                    {invoice.id}
                  </td>
                  <td className='px-[14px] py-[12px] text-[var(--t2)]'>
                    {invoice.date}
                  </td>
                  <td className='px-[14px] py-[12px] text-[var(--t1)] tabular-nums'>
                    {invoice.amount}
                  </td>
                  <td className='px-[14px] py-[12px]'>
                    <StatusPill
                      tone={invoice.status === 'Paid' ? 'ok' : 'warn'}
                    >
                      {invoice.status}
                    </StatusPill>
                  </td>
                  <td className='px-[14px] py-[12px]'>
                    <div className='flex justify-end'>
                      <button
                        type='button'
                        aria-label={`Download ${invoice.id}`}
                        className='inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-[var(--t2)] transition-colors hover:bg-[var(--sur3)] hover:text-[var(--t1)]'
                      >
                        <Download className='h-3.5 w-3.5' />
                        Download
                      </button>
                    </div>
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
InvoicesTable.displayName = 'InvoicesTable'
