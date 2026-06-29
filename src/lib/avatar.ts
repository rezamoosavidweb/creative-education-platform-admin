// Avatar color palette from the design tokens — assign by index or name hash.
export const AVATAR_COLORS = [
  '#1e8ec8', // primary
  '#8b5cf6',
  '#f59e0b',
  '#14b8a6',
  '#0ea5e9',
  '#84cc16',
  '#a855f7',
  '#ef4444',
  '#22c55e',
] as const

/** Derive up-to-2-character uppercase initials from a name. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Deterministically pick an avatar color from a name. */
export function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
