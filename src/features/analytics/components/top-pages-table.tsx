import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type TopPage } from '../types/analytics'

type TopPagesTableProps = {
  data: TopPage[]
}

export const TopPagesTable = memo(function TopPagesTable({
  data,
}: TopPagesTableProps) {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader>
        <CardTitle className='text-[var(--t1)]'>Top Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse text-[13.5px]'>
            <thead>
              <tr className='border-b border-[var(--bdr)]'>
                <th className='px-[14px] py-[10px] text-left text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'>
                  Page
                </th>
                <th className='px-[14px] py-[10px] text-right text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'>
                  Views
                </th>
                <th className='px-[14px] py-[10px] text-right text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'>
                  Unique
                </th>
                <th className='px-[14px] py-[10px] text-right text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'>
                  Bounce
                </th>
                <th className='px-[14px] py-[10px] text-right text-[11px] font-semibold tracking-[0.07em] text-[var(--t3)] uppercase'>
                  Avg Time
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((page) => (
                <tr
                  key={page.path}
                  className='border-b border-[var(--bdr)] transition-colors last:border-b-0 hover:bg-[var(--sur2)]'
                >
                  <td className='px-[14px] py-[11px] font-mono text-[12.5px] text-[var(--pri)]'>
                    {page.path}
                  </td>
                  <td className='px-[14px] py-[11px] text-right text-[var(--t1)] tabular-nums'>
                    {page.views.toLocaleString()}
                  </td>
                  <td className='px-[14px] py-[11px] text-right text-[var(--t2)] tabular-nums'>
                    {page.unique.toLocaleString()}
                  </td>
                  <td className='px-[14px] py-[11px] text-right text-[var(--t2)] tabular-nums'>
                    {page.bounce}
                  </td>
                  <td className='px-[14px] py-[11px] text-right text-[var(--t2)] tabular-nums'>
                    {page.avgTime}
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
TopPagesTable.displayName = 'TopPagesTable'
