# Implementation Guide

Step-by-step instructions for converting the design prototype into a working React application using the `satnaing/shadcn-admin` codebase.

---

## Step 1 — Clone & Run the Base Repo

```bash
git clone https://github.com/satnaing/shadcn-admin.git
cd shadcn-admin
pnpm install
pnpm dev
```

Open `http://localhost:5173` alongside the prototype HTML to compare.

The repo already includes:
- ✅ Collapsible sidebar with nav groups
- ✅ Top header with ⌘K command menu (shadcn `<CommandDialog>`)
- ✅ Theme toggle (dark/light)
- ✅ Tasks page with TanStack Table
- ✅ shadcn/ui component library
- ✅ Recharts for charts

---

## Step 2 — Install Additional Dependencies

```bash
pnpm add lucide-react                   # already included
pnpm add @tanstack/react-table          # already included
pnpm add recharts                       # already included
pnpm add react-hook-form zod            # for modal forms
pnpm add zustand                        # global state (theme, sidebar)
pnpm add class-variance-authority clsx  # already included
```

---

## Step 3 — Apply Design Tokens

### 3a. Update `src/index.css`

Replace or merge the `:root` and `.dark` blocks with the tokens from `design-tokens.md`. Key changes:
- Background: `#06090f` (much darker than default)
- Sidebar: `#080c15` (slightly different from page bg)
- Primary: `#1e8ec8` (cool blue, not the shadcn default)
- Borders: `#1a2540` (blue-tinted dark)

### 3b. Update `tailwind.config.ts`

Add the extended color and animation tokens from `design-tokens.md`.

### 3c. Add Google Fonts

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
```

Or use `fontsource`:
```bash
pnpm add @fontsource/inter @fontsource/jetbrains-mono
```
```ts
// main.tsx
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
```

### 3d. Add Scrollbar Styles

```css
/* src/index.css */
::-webkit-scrollbar       { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 99px; }
```

---

## Step 4 — Extend the Sidebar

The shadcn-admin sidebar already uses the `<Sidebar>` component from shadcn/ui. Extend `src/components/layout/app-sidebar.tsx`:

```tsx
// Add these nav groups to match the design:
const navItems = [
  // No group (top level)
  { title: 'Dashboard',  url: '/',              icon: LayoutDashboard },
  { title: 'Tasks',      url: '/tasks',          icon: ListChecks,     badge: '20', badgeVariant: 'primary' },
  { title: 'Chat',       url: '/chat',           icon: MessageSquare,  badge: '4',  badgeVariant: 'error' },

  // People & Access
  { group: 'People & Access' },
  { title: 'Users',         url: '/users',         icon: Users,          badge: '2.4k', badgeVariant: 'neutral' },
  { title: 'Roles',         url: '/roles',          icon: Shield },
  { title: 'Permissions',   url: '/permissions',    icon: Lock },
  { title: 'Teams',         url: '/teams',          icon: Users2 },
  { title: 'Organizations', url: '/organizations',  icon: Building2 },

  // Projects
  { group: 'Projects' },
  { title: 'Projects',  url: '/projects',  icon: FolderKanban },
  { title: 'Activity',  url: '/activity',  icon: Activity },

  // Analytics & Logs
  { group: 'Analytics & Logs' },
  { title: 'Analytics',   url: '/analytics',   icon: BarChart3 },
  { title: 'Audit Logs',  url: '/audit-logs',  icon: FileText },
  { title: 'Logs',        url: '/logs',         icon: Terminal },
  { title: 'Monitoring',  url: '/monitoring',   icon: Monitor,    liveDot: true },

  // Configuration
  { group: 'Configuration' },
  { title: 'Notifications', url: '/notifications', icon: Bell,     badge: '3', badgeVariant: 'error' },
  { title: 'Integrations',  url: '/integrations',  icon: Link2 },
  { title: 'API Keys',      url: '/api-keys',       icon: KeyRound },

  // Settings
  { group: 'Settings' },
  { title: 'Settings',  url: '/settings',  icon: Settings },
  { title: 'Billing',   url: '/billing',   icon: CreditCard },
  { title: 'Security',  url: '/security',  icon: ShieldCheck },
  { title: 'Sessions',  url: '/sessions',  icon: Laptop },
]
```

**Collapsed state** — when sidebar width = 52px, hide:
- Text labels (`.nlbl`)
- Badges (`.nbdg`)
- Group labels
- Workspace name + plan
- User info text

---

## Step 5 — Update the Header

Extend `src/components/layout/top-nav.tsx` (or equivalent):

```tsx
// Header height: 52px
// Contents (left → right):
// 1. Sidebar toggle button (PanelLeft icon)
// 2. Breadcrumb (Home / [Page Title])
// 3. Spacer (flex-1)
// 4. Search button (opens ⌘K CommandDialog)
// 5. Notifications bell (with red badge pip)
// 6. Theme toggle
// 7. Globe icon (locale)
// 8. User menu (Avatar + name + role + ChevronDown)
```

---

## Step 6 — Tasks Page (Extend Existing)

The shadcn-admin repo already has a tasks page. Extend it:

1. **Add status tab filter** — array of tabs `['all', 'Backlog', 'Todo', 'In Progress', 'Done', 'Canceled']`, filter TanStack Table by column
2. **Add task ID column** — monospace font, e.g. `TASK-0001`
3. **Add type badge** — Bug / Feature / Documentation / Enhancement / Task (all neutral gray)
4. **Update status badges** — match icons from `component-patterns.md`
5. **Update priority badges** — match icons
6. **"Add Task" button** → opens `<CreateTaskDialog />`
7. **Update seed data** — 20 tasks from `page-specs.md`

---

## Step 7 — New Pages (Recommended Build Order)

Build in this sequence (each builds on patterns from the previous):

```
1. Dashboard          (KPI cards + charts)
2. Users              (table + Invite User dialog)
3. Projects           (card grid)
4. Activity           (timeline)
5. Organizations      (table with stats row)
6. Permissions        (matrix table)
7. Chat               (split panel)
8. Analytics          (charts + donut + table)
9. Monitoring         (service grid + charts)
10. API Keys          (table with masked keys)
11. Integrations      (app grid + webhooks)
12. Notifications     (inbox)
13. Billing           (plan + usage + invoices)
14. Security          (forms + login history)
15. Sessions          (device cards)
16. Settings          (form sections)
17. Roles             (role cards)
18. Teams             (team cards)
19. Audit Logs        (timestamped table)
20. System Logs       (terminal viewer)
```

---

## Step 8 — Modals

### Invite User Dialog

```tsx
// src/features/users/components/invite-user-dialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  name:  z.string().optional(),
  role:  z.enum(['Viewer', 'Developer', 'Analyst', 'Manager', 'Admin']),
  team:  z.string(),
})

export function InviteUserDialog({ open, onOpenChange }) {
  const form = useForm({ resolver: zodResolver(schema) })
  // ...
}
```

### Create Task Dialog

```tsx
const schema = z.object({
  title:    z.string().min(1),
  desc:     z.string().optional(),
  status:   z.enum(['Backlog', 'Todo', 'In Progress', 'Done', 'Canceled']),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  type:     z.enum(['Bug', 'Feature', 'Documentation', 'Enhancement', 'Task']),
  assignee: z.string().optional(),
})
```

---

## Step 9 — Charts

All charts use **Recharts** (already a dep in shadcn-admin).

### Revenue Area Chart

```tsx
<ResponsiveContainer width="100%" height={152}>
  <AreaChart data={revenueData}>
    <defs>
      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#1e8ec8" stopOpacity={0.35} />
        <stop offset="100%" stopColor="#1e8ec8" stopOpacity={0.02} />
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--bdr)" vertical={false} />
    <XAxis dataKey="month" tick={{ fill: 'var(--t3)', fontSize: 10.5 }} axisLine={false} tickLine={false} />
    <YAxis hide />
    <Tooltip contentStyle={{ background: 'var(--sur)', border: '1px solid var(--bdr)', borderRadius: 8 }} />
    <Area type="monotone" dataKey="value" stroke="#1e8ec8" strokeWidth={2}
          fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: '#1e8ec8' }} />
  </AreaChart>
</ResponsiveContainer>
```

### User Growth Bar Chart

```tsx
<ResponsiveContainer width="100%" height={140}>
  <BarChart data={userGrowthData} barSize={20}>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--bdr)" vertical={false} />
    <XAxis dataKey="week" tick={{ fill: 'var(--t3)', fontSize: 10.5 }} axisLine={false} tickLine={false} />
    <YAxis hide />
    <Tooltip contentStyle={{ background: 'var(--sur)', border: '1px solid var(--bdr)', borderRadius: 8 }} />
    <Bar dataKey="users" fill="#3b82f6" radius={[3, 3, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

### Sparkline (KPI cards)

```tsx
<ResponsiveContainer width={80} height={28}>
  <LineChart data={data.map((v, i) => ({ i, v }))}>
    <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
  </LineChart>
</ResponsiveContainer>
```

---

## Step 10 — Theme Persistence

```ts
// src/stores/theme-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    set => ({
      theme: 'dark',
      toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'theme' }
  )
)
```

Apply to root:

```tsx
// src/App.tsx
const { theme } = useThemeStore()
return <div data-theme={theme} className="h-screen overflow-hidden ...">
```

---

## Tips

- **Start with the shell** (sidebar + header) before any page content — every page uses it
- **Mock all data locally first** using the seed data in `page-specs.md` — add API calls later
- **Use `<Skeleton>`** from shadcn/ui for loading states — matches the shimmer design exactly
- **Focus states** — add `focus-visible:ring-2 focus-visible:ring-[var(--pri)]` globally
- **Reduced motion** — wrap animation classes in `motion-safe:animate-*` Tailwind variants
- **Open the prototype** in a browser tab while developing — it's fully interactive and shows all states
