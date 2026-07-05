import { createFileRoute } from '@tanstack/react-router'
import { Community } from '@/features/community'

export const Route = createFileRoute('/_authenticated/community/')({
  component: Community,
})
