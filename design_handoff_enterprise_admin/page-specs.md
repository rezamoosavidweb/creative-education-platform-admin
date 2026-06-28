# Page Specs & Data Schemas

Per-page data models, component trees, and implementation notes.

---

## Data Schemas

### Task

```ts
type TaskStatus   = 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Canceled'
type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
type TaskType     = 'Bug' | 'Feature' | 'Documentation' | 'Enhancement' | 'Task'

interface Task {
  id:       string      // e.g. "TASK-0001"
  title:    string
  type:     TaskType
  status:   TaskStatus
  priority: TaskPriority
  assignee?: string
  dueDate?:  string
  createdAt: string
}
```

### User

```ts
type UserRole   = 'Admin' | 'Manager' | 'Developer' | 'Analyst' | 'Viewer'
type UserStatus = 'Active' | 'Inactive' | 'Suspended'

interface User {
  id:         string
  name:       string
  email:      string
  role:       UserRole
  status:     UserStatus
  lastActive: string
  joinedAt:   string
  avatarColor: string  // hex
  initials:   string   // 2 chars
}
```

### Organization

```ts
type OrgPlan = 'Enterprise' | 'Professional' | 'Standard'

interface Organization {
  id:       string
  name:     string
  slug:     string   // e.g. "stripe.acme.com"
  plan:     OrgPlan
  members:  number
  status:   'Active' | 'Suspended'
  admin:    string
  created:  string
  logoColor: string  // hex, used for initials avatar
}
```

### Project

```ts
type ProjectStatus = 'Active' | 'Completed' | 'Archived'

interface Project {
  id:         string
  name:       string
  description: string
  status:     ProjectStatus
  color:      string    // hex accent
  progress:   number    // 0–100
  tasks:      number    // total tasks
  tasksDone:  number
  dueDate:    string    // e.g. "Jul 15"
  team:       string[]  // 3 member initials, e.g. ["JD","SC","MR"]
  createdAt:  string
}
```

### ActivityEvent

```ts
type EventCategory = 'Users' | 'Projects' | 'API Keys' | 'Security' | 
                     'Settings' | 'System' | 'Billing' | 'Teams' | 
                     'Monitoring' | 'Integrations'

interface ActivityEvent {
  id:       string
  title:    string
  body:     string
  icon:     string        // lucide icon name
  iconColor: string       // CSS color
  iconBg:   string        // CSS color (subtle tint)
  category: EventCategory
  time:     string        // relative, e.g. "2m ago"
  date:     string        // "today" | "yesterday" | "Jun 26"
}
```

### ChatContact

```ts
interface ChatContact {
  id:       string
  name:     string
  initials: string
  color:    string    // avatar hex
  online:   boolean
  time:     string    // last message time
  preview:  string    // last message preview
  unread:   number    // 0 = no badge
}

interface ChatMessage {
  id:     string
  from:   'me' | 'them'
  text:   string
  time:   string
}
```

---

## Page 1: Dashboard

### Component Tree

```
<DashboardPage>
  <PageHeader>
    <h1>Good morning, {user.name} 👋</h1>
    <p>{today} · Here's what's happening…</p>
    <Button>Export</Button>
    <Button variant="primary">New Project</Button>
  </PageHeader>

  <KPIGrid>  {/* 4-col grid */}
    <StatCard title="Total Revenue"    value="$128,420" trend="+12.4%" />
    <StatCard title="Active Users"     value="24,891"   trend="+8.1%"  />
    <StatCard title="Conversion Rate"  value="3.24%"    trend="+0.6%"  />
    <StatCard title="API Requests"     value="1.24M"    trend="+21.3%" />
  </KPIGrid>

  <ChartsRow>  {/* 1.6fr 1fr grid */}
    <RevenueChart />   {/* Recharts AreaChart, 12 months */}
    <UsersChart />     {/* Recharts BarChart, 8 weeks */}
  </ChartsRow>

  <BottomRow>  {/* 1fr 1fr grid */}
    <RecentUsersCard />   {/* last 5 users, mini table */}
    <ActivityFeedCard />  {/* last 6 events */}
  </BottomRow>
</DashboardPage>
```

### Revenue Sparkline Data (for KPI card)
```ts
// Mini 7-point trend lines (arbitrary but visually coherent):
const sparkData = {
  revenue:    [88, 92, 85, 96, 102, 98, 112],
  users:      [210, 235, 228, 252, 267, 258, 284],
  conversion: [3.1, 3.0, 3.2, 3.1, 3.3, 3.2, 3.24],
  api:        [820, 890, 960, 1020, 1100, 1180, 1240],
}
```

### Revenue Chart Data (12 months, in $k)
```ts
const revenueData = [
  { month: 'Jan', value: 68 }, { month: 'Feb', value: 72 },
  { month: 'Mar', value: 65 }, { month: 'Apr', value: 81 },
  { month: 'May', value: 87 }, { month: 'Jun', value: 94 },
  { month: 'Jul', value: 88 }, { month: 'Aug', value: 102 },
  { month: 'Sep', value: 110 }, { month: 'Oct', value: 105 },
  { month: 'Nov', value: 118 }, { month: 'Dec', value: 128 },
]
```

### User Growth Data (8 weeks)
```ts
const userGrowthData = [
  { week: 'W1', users: 1820 }, { week: 'W2', users: 2140 },
  { week: 'W3', users: 1960 }, { week: 'W4', users: 2380 },
  { week: 'W5', users: 2520 }, { week: 'W6', users: 2290 },
  { week: 'W7', users: 2740 }, { week: 'W8', users: 2890 },
]
```

---

## Page 2: Tasks

### State
```ts
const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
const [rowSelection, setRowSelection] = useState({})
const [globalFilter, setGlobalFilter] = useState('')
```

### Tab Counts
```ts
const counts = {
  all:         tasks.length,
  Backlog:     tasks.filter(t => t.status === 'Backlog').length,
  Todo:        tasks.filter(t => t.status === 'Todo').length,
  'In Progress': tasks.filter(t => t.status === 'In Progress').length,
  Done:        tasks.filter(t => t.status === 'Done').length,
  Canceled:    tasks.filter(t => t.status === 'Canceled').length,
}
```

### Seed Data (20 tasks)
```ts
export const tasks: Task[] = [
  { id: 'TASK-0001', title: 'Fix authentication token expiry regression',  type: 'Bug',           status: 'In Progress', priority: 'High' },
  { id: 'TASK-0002', title: 'Implement dark mode for mobile app',           type: 'Feature',       status: 'Todo',        priority: 'Medium' },
  { id: 'TASK-0003', title: 'Write API docs for v2 endpoints',              type: 'Documentation', status: 'Done',        priority: 'Low' },
  { id: 'TASK-0004', title: 'Add bulk export to CSV in user table',         type: 'Enhancement',   status: 'Backlog',     priority: 'Low' },
  { id: 'TASK-0005', title: 'Resolve CORS issue on staging environment',    type: 'Bug',           status: 'In Progress', priority: 'Urgent' },
  { id: 'TASK-0006', title: 'Design onboarding flow for new users',         type: 'Feature',       status: 'Todo',        priority: 'Medium' },
  { id: 'TASK-0007', title: 'Performance optimization for dashboard queries', type: 'Enhancement', status: 'Backlog',     priority: 'High' },
  { id: 'TASK-0008', title: 'Set up automated backup monitoring alerts',    type: 'Task',          status: 'Done',        priority: 'Medium' },
  { id: 'TASK-0009', title: 'Migrate legacy endpoints to REST v2',          type: 'Task',          status: 'In Progress', priority: 'High' },
  { id: 'TASK-0010', title: 'Add multi-language support (i18n)',             type: 'Feature',       status: 'Backlog',     priority: 'Low' },
  { id: 'TASK-0011', title: 'Implement rate limiting on public API',         type: 'Feature',       status: 'Todo',        priority: 'Medium' },
  { id: 'TASK-0012', title: 'Create error boundary components',              type: 'Task',          status: 'Done',        priority: 'Low' },
  { id: 'TASK-0013', title: 'Upgrade Node.js 18 → 22 LTS',                  type: 'Task',          status: 'In Progress', priority: 'Medium' },
  { id: 'TASK-0014', title: 'Add webhook retry with exponential backoff',   type: 'Enhancement',   status: 'Todo',        priority: 'High' },
  { id: 'TASK-0015', title: 'Document permission matrix for all roles',     type: 'Documentation', status: 'Canceled',    priority: 'Low' },
  { id: 'TASK-0016', title: 'Implement SSO with Google Workspace',          type: 'Feature',       status: 'Backlog',     priority: 'High' },
  { id: 'TASK-0017', title: 'Fix memory leak in background job processor',  type: 'Bug',           status: 'In Progress', priority: 'Urgent' },
  { id: 'TASK-0018', title: 'Add audit trail for billing events',           type: 'Feature',       status: 'Todo',        priority: 'Medium' },
  { id: 'TASK-0019', title: 'Improve mobile responsiveness of sidebar',     type: 'Enhancement',   status: 'Backlog',     priority: 'Low' },
  { id: 'TASK-0020', title: 'Add keyboard shortcut guide to help center',   type: 'Documentation', status: 'Canceled',    priority: 'Low' },
]
```

---

## Page 3: Projects

### Seed Data

```ts
export const projects: Project[] = [
  { id:'p1', name:'Atlas',            color:'#1e8ec8', status:'Active',    progress:68,  tasks:24, tasksDone:16, dueDate:'Jul 15',  team:['JD','SC','MR'], description:'Core product redesign with new component library and unified design system.' },
  { id:'p2', name:'Orion API v2',     color:'#8b5cf6', status:'Active',    progress:45,  tasks:32, tasksDone:14, dueDate:'Aug 1',   team:['RK','TN','CW'], description:'Complete REST API rewrite with OpenAPI 3.1 docs, improved performance, and SDKs.' },
  { id:'p3', name:'Phoenix Auth',     color:'#22c55e', status:'Active',    progress:82,  tasks:18, tasksDone:15, dueDate:'Jun 30',  team:['JD','EP','SC'], description:'Unified authentication service with SSO, 2FA, passkeys, and session management.' },
  { id:'p4', name:'Nebula Analytics', color:'#f59e0b', status:'Active',    progress:31,  tasks:28, tasksDone:9,  dueDate:'Sep 15',  team:['LM','MR','AK'], description:'Real-time analytics pipeline for event tracking and business intelligence.' },
  { id:'p5', name:'Horizon Mobile',   color:'#f97316', status:'Active',    progress:15,  tasks:40, tasksDone:6,  dueDate:'Nov 1',   team:['SC','MR','CW'], description:'Native iOS and Android application with offline sync and push notifications.' },
  { id:'p6', name:'Pulse Monitoring', color:'#14b8a6', status:'Active',    progress:93,  tasks:15, tasksDone:14, dueDate:'Jun 28',  team:['RK','JD','TN'], description:'Infrastructure monitoring with real-time alerts, on-call routing, and SLA tracking.' },
  { id:'p7', name:'Docs Portal',      color:'#84cc16', status:'Completed', progress:100, tasks:20, tasksDone:20, dueDate:'Done',    team:['MR','SC','LM'], description:'Developer documentation portal with versioning, full-text search, and API explorer.' },
  { id:'p8', name:'Payments v3',      color:'#22c55e', status:'Completed', progress:100, tasks:22, tasksDone:22, dueDate:'Done',    team:['JD','RK','TN'], description:'New payment processing layer supporting 15 additional methods and currencies.' },
  { id:'p9', name:'Legacy CMS',       color:'#6b7585', status:'Archived',  progress:100, tasks:12, tasksDone:12, dueDate:'—',       team:['MR','SC','JD'], description:'Deprecated content management system — fully superseded by the Docs Portal.' },
]
```

---

## Page 4: Analytics

### Metrics
| Metric | Value | Trend |
|---|---|---|
| Total Visits | 284,921 | +18.2% |
| Unique Visitors | 142,038 | +12.7% |
| Bounce Rate | 38.4% | -2.1% (green — lower is better) |
| Avg Session | 4m 12s | +8.3% |

### Traffic Sources (Donut)
```ts
const sources = [
  { name: 'Organic',  value: 42, color: '#1e8ec8' },
  { name: 'Direct',   value: 28, color: '#22c55e' },
  { name: 'Referral', value: 16, color: '#f59e0b' },
  { name: 'Social',   value: 10, color: '#8b5cf6' },
  { name: 'Email',    value:  4, color: '#ef4444' },
]
```

### Top Pages Table
```ts
const topPages = [
  { path: '/dashboard',       views: 48291, unique: 21840, bounceRate: '22%', trend: 'up' },
  { path: '/tasks',           views: 31024, unique: 18920, bounceRate: '31%', trend: 'up' },
  { path: '/analytics',       views: 22841, unique: 14201, bounceRate: '42%', trend: 'down' },
  { path: '/users',           views: 19200, unique: 11840, bounceRate: '28%', trend: 'up' },
  { path: '/settings',        views: 14920, unique:  8741, bounceRate: '55%', trend: 'down' },
]
```

---

## Page 5: Monitoring

### Services Grid
```ts
const services = [
  { name: 'API Gateway',     status: 'Operational', uptime: '99.98%', latency: '42ms' },
  { name: 'Auth Service',    status: 'Operational', uptime: '99.99%', latency: '18ms' },
  { name: 'Database (Primary)', status: 'Operational', uptime: '99.95%', latency: '8ms' },
  { name: 'Database (Replica)', status: 'Operational', uptime: '99.94%', latency: '12ms' },
  { name: 'Redis Cache',     status: 'Operational', uptime: '99.99%', latency: '2ms' },
  { name: 'File Storage',    status: 'Degraded',    uptime: '98.21%', latency: '210ms' },
  { name: 'Email Service',   status: 'Operational', uptime: '99.87%', latency: '84ms' },
  { name: 'Webhook Queue',   status: 'Operational', uptime: '99.92%', latency: '61ms' },
  { name: 'Search Index',    status: 'Operational', uptime: '99.78%', latency: '28ms' },
  { name: 'CDN',             status: 'Operational', uptime: '100%',   latency: '4ms' },
  { name: 'Scheduler',       status: 'Operational', uptime: '99.96%', latency: '—' },
  { name: 'Billing Service', status: 'Operational', uptime: '99.99%', latency: '92ms' },
]
// Status dot colors: Operational=#22c55e  Degraded=#f59e0b  Outage=#ef4444
```

---

## Page 6: Billing

### Plan Card
```ts
const currentPlan = {
  name: 'Professional',
  description: 'For growing teams that need more power.',
  price: 299,
  period: 'month',
  features: [
    'Up to 500 team members',
    '50 projects',
    '100GB storage',
    'Priority support',
    'Advanced analytics',
    'Custom integrations',
  ],
}
```

### Usage Bars
```ts
const usage = [
  { label: 'API Calls',    current: 1240000, limit: 5000000, unit: '' },
  { label: 'Storage',      current: 42,      limit: 100,     unit: 'GB' },
  { label: 'Team Members', current: 84,      limit: 500,     unit: '' },
  { label: 'Projects',     current: 9,       limit: 50,      unit: '' },
]
```

### Invoice History
```ts
const invoices = [
  { id: 'INV-2026-06', date: 'Jun 1, 2026',  amount: '$299.00', status: 'Paid' },
  { id: 'INV-2026-05', date: 'May 1, 2026',  amount: '$299.00', status: 'Paid' },
  { id: 'INV-2026-04', date: 'Apr 1, 2026',  amount: '$299.00', status: 'Paid' },
  { id: 'INV-2026-03', date: 'Mar 1, 2026',  amount: '$299.00', status: 'Paid' },
  { id: 'INV-2026-02', date: 'Feb 1, 2026',  amount: '$299.00', status: 'Paid' },
  { id: 'INV-2026-01', date: 'Jan 1, 2026',  amount: '$249.00', status: 'Paid' },
]
```

---

## Page 7: API Keys

### Columns: Name / Key (masked) / Scopes / Created / Expires / Status / Actions

```ts
const apiKeys = [
  { name: 'Production', key: 'sk_live_****4a2f', scopes: ['read', 'write'], created: 'Jan 8, 2026',  expires: 'Dec 31, 2026', status: 'Active' },
  { name: 'Staging',    key: 'sk_test_****8b1c', scopes: ['read', 'write'], created: 'Mar 14, 2026', expires: 'Mar 14, 2027', status: 'Active' },
  { name: 'CI/CD',      key: 'sk_test_****2e9d', scopes: ['read'],          created: 'Jun 1, 2026',  expires: 'Jun 1, 2027',  status: 'Active' },
  { name: 'Analytics',  key: 'sk_live_****7f3a', scopes: ['read'],          created: 'Feb 20, 2026', expires: 'Jul 5, 2026',  status: 'Expiring' },
  { name: 'Webhook',    key: 'sk_live_****1a8e', scopes: ['write'],         created: 'Oct 12, 2025', expires: 'Oct 11, 2026', status: 'Active' },
  { name: 'Legacy SDK', key: 'sk_live_****9c2b', scopes: ['read', 'write'], created: 'Aug 3, 2024',  expires: 'Aug 3, 2025',  status: 'Expired' },
]
```

---

## Page 8: Security

### Sections
1. **Password** — "Change Password" form (current / new / confirm)
2. **Two-Factor Authentication** — enabled state with TOTP app shown, "Manage 2FA" button
3. **Login History** — table: IP / Device / Location / Time / Status (Success/Failed)

```ts
const loginHistory = [
  { ip: '12.34.56.78',   device: 'Chrome · macOS',     location: 'San Francisco, US', time: '2 min ago',  status: 'Success' },
  { ip: '12.34.56.78',   device: 'Chrome · macOS',     location: 'San Francisco, US', time: '1 day ago',  status: 'Success' },
  { ip: '98.76.54.32',   device: 'Firefox · Windows',  location: 'New York, US',      time: '2 days ago', status: 'Success' },
  { ip: '192.168.2.44',  device: 'Unknown',             location: 'Unknown',           time: '2 days ago', status: 'Failed' },
  { ip: '192.168.2.44',  device: 'Unknown',             location: 'Unknown',           time: '2 days ago', status: 'Failed' },
]
```

---

## Page 9: Sessions

```ts
const sessions = [
  { device: 'Chrome · macOS 14',     icon: 'monitor',      location: 'San Francisco, CA', ip: '12.34.56.78', lastActive: 'Active now',  current: true },
  { device: 'Safari · iPhone 16',    icon: 'smartphone',   location: 'San Francisco, CA', ip: '12.34.56.79', lastActive: '3h ago',      current: false },
  { device: 'Chrome · Windows 11',   icon: 'monitor',      location: 'New York, NY',       ip: '98.76.54.32', lastActive: '2 days ago',  current: false },
  { device: 'Firefox · Ubuntu 24',   icon: 'monitor',      location: 'Remote — VPN',       ip: '10.0.0.5',    lastActive: '5 days ago',  current: false },
]
// Current session: shows "This device" badge (primary bl), no Revoke button
// Others: red "Revoke" button
```

---

## Page 10: Roles

```ts
const roles = [
  { name: 'Super Admin', description: 'Full access to everything, including destructive actions.', members: 2,   permissions: 18, color: '#ef4444' },
  { name: 'Admin',       description: 'Full workspace access except irreversible system actions.',  members: 5,   permissions: 16, color: '#f59e0b' },
  { name: 'Manager',     description: 'Manage teams, projects, and members.',                       members: 12,  permissions: 11, color: '#8b5cf6' },
  { name: 'Developer',   description: 'Access to code, APIs, and technical configuration.',         members: 48,  permissions: 9,  color: '#1e8ec8' },
  { name: 'Analyst',     description: 'View reports, analytics, and export data.',                  members: 19,  permissions: 6,  color: '#22c55e' },
  { name: 'Viewer',      description: 'Read-only access across all sections.',                      members: 124, permissions: 3,  color: '#4f6075' },
]
```

---

## Page 11: Integrations

### Connected Apps Grid
```ts
const integrations = [
  { name: 'GitHub',     desc: 'Code repository sync and PR automation.', status: 'Connected', icon: 'github',   color: '#1b1f23' },
  { name: 'Slack',      desc: 'Notifications and workflow alerts.',        status: 'Connected', icon: 'slack',    color: '#4a154b' },
  { name: 'Jira',       desc: 'Issue sync and sprint tracking.',           status: 'Connected', icon: 'jira',     color: '#0052cc' },
  { name: 'Datadog',    desc: 'Infrastructure and APM monitoring.',        status: 'Connected', icon: 'datadog',  color: '#632ca6' },
  { name: 'Stripe',     desc: 'Payment processing and billing events.',    status: 'Connected', icon: 'stripe',   color: '#635bff' },
  { name: 'SendGrid',   desc: 'Transactional email delivery.',             status: 'Disconnected', icon: 'mail', color: '#1a82e2' },
  { name: 'Figma',      desc: 'Design file sync and comment import.',      status: 'Disconnected', icon: 'figma', color: '#f24e1e' },
  { name: 'Zapier',     desc: 'No-code workflow automation.',              status: 'Disconnected', icon: 'zap',  color: '#ff4a00' },
]
```

---

## Permissions Matrix

```ts
const roles = ['Viewer', 'Developer', 'Analyst', 'Manager', 'Admin', 'Super Admin']

const permissionMatrix = {
  'User Management': {
    'View Users':     [true,  true,  true,  true,  true,  true ],
    'Invite Users':   [false, false, false, true,  true,  true ],
    'Edit Users':     [false, false, false, true,  true,  true ],
    'Delete Users':   [false, false, false, false, true,  true ],
    'Manage Roles':   [false, false, false, false, true,  true ],
  },
  'Content': {
    'View Content':   [true,  true,  true,  true,  true,  true ],
    'Create Content': [false, true,  false, true,  true,  true ],
    'Edit Content':   [false, true,  false, true,  true,  true ],
    'Delete Content': [false, false, false, true,  true,  true ],
    'Publish Content':[false, false, false, true,  true,  true ],
  },
  'Analytics': {
    'View Analytics': [false, false, true,  true,  true,  true ],
    'Export Reports': [false, false, true,  true,  true,  true ],
    'View Audit Logs':[false, false, false, false, true,  true ],
  },
  'System': {
    'Manage API Keys':    [false, true,  false, false, true,  true ],
    'Manage Integrations':[false, false, false, false, true,  true ],
    'View Billing':       [false, false, false, true,  true,  true ],
    'Manage Billing':     [false, false, false, false, true,  true ],
    'System Settings':    [false, false, false, false, false, true ],
  },
}
```

---

## Routing (TanStack Router)

```ts
// src/routes/_authenticated/tasks/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { TasksPage } from '@/features/tasks'

export const Route = createFileRoute('/_authenticated/tasks/')({
  component: TasksPage,
  loader: () => fetchTasks(),
})
```

Repeat this pattern for each page. The `_authenticated` layout route handles the sidebar + header shell.
