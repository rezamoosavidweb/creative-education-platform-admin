import { memo } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StatusPill } from '@/components/status-pill'
import { currentPlan } from '../data/billing'

export const PlanCard = memo(function PlanCard() {
  return (
    <Card className='border border-[var(--bdr)] bg-[var(--sur)]'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-[var(--t1)]'>Current Plan</CardTitle>
        <StatusPill tone='primary'>Active</StatusPill>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <div className='flex items-baseline gap-2'>
            <span className='text-2xl font-bold text-[var(--t1)]'>
              {currentPlan.name}
            </span>
            <span className='text-[var(--t2)]'>
              ${currentPlan.price}/{currentPlan.period}
            </span>
          </div>
          <p className='mt-1 text-[13px] text-[var(--t2)]'>
            {currentPlan.description}
          </p>
        </div>

        <ul className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
          {currentPlan.features.map((feature) => (
            <li
              key={feature}
              className='flex items-center gap-2 text-[13px] text-[var(--t2)]'
            >
              <Check className='h-4 w-4 shrink-0 text-[var(--ok)]' />
              {feature}
            </li>
          ))}
        </ul>

        <div className='flex flex-wrap gap-2 pt-1'>
          <Button>Upgrade Plan</Button>
          <Button variant='outline'>Manage Subscription</Button>
        </div>
      </CardContent>
    </Card>
  )
})
PlanCard.displayName = 'PlanCard'
