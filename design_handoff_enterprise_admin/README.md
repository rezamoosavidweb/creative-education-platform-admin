# Handoff: Enterprise Admin Dashboard

## Overview

A fully-featured, production-ready Enterprise Admin Dashboard built for SaaS platforms. The design covers 24 pages across people management, project tracking, analytics, billing, security, and system configuration. It was prototyped against the **[satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin)** repo — a React + shadcn/ui + Tailwind CSS + Vite + TypeScript stack.

---

## About the Design Files

The files in this bundle (`Enterprise Admin Dashboard.dc.html`, `Enterprise Admin - Design Spec.dc.html`) are **interactive HTML prototypes** — design references showing intended visual appearance, layout, spacing, interactions, and data structures. They are **not** production code to ship directly.

**Your task:** Recreate these designs inside the `satnaing/shadcn-admin` codebase using React, TypeScript, Tailwind CSS, and shadcn/ui components — following the existing file structure, routing conventions, and component patterns already established in that repo.

---

## Fidelity

**High-fidelity.** These are pixel-precise mockups with final colors, typography, spacing, component states, and interactions. Recreate the UI to match as closely as possible using shadcn/ui primitives and Tailwind utility classes.

---

## Tech Stack (shadcn-admin)

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v3 |
| UI Kit | shadcn/ui (Radix UI primitives) |
| Routing | TanStack Router (or React Router v6) |
| State | Zustand or React Context |
| Tables | TanStack Table v8 |
| Charts | Recharts (already in shadcn-admin) |
| Icons | Lucide React |
| Fonts | Inter (body) + JetBrains Mono (code/IDs) |

---

## Repository Structure

Map each design page to a file in the shadcn-admin project:

```
src/
├── routes/
│   ├── _authenticated/
│   │   ├── index.tsx              → Dashboard
│   │   ├── tasks/index.tsx        → Tasks
│   │   ├── chat/index.tsx         → Chat
│   │   ├── projects/index.tsx     → Projects
│   │   ├── activity/index.tsx     → Activity
│   │   ├── users/index.tsx        → Users
│   │   ├── roles/index.tsx        → Roles
│   │   ├── permissions/index.tsx  → Permissions
│   │   ├── teams/index.tsx        → Teams
│   │   ├── organizations/index.tsx → Organizations
│   │   ├── analytics/index.tsx    → Analytics
│   │   ├── audit-logs/index.tsx   → Audit Logs
│   │   ├── logs/index.tsx         → System Logs
│   │   ├── monitoring/index.tsx   → Monitoring
│   │   ├── api-keys/index.tsx     → API Keys
│   │   ├── integrations/index.tsx → Integrations
│   │   ├── notifications/index.tsx → Notifications
│   │   ├── billing/index.tsx      → Billing
│   │   ├── security/index.tsx     → Security
│   │   ├── sessions/index.tsx     → Sessions
│   │   └── settings/index.tsx     → Settings
│   └── profile/index.tsx          → Profile
├── components/
│   ├── layout/
│   │   ├── app-sidebar.tsx        → Sidebar component
│   │   ├── top-nav.tsx            → Header/topbar
│   │   └── command-menu.tsx       → ⌘K palette
│   ├── ui/                        → shadcn/ui primitives (auto-generated)
│   └── charts/
│       ├── revenue-chart.tsx
│       ├── users-chart.tsx
│       └── sparkline.tsx
└── data/
    ├── tasks.ts
    ├── users.ts
    ├── organizations.ts
    └── projects.ts
```

---

## Design Tokens

See `design-tokens.md` for the full token list. Summary:

### Colors — Dark Theme (default)
```
Background:      #06090f
Sidebar bg:      #080c15
Surface:         #0e1420
Surface 2:       #141c2c
Surface 3:       #1b2538
Border:          #1a2540
Border 2:        #243352
Text primary:    #e8edf5
Text secondary:  #8896aa
Text tertiary:   #4f6075
Primary:         #1e8ec8
Primary hover:   #2399d8
Primary subtle:  rgba(30,142,200,.10)
Success:         #22c55e
Warning:         #f59e0b
Error:           #ef4444
Info:            #3b82f6
```

### Colors — Light Theme
```
Background:      #f0f4f8
Sidebar bg:      #ffffff
Surface:         #ffffff
Surface 2:       #f8f9fb
Border:          #e2e8f0
Text primary:    #0f1117
Text secondary:  #475569
Text tertiary:   #94a3b8
Primary:         #005184
```

### Typography
```
Font family:     'Inter', system-ui, sans-serif
Mono font:       'JetBrains Mono', monospace (task IDs, log output)

Page titles:     22px / 700 / tracking -0.025em
Section headers: 14px / 600
Table headers:   11px / 600 / uppercase / tracking 0.07em
Body:            13.5px / 400
Body small:      13px / 400
Label:           12.5px / 500
Micro:           11–12px / 400
```

### Spacing
```
Page padding:    28px 32px (desktop), 20px 16px (mobile)
Card padding:    20px 22px
Card header:     16px 22px 14px
Table cell:      11px 14px
Gap scale:       4 / 6 / 8 / 10 / 12 / 16 / 20 / 24 / 28 / 32px
```

### Borders & Radius
```
Card radius:     10px
Button radius:   6px
Badge radius:    99px (pill)
Avatar radius:   99px (circle), 8px (square logos)
Input radius:    6px
Dropdown radius: 10px
```

### Shadows
```
Dropdown/modal:  0 8px 32px rgba(0,0,0,.48), 0 2px 8px rgba(0,0,0,.32)
Light shadow:    0 8px 24px rgba(0,0,0,.10), 0 2px 6px rgba(0,0,0,.06)
```

---

## Layout Architecture

### Shell
```
┌─────────────────────────────────────────────────────┐
│ Sidebar (240px / 52px collapsed)                    │
│ ┌────────────────────────────────────────────────┐  │
│ │ Header (52px height)                           │  │
│ │ ┌────────────────────────────────────────────┐ │  │
│ │ │ Page area (flex:1, overflow-y:auto)        │ │  │
│ │ └────────────────────────────────────────────┘ │  │
│ └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

- Root: `display:flex; height:100vh; overflow:hidden`
- Sidebar: fixed width 240px, collapses to 52px (icons only), mobile: off-canvas sheet
- Header: `height:52px`, sticky, `z-index:100`
- Page area: `flex:1; overflow-y:auto` — the only scroll container

### Sidebar States
1. **Expanded** (240px): logo + text labels visible
2. **Collapsed** (52px): icons only, labels hidden via `display:none`
3. **Mobile** (<768px): fixed position, off-canvas, triggered by hamburger

---

## Sidebar Navigation Structure

```
[Workspace switcher]
[Search / ⌘K trigger]

─ (no group label) ─
  Dashboard
  Tasks        [badge: 20 blue]
  Chat         [badge: 4 red]

─ People & Access ─
  Users        [badge: 2.4k neutral]
  Roles
  Permissions
  Teams
  Organizations

─ Projects ─
  Projects
  Activity

─ Analytics & Logs ─
  Analytics
  Audit Logs
  Logs
  Monitoring   [live green dot pulse]

─ Configuration ─
  Notifications [badge: 3 red]
  Integrations
  API Keys

─ Settings ─
  Settings
  Billing
  Security
  Sessions

[Bottom: user avatar + name + email]
```

---

## Header / Topbar

Left to right:
1. **Collapse toggle** — icon button (menu/panel-left icon), toggles sidebar
2. **Breadcrumb** — `Home > [Current Page]`, clicking Home goes to Dashboard
3. **Spacer** (flex:1)
4. **Search bar** — ghost button style, opens ⌘K palette on click
5. **Notifications bell** — icon button with red badge pip (count: 3), click opens dropdown
6. **Theme toggle** — sun/moon icon button
7. **Globe** — icon button (locale/language, non-functional in prototype)
8. **User menu** — avatar + name + role chip, click opens dropdown

---

## ⌘K Command Palette

- Triggered by `⌘K` (Mac) / `Ctrl+K` (Win) or clicking Search
- Full-screen backdrop `rgba(0,0,0,.52)`, click outside to close
- `ESC` key closes
- `560px` wide card, `border-radius:12px`
- Sections: **Pages** (navigate), **Actions** (invite user, new project, create API key, toggle theme)
- Footer: `↑↓` navigate · `↵` open · `ESC` close

**Implementation:** Use shadcn/ui `<CommandDialog>` — it handles keyboard nav, backdrop, and search filtering out of the box.

---

## Pages — Detailed Specs

### 1. Dashboard

**Layout:** 1-column page content with max-width 1400px, centered.

**KPI Row** — 4-column CSS grid, `gap:16px`:
| Card | Value | Icon | Color | Badge |
|---|---|---|---|---|
| Total Revenue | $128,420 | trending-up | primary | +12.4% green |
| Active Users | 24,891 | users | info blue | +8.1% green |
| Conversion Rate | 3.24% | percent | warning | +0.6% green |
| API Requests | 1.24M | zap | success | +21.3% green |

Each KPI card:
- Padding: 20px 22px
- Title: 12px / 500 / text-tertiary
- Icon: 32×32 rounded-lg bg (subtle tint), 15×15 icon inside
- Value: 26px / 700 / text-primary / tabular-nums
- Trend badge: inline-flex, icon + percentage, green = `var(--ok)`
- Sparkline (SVG area chart, ~80×28): rendered as SVG path — see `design-tokens.md` for data
- "vs last month" label: 11.5px / text-tertiary

**Charts Row** — 2-column grid `1.6fr 1fr`:
- Left: Revenue Overview (area/bar chart, 12-month, height 152px)
- Right: New Users bar chart (8 weeks, height 140px)

**Both** use Recharts. Revenue = `<AreaChart>` with gradient fill. Users = `<BarChart>`.

**Bottom Row** — 2-column grid `1fr 1fr`:
- Left: Recent Users table (last 5 users, columns: avatar+name, role, status, joined)
- Right: Activity feed (last 6 events, icon + text + time)

---

### 2. Tasks (⭐ Signature Page)

**Implementation:** Use `@tanstack/react-table` — exactly how shadcn-admin's existing tasks page works.

**Toolbar:**
- Filter input (search box)
- Dropdown filters: Status, Priority, Type
- Right: View options button

**Tab bar** (Backlog / Todo / In Progress / Done / Canceled / All):
- Active tab: `border-bottom: 2px solid var(--pri)`, font-weight 600
- Each tab shows live count badge

**Table columns:**
| Column | Width | Notes |
|---|---|---|
| Checkbox | 40px | Select row |
| Task ID | 90px | `font-family: JetBrains Mono`, e.g. TASK-0001 |
| Title | flex | Type badge (Bug/Feature/etc) + title text |
| Status | 120px | Icon + label badge |
| Priority | 100px | Icon + label badge |
| Actions | 48px | `...` icon button → context menu |

**Status badges:**
- Backlog: neutral gray `bx`
- Todo: neutral gray `bx`
- In Progress: blue `bl`
- Done: green `bg`
- Canceled: red `br`

**Priority badges + icons:**
- Low: gray / `arrow-down`
- Medium: gray / `minus`
- High: red / `arrow-up`
- Urgent: red / `chevrons-up`

**Type badges:** All neutral gray (`bx`) — Bug, Feature, Documentation, Enhancement, Task

**Pagination bar:** rows-per-select (15/20/30/50) + "Page N of M" + first/prev/next/last buttons

**"Add Task" button** → opens Create Task modal (see Modals section).

---

### 3. Chat

**Layout:** Full-height split panel, no page padding.

**Left panel** (300px wide, border-right):
- Header: "Direct Messages" title + search input
- Contact list: scrollable
  - Each row: 68px height, avatar (40px circle) + online dot + name + timestamp + preview text + unread badge
  - Active contact: `background: var(--pris)`, `border-left: 3px solid var(--pri)`
  - Online dot: 9px green circle at bottom-right of avatar

**Right panel** (flex:1):
- Header: active contact avatar + name + online status + action buttons (phone/video/info/more)
- Message feed: flex-column, gap 10px, padded 20px, overflow-y auto
  - **Their messages:** avatar left, bubble `border-radius: 18px 18px 18px 4px`, bg `var(--sur)`, border
  - **My messages:** avatar right, bubble `border-radius: 18px 18px 4px 18px`, bg `var(--pri)`, white text
  - Timestamp below bubble: 11px / text-tertiary, text-align matches side
- Compose bar: paperclip + text input (pill shape, `border-radius:99px`) + emoji + send button (pri circle)

---

### 4. Projects

**Layout:** Card grid, 3 columns, `gap:16px`.

Each project card:
- Color dot (10px circle) + project name + status badge
- `...` menu button (top-right)
- Description: 2-line max, 12.5px
- Progress bar: labeled with percentage, color matches project accent
- Footer: 3 overlapping avatars (–6px margin-left) + task count + due date

**Status colors:**
- Active: green `bg`
- Completed: blue `bl`
- Archived: neutral `bx`

**Filter tabs** above grid: All (9) / Active (6) / Completed (2) / Archived (1)

---

### 5. Activity (Timeline)

**Layout:** Single column, max-width 760px, centered.

- Vertical line: `position:absolute; left:17px; width:1.5px; background:var(--bdr)`
- Each event: icon circle (36px, z-index:1 over line) + card (flex:1)
- **Date separators:** "Today" / "Yesterday" / "Jun 26" — shown when date changes
- "Live" indicator (green pulse dot) in page header

**Icon colors by category:**
- Users: primary blue
- Projects: purple `#8b5cf6`
- API Keys: warning amber
- Security: error red
- Settings: text-secondary
- System/Billing/Monitoring: success green / warning

---

### 6. Users

**Toolbar:** Search + Status filter + Role filter + Import/Export buttons + **Invite User** button (primary)

**Table columns:** Avatar+name+email / Role badge / Status badge / Last active / Joined date / Actions menu

**Status:** Active (green), Inactive (gray), Suspended (red)

**"Invite User"** → opens Invite User modal.

---

### 7. Organizations

**Stats row** (4-column): Total Orgs (142) / Active (138 green) / Enterprise Plan (24 blue) / Total Members (8,291)

**Table:** Org logo+name+slug / Plan badge / Member count / Status / Admin name / Created date / Actions

**Plan badges:** Enterprise (blue `bl`) / Professional (green `bg`) / Standard (neutral `bx`)

---

### 8. Permissions Matrix

**Layout:** Table where rows = permissions, columns = roles.

Roles: Viewer / Developer / Analyst / Manager / Admin / Super Admin

Permissions (18 rows grouped):
- **User Management:** View Users, Invite Users, Edit Users, Delete Users, Manage Roles
- **Content:** View Content, Create Content, Edit Content, Delete Content, Publish Content
- **Analytics:** View Analytics, Export Reports, View Audit Logs
- **System:** Manage API Keys, Manage Integrations, View Billing, Manage Billing, System Settings

Each cell: green check-circle (allowed) or red x-circle (denied).

---

### 9. Analytics

**Metrics row** (4 KPIs): Total Visits / Unique Visitors / Bounce Rate / Avg Session

**Main chart:** Traffic over time (line chart, 6 months)

**Bottom row:**
- Left: Traffic Sources donut chart (Organic / Direct / Referral / Social / Email)
- Right: Top Pages table (URL / Views / Unique / Bounce Rate / Trend)

---

### 10. Monitoring

**System health grid** (4-col, then 3-col): 12 services with status dot + name + uptime % + latency.

Status: Operational (green) / Degraded (amber) / Outage (red)

**Charts:** CPU Usage (area chart) + Memory Usage (area chart) — both real-time style, 24h

---

### 11. Billing

**Plan card:** Current plan name + description + price/mo + features list + Upgrade/Manage button

**Usage bars:** API Calls / Storage / Team Members / Projects — each with `<Progress>` bar + current/limit

**Invoice table:** Invoice # / Date / Amount / Status (Paid green / Pending amber) / Download button

---

### 12. Settings

Sections with form fields:
- **Workspace:** Name, Slug (read-only), Logo upload, Description
- **Access:** Require 2FA toggle, Allowed email domains, Default member role
- **Danger Zone:** Delete workspace (red destructive button, requires confirm)

---

## Modals

### Invite User Modal
- Width: 440px, `border-radius:10px`, backdrop `rgba(0,0,0,.52)`
- Fields: Email (required), Full name (optional), Role (select), Team (select)
- Info banner: blue tint, info icon, "Invitation expires in 7 days"
- Actions: **Send Invitation** (primary, flex:1) + Cancel

**shadcn/ui:** `<Dialog>` + `<DialogContent>` + `<Form>` (react-hook-form + zod)

### Create Task Modal
- Width: 500px
- Fields: Title, Description (textarea, resizable), Status (select), Priority (select), Type (select), Assignee (select) — last 4 in a 2-column grid
- Actions: **Create Task** (primary, flex:1) + Cancel

---

## Interactions & Behavior

### Sidebar collapse
- Toggle button in header (panel-left / menu icon)
- Width animates: `240px → 52px` in `200ms cubic-bezier(.4,0,.2,1)`
- Collapsed: hide all text labels, badges, group labels, workspace name/plan
- Collapsed: nav items center their icons (`justify-content:center; padding:7px`)

### Theme toggle
- Stored in `localStorage` key `theme`
- Toggle sets `data-theme="dark"|"light"` on the root `<div>`
- All CSS vars swap via the `[data-theme]` selectors

### Task tab filter
- Clicking a tab sets active state (`border-bottom:2px solid var(--pri)`)
- Filters the TanStack Table by `status` column
- Counts update reactively

### Notification dropdown
- Click bell → dropdown appears below (`top: calc(100% + 8px)`, right-aligned)
- Click outside → closes
- "Mark all read" → clears all dots

### Chat contact switching
- Click a contact row → sets active contact, highlights with left border + subtle bg
- Message feed re-renders with that contact's conversation
- Unread badge clears when contact is selected

### Page transitions
- Each page animates in: `opacity: 0 → 1, translateY(6px → 0)` in `180ms ease`
- Keyframe: `@keyframes slideup`

### Animations
- Skeleton loading: shimmer `@keyframes shimmer` on `background-position`
- Live dot pulse: `@keyframes pulse` scale 1→0.82, opacity 1→0.6, 2s infinite
- Dropdown entrance: `@keyframes dropin` (opacity + translateY(-5px) + scale(0.97))

---

## Component Reference (shadcn/ui)

| Design element | shadcn/ui component |
|---|---|
| ⌘K palette | `<CommandDialog>` |
| Modals | `<Dialog>` |
| Dropdown menus | `<DropdownMenu>` |
| Select fields | `<Select>` |
| Tables | `<Table>` + TanStack Table |
| Progress bars | `<Progress>` |
| Badges/chips | `<Badge>` |
| Tabs | `<Tabs>` |
| Tooltips | `<Tooltip>` |
| Toasts | `<Sonner>` / `<Toast>` |
| Sidebar | `<Sheet>` (mobile), custom (desktop) |
| Form fields | `<Input>`, `<Textarea>`, `<Label>` |
| Checkboxes | `<Checkbox>` |
| Toggles | `<Switch>` |
| Avatars | `<Avatar>` |
| Separators | `<Separator>` |
| Skeleton | `<Skeleton>` |

---

## State Management

```ts
// Global app state (Zustand recommended)
interface AppStore {
  theme: 'dark' | 'light'
  sidebarCollapsed: boolean
  commandOpen: boolean
  
  // Per-page
  taskFilter: 'all' | 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Canceled'
  activeChatContact: number
  
  // Actions
  toggleTheme: () => void
  toggleSidebar: () => void
  openCommand: () => void
  closeCommand: () => void
}
```

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| ≥1100px | 4-column KPI grid, 2-column chart row |
| 769–1099px | 2-column KPI grid, stacked charts |
| ≤768px | Sidebar off-canvas (Sheet), 1-column everything, reduced padding |

---

## Assets

- **Icons:** Lucide React (`lucide-react` npm package) — all icons referenced by name in the prototype
- **Fonts:** Google Fonts — Inter (300/400/500/600/700) + JetBrains Mono (400/500) — or use Next/font / Fontsource
- **Charts:** Recharts (already a dependency in shadcn-admin)
- **No custom images** — all avatars are initials-based colored circles

---

## Files in This Bundle

| File | Description |
|---|---|
| `README.md` | This document — full implementation guide |
| `design-tokens.md` | All CSS variables, color palettes, spacing, typography |
| `component-patterns.md` | Reusable UI patterns with Tailwind + shadcn/ui equivalents |
| `page-specs.md` | Per-page data schemas and component tree outlines |
| `Enterprise Admin Dashboard.dc.html` | Full interactive prototype — open in browser |
| `Enterprise Admin - Design Spec.dc.html` | Design spec reference |

---

## Quick Start

```bash
# 1. Clone the shadcn-admin repo
git clone https://github.com/satnaing/shadcn-admin.git
cd shadcn-admin

# 2. Install dependencies
pnpm install   # or npm install

# 3. Start dev server
pnpm dev

# 4. Open the prototype alongside
open "Enterprise Admin Dashboard.dc.html"

# 5. Build page by page, starting with:
#    - Layout shell (sidebar + header) — matches existing shadcn-admin shell
#    - Dashboard KPI cards
#    - Tasks table (closest to existing shadcn-admin tasks page)
#    - Then remaining pages in priority order
```

---

## Implementation Priority

1. **Shell** — sidebar groups + header with ⌘K (already ~80% done in shadcn-admin)
2. **Dashboard** — KPI cards + charts
3. **Tasks** — extend existing shadcn-admin tasks page with new columns + tab filter
4. **Users** — table + Invite User modal
5. **Projects** — card grid
6. **Activity** — timeline
7. **Organizations** — table
8. **Remaining** — Analytics, Monitoring, Billing, Settings, Security, etc.
