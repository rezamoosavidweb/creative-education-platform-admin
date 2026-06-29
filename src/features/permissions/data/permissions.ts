import { type Permission, type PermissionRole } from '../types/permission'

// Column order matches the design: Super Admin → Viewer.
export const permissionRoles: PermissionRole[] = [
  { id: 'super-admin', name: 'Super Admin', color: '#ef4444' },
  { id: 'admin', name: 'Admin', color: '#1e8ec8' },
  { id: 'manager', name: 'Manager', color: '#8b5cf6' },
  { id: 'developer', name: 'Developer', color: '#22c55e' },
  { id: 'analyst', name: 'Analyst', color: '#f59e0b' },
  { id: 'viewer', name: 'Viewer', color: '#8896aa' },
]

// Each `allowed` array aligns by index with `permissionRoles` above.
export const permissions: Permission[] = [
  {
    id: 'invite-users',
    name: 'Invite users',
    description: 'Send workspace invitations',
    allowed: [true, true, true, false, false, false],
  },
  {
    id: 'manage-users',
    name: 'Manage users',
    description: 'Edit and deactivate accounts',
    allowed: [true, true, false, false, false, false],
  },
  {
    id: 'assign-roles',
    name: 'Assign roles',
    description: 'Change member role assignments',
    allowed: [true, true, false, false, false, false],
  },
  {
    id: 'view-all-users',
    name: 'View all users',
    description: 'Browse user profiles and activity',
    allowed: [true, true, true, true, true, true],
  },
  {
    id: 'create-projects',
    name: 'Create projects',
    description: 'Start new workspace projects',
    allowed: [true, true, true, true, false, false],
  },
  {
    id: 'archive-projects',
    name: 'Archive projects',
    description: 'Archive or delete projects',
    allowed: [true, true, true, false, false, false],
  },
  {
    id: 'view-projects',
    name: 'View projects',
    description: 'Browse and read all projects',
    allowed: [true, true, true, true, true, true],
  },
  {
    id: 'export-data',
    name: 'Export data',
    description: 'Download reports and CSV exports',
    allowed: [true, true, true, false, true, false],
  },
  {
    id: 'view-analytics',
    name: 'View analytics',
    description: 'Access analytics dashboards',
    allowed: [true, true, true, true, true, false],
  },
  {
    id: 'view-audit-logs',
    name: 'View audit logs',
    description: 'Inspect the workspace audit trail',
    allowed: [true, true, false, false, false, false],
  },
  {
    id: 'manage-api-keys',
    name: 'Manage API keys',
    description: 'Create and revoke API credentials',
    allowed: [true, true, false, true, false, false],
  },
  {
    id: 'manage-billing',
    name: 'Manage billing',
    description: 'Update plans and payment methods',
    allowed: [true, false, false, false, false, false],
  },
  {
    id: 'manage-integrations',
    name: 'Manage integrations',
    description: 'Connect and configure third-party apps',
    allowed: [true, true, false, false, false, false],
  },
  {
    id: 'system-settings',
    name: 'System settings',
    description: 'Change workspace-wide configuration',
    allowed: [true, false, false, false, false, false],
  },
]
