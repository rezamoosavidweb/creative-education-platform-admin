import { cn } from '@/lib/utils'

export type PillTone = 'ok' | 'warn' | 'err' | 'info' | 'primary' | 'neutral'

const TONE_CLASS: Record<PillTone, string> = {
  ok: 'bg-[var(--oks)] text-[var(--ok)]',
  warn: 'bg-[var(--warns)] text-[var(--warn)]',
  err: 'bg-[var(--errs)] text-[var(--err)]',
  info: 'bg-[var(--infos)] text-[var(--info)]',
  primary: 'bg-[var(--pris)] text-[var(--pri)]',
  neutral: 'bg-[var(--sur3)] text-[var(--t2)]',
}

type StatusPillProps = {
  tone: PillTone
  children: React.ReactNode
  className?: string
}

/** Small pill/badge with a semantic color tint from the design tokens. */
export function StatusPill({ tone, children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium',
        TONE_CLASS[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
