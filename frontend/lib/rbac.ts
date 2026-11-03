/**
 * Role-Based Access Control (RBAC) helpers for the frontend.
 *
 * This mirrors the backend permission model in `backend/app/core/rbac.py`.
 * It is used for route protection only - the backend remains the source of
 * truth and re-checks every request.
 */

export type AppRole = 'student' | 'advisor' | 'mentor' | 'staff' | 'admin'

export const APP_ROLES: AppRole[] = [
  'student',
  'advisor',
  'mentor',
  'staff',
  'admin',
]

/** Legacy role names kept for backward compatibility with old sessions. */
const ROLE_ALIASES: Record<string, AppRole> = {
  teacher: 'advisor',
  adviser: 'advisor',
}

/**
 * Normalize a role coming from storage or the JWT.
 * Handles legacy aliases and dirty values such as "student\n".
 */
export function normalizeRole(role?: string | null): AppRole | null {
  if (role === undefined || role === null) return null

  const candidate = String(role).trim().toLowerCase()
  if (!candidate) return null

  const aliased = ROLE_ALIASES[candidate] ?? candidate

  return (APP_ROLES as string[]).includes(aliased) ? (aliased as AppRole) : null
}

/** Route a role lands on after signing in. */
export const ROLE_HOME: Record<AppRole, string> = {
  student: '/student',
  advisor: '/advisor',
  mentor: '/mentor',
  staff: '/staff',
  admin: '/dashboard',
}

/** Pages each role is allowed to open. `/dashboard` is the admin area. */
export const ROLE_ROUTES: Record<AppRole, string[]> = {
  student: ['/student'],
  advisor: ['/advisor'],
  mentor: ['/mentor'],
  staff: ['/staff'],
  admin: ['/dashboard'],
}

export function homeRouteForRole(role?: string | null): string {
  const normalized = normalizeRole(role)
  return normalized ? ROLE_HOME[normalized] : '/dashboard'
}

/** Return true when `role` may open `pathname`. */
export function canAccessRoute(
  role: string | null | undefined,
  pathname: string | null | undefined
): boolean {
  const normalized = normalizeRole(role)
  if (!normalized) return false

  const path = (pathname || '/').split('?')[0].replace(/\/+$/, '') || '/'

  return ROLE_ROUTES[normalized].some(
    (route) => path === route || path.startsWith(`${route}/`)
  )
}
