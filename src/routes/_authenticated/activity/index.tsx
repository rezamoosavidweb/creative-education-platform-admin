import { createFileRoute } from '@tanstack/react-router'
import { Activity } from '@/features/activity'

export const Route = createFileRoute('/_authenticated/activity/')({
  component: Activity,
})
