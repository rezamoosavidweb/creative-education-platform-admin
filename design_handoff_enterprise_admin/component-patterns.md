# Component Patterns

Reusable UI patterns from the design, with Tailwind + shadcn/ui implementation guidance.

---

## 1. Sidebar Nav Item

```tsx
// nav-item.tsx
interface NavItemProps {
  icon: LucideIcon
  label: string
  badge?: string | number
  badgeVariant?: 'primary' | 'error' | 'neutral'
  active?: boolean
  collapsed?: boolean
  onClick?: () => void
}

// Tailwind classes (collapsed = icons-only mode):
// Base:    flex items-center gap-[9px] px-2 py-1.5 rounded-md cursor-pointer
//          text-[13.5px] font-medium text-[var(--t2)] transition-colors
// Hover:   hover:bg-[var(--nhb)] hover:text-[var(--t1)]
// Active:  bg-[var(--nab)] text-[var(--naf)]
// Icon:    w-[15px] h-[15px] flex-shrink-0 text-[var(--t3)]
// Icon active: text-[var(--naf)]
// Collapsed: justify-center px-[7px] py-[7px]

// Badge (primary — blue):
// ml-auto bg-[var(--pri)] text-white text-[10px] font-bold px-1.5 py-px rounded-full

// Badge (error — red):
// ml-auto bg-[var(--err)] text-white text-[10px] font-bold px-1.5 py-px rounded-full

// Badge (neutral — tiny):
// ml-auto bg-[var(--sur3)] text-[var(--t3)] text-[10.5px] px-1.5 py-px rounded-full
```

---

## 2. Sidebar Group Label

```tsx
// Spacing: pt-[14px] pb-[5px] px-2
// Text: text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--t3)]

<div className="pt-[14px] pb-[5px] px-2 text-[10.5px] font-semibold 
                uppercase tracking-[0.08em] text-[var(--t3)]">
  People & Access
</div>
```

---

## 3. KPI Stat Card

```tsx
interface StatCardProps {
  title: string
  value: string
  trend: string      // e.g. "+12.4%"
  trendDir: 'up' | 'down'
  icon: LucideIcon
  iconBg: string     // CSS color for icon container bg
  iconColor: string  // CSS color for icon
  sparkline: number[] // 7-8 data points
  subtitle: string   // e.g. "vs last month"
}

// Card: bg-[var(--sur)] border border-[var(--bdr)] rounded-[10px] p-[20px_22px]
// Title: text-[12px] font-medium text-[var(--t3)]
// Icon container: w-8 h-8 rounded-lg flex items-center justify-center
// Value: text-[26px] font-bold text-[var(--t1)] tracking-tight tabular-nums leading-none
// Trend (positive): inline-flex items-center gap-[3px] text-[12px] font-medium text-[var(--ok)]
// Trend (negative): text-[var(--err)]
// Subtitle: text-[11.5px] text-[var(--t3)] mt-[5px]
```

**Sparkline** — render with Recharts `<LineChart>` (no axes, no grid, just the line):

```tsx
<ResponsiveContainer width="80" height="28">
  <LineChart data={data.map((v, i) => ({ i, v }))}>
    <Line type="monotone" dataKey="v" stroke={color}
          strokeWidth={1.5} dot={false} />
  </LineChart>
</ResponsiveContainer>
```

---

## 4. Data Table (TanStack Table)

The Tasks and Users pages use TanStack Table v8. Pattern from shadcn-admin:

```tsx
// columns.tsx
export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: ({ table }) => <Checkbox checked={table.getIsAllRowsSelected()} ... />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} ... />,
    size: 40,
  },
  {
    accessorKey: 'id',
    header: 'Task',
    cell: ({ row }) => (
      <span className="font-mono text-[12px] text-[var(--t3)]">
        {row.getValue('id')}
      </span>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge variant="neutral">{row.original.type}</Badge>
        <span className="text-[13.5px] font-medium text-[var(--t1)]">
          {row.getValue('title')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => <PriorityBadge priority={row.getValue('priority')} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: 'actions',
    cell: ({ row }) => <TaskActionsMenu task={row.original} />,
    size: 48,
  },
]

// Table CSS:
// <table> className="w-full border-collapse text-[13.5px]"
// <th>    className="text-[11px] font-semibold uppercase tracking-[0.07em] 
//                    text-[var(--t3)] px-[14px] py-[10px] text-left 
//                    border-b border-[var(--bdr)] bg-[var(--sur2)] whitespace-nowrap"
// <td>    className="px-[14px] py-[11px] text-[var(--t2)] 
//                    border-b border-[var(--bdr)] align-middle"
// <tr>    className="transition-colors cursor-pointer hover:bg-[var(--sur2)]"
// last row td: className="border-b-0"
```

---

## 5. Status + Priority Badges

```tsx
const statusConfig = {
  'Backlog':     { icon: CircleDashed,  variant: 'neutral'     },
  'Todo':        { icon: Circle,        variant: 'neutral'     },
  'In Progress': { icon: LoaderCircle, variant: 'default'     }, // blue
  'Done':        { icon: CheckCircle2, variant: 'success'     }, // green
  'Canceled':    { icon: XCircle,       variant: 'destructive' }, // red
} as const

const priorityConfig = {
  'Low':    { icon: ArrowDown,   variant: 'neutral'  },
  'Medium': { icon: Minus,       variant: 'neutral'  },
  'High':   { icon: ArrowUp,     variant: 'destructive' },
  'Urgent': { icon: ChevronsUp,  variant: 'destructive' },
} as const

// Badge layout: inline-flex items-center gap-[5px] py-[2px] px-[7px] rounded-full
// Icon inside badge: w-[11px] h-[11px]
```

---

## 6. Project Card

```tsx
// Card: bg-[var(--sur)] border border-[var(--bdr)] rounded-[10px] p-5 cursor-pointer
//       hover:bg-[var(--sur2)] transition-colors

// Color dot: w-[10px] h-[10px] rounded-full bg-{project.color}
// Progress bar container: h-[4px] bg-[var(--sur3)] rounded-full overflow-hidden
// Progress bar fill: h-full rounded-full bg-{project.color} transition-[width]

// Stacked avatars:
// Each: w-[22px] h-[22px] rounded-full border-2 border-[var(--sur)]
//       flex items-center justify-center
// 2nd+: -ml-[6px]
```

---

## 7. Activity Timeline Item

```tsx
// Outer wrapper: flex items-start gap-[14px] mb-3
// Vertical line: absolute left-[17px] top-1 bottom-0 w-[1.5px] bg-[var(--bdr)]

// Icon circle: w-9 h-9 rounded-full border-[2.5px] border-[var(--bg)]
//              flex items-center justify-center flex-shrink-0
//              relative z-10 bg-{iconBg}
// Icon inside: w-[14px] h-[14px] text-{iconColor}

// Card: bg-[var(--sur)] border border-[var(--bdr)] rounded-[10px] flex-1 p-[12px_16px]
// Title: text-[13.5px] font-semibold text-[var(--t1)]
// Timestamp: text-[11.5px] text-[var(--t3)] pl-3 whitespace-nowrap
// Body: text-[13px] text-[var(--t2)] leading-relaxed mb-2
// Meta badge: neutral variant, text-[11px]
```

---

## 8. Chat Message Bubble

```tsx
// Wrapper: flex items-end gap-2
// Mine: flex-row-reverse
// Theirs: flex-row

// Avatar (small, 26px):
// Mine:   bg-[#1e8ec8] (primary)
// Theirs: bg-{contact.color}

// Bubble:
// Mine:   bg-[var(--pri)] text-white
//         rounded-[18px_18px_4px_18px] px-[14px] py-[10px]
// Theirs: bg-[var(--sur)] border border-[var(--bdr)] text-[var(--t1)]
//         rounded-[18px_18px_18px_4px] px-[14px] py-[10px]
// Both:   text-[13.5px] leading-relaxed max-w-[360px]

// Timestamp: text-[11px] text-[var(--t3)] mt-1
// Mine:   text-right
// Theirs: text-left
```

---

## 9. Invite User / Create Task Modals

Both use shadcn/ui `<Dialog>`. Key measurements:

```tsx
// DialogContent width overrides:
// Invite:      max-w-[440px]
// Create Task: max-w-[500px]

// Modal padding: p-7
// Header: flex items-center justify-between mb-5
// Title: text-[17px] font-bold text-[var(--t1)]
// Close X: ibtn (32×32 icon button)
// Fields stack: flex flex-col gap-[14px]
// Label: text-[12.5px] font-medium text-[var(--t2)] mb-[5px] block
// Input: full-width, border-[1.5px] border-[var(--bdr2)], focus: border-pri + ring

// Info banner (Invite modal):
// bg-[var(--pris)] border border-[rgba(30,142,200,.18)] rounded-md p-[11px_14px]
// flex items-center gap-2
// Icon: w-[14px] h-[14px] text-[var(--pri)]
// Text: text-[13px] text-[var(--t2)]

// Footer: flex gap-2 mt-6
// Primary: btn-primary flex-1
// Secondary: btn-outline
```

---

## 10. Dropdown Menu

```tsx
// Dropdown card: bg-[var(--sur)] border border-[var(--bdr)] rounded-[10px]
//               p-[5px] shadow-[var(--shd)] z-[300]
//               animate-[dropin_150ms_ease-out]

// Menu item (.ddi): flex items-center gap-[9px] px-[9px] py-[7px] rounded-md
//                   cursor-pointer text-[13px] text-[var(--t2)]
//                   hover:bg-[var(--sur3)] hover:text-[var(--t1)]
// Item icon:   w-[14px] h-[14px] text-[var(--t3)]
// Divider:     h-px bg-[var(--bdr)] my-1
// Danger item: text-[var(--err)] — icon also var(--err)

// Notification dropdown: width 340px, positioned top-[calc(100%+8px)] right-0
// User dropdown:         min-width 200px, positioned top-[calc(100%+8px)] right-0
```

---

## 11. Command Palette

```tsx
// Use shadcn/ui <CommandDialog> — wraps everything in a modal with keyboard nav

// Customizations vs default:
// Width: 560px (override DialogContent max-w)
// Border radius: 12px
// Search input: text-[15px], no border, no outline, placeholder text-[var(--t3)]
// Section heading: text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--t3)]
// Row: flex items-center gap-[10px] px-[10px] py-2 rounded-md text-[13px]
//      hover:bg-[var(--pris)] hover:text-[var(--t1)]
// Footer: flex gap-4 px-[14px] py-2 border-t border-[var(--bdr)]
//         text-[11.5px] text-[var(--t3)]
// Kbd hint: bg-[var(--sur3)] border border-[var(--bdr2)] rounded px-1.5 py-px
//           text-[10.5px] mr-1
```

---

## 12. Skeleton Loader

```tsx
// CSS:
// background: linear-gradient(90deg, var(--sur2) 25%, var(--sur3) 50%, var(--sur2) 75%)
// background-size: 200% 100%
// animation: shimmer 1.4s ease-in-out infinite
// border-radius: 4px

// Use shadcn/ui <Skeleton> — already uses a shimmer animation
// Override its bg colors to match the dark palette
```

---

## 13. Page Transition

Wrap each page's root element:

```tsx
// className="animate-[slideup_180ms_ease]"

// Or with Framer Motion (optional):
<motion.div
  initial={{ opacity: 0, y: 6 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.18, ease: 'easeOut' }}
>
  {/* page content */}
</motion.div>
```

---

## 14. Live Pulse Dot

Used on Monitoring nav item and Activity page header:

```tsx
<span className="w-[7px] h-[7px] rounded-full bg-[var(--ok)] 
                 animate-[pulse_2s_ease-in-out_infinite]" />

// + "Live" label:
<span className="text-[12.5px] text-[var(--ok)] font-medium">Live</span>
```

---

## 15. Progress Bar

```tsx
// Use shadcn/ui <Progress> — override indicator color per-project:
<Progress
  value={progress}
  className="h-1 bg-[var(--sur3)]"
  style={{ '--progress-color': project.color } as React.CSSProperties}
/>

// Or inline div pattern:
<div className="h-1 bg-[var(--sur3)] rounded-full overflow-hidden">
  <div
    className="h-full rounded-full transition-[width]"
    style={{ width: `${progress}%`, background: color }}
  />
</div>
```

---

## 16. Notification Pip

Red badge on top-right of icon button:

```tsx
<div className="relative">
  <Button variant="ghost" size="icon">
    <Bell className="w-[15px] h-[15px]" />
    <span className="absolute top-1 right-1 w-[15px] h-[15px]
                     bg-[var(--err)] text-white text-[9px] font-bold
                     rounded-full flex items-center justify-center
                     border-2 border-[var(--bg)] pointer-events-none">
      3
    </span>
  </Button>
</div>
```

---

## 17. Card Shell

```tsx
// .card equivalent:
<div className="bg-[var(--sur)] border border-[var(--bdr)] rounded-[10px] overflow-hidden">
  {/* Card header (.ch) */}
  <div className="px-[22px] py-[16px] pb-[14px] border-b border-[var(--bdr)]
                  flex items-center justify-between">
    ...
  </div>
  {/* Card body (.cp) */}
  <div className="p-[20px_22px]">
    ...
  </div>
</div>
```

---

## 18. Form Input

```tsx
// .inp equivalent:
<input
  className="w-full px-3 py-2 border-[1.5px] border-[var(--bdr2)] rounded-md
             text-[13.5px] text-[var(--t1)] bg-[var(--sur)]
             outline-none font-sans transition-[border-color,box-shadow]
             focus:border-[var(--pri)] focus:shadow-[0_0_0_3px_var(--pris)]
             placeholder:text-[var(--t3)]"
/>
// Use shadcn/ui <Input> and override with these classes
```

---

## 19. Button Variants

```tsx
// .btn.bp — Primary:
className="inline-flex items-center gap-[6px] px-[14px] py-[7px] rounded-md
           text-[13px] font-medium bg-[var(--pri)] text-white
           hover:bg-[var(--prih)] transition-colors"

// .btn.bs — Secondary/Outline:
className="inline-flex items-center gap-[6px] px-[14px] py-[7px] rounded-md
           text-[13px] font-medium bg-[var(--sur)] text-[var(--t2)]
           border border-[var(--bdr2)]
           hover:bg-[var(--sur3)] hover:text-[var(--t1)] transition-colors"

// .ibtn — Icon button (32×32):
className="inline-flex items-center justify-center w-8 h-8 rounded-md
           text-[var(--t2)] border-none bg-transparent cursor-pointer
           hover:bg-[var(--sur3)] hover:text-[var(--t1)] transition-colors"
// Icon inside: w-[15px] h-[15px]
```

---

## 20. Scrollbar Styling

```css
/* globals.css */
::-webkit-scrollbar       { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--bdr2); border-radius: 99px; }
```
