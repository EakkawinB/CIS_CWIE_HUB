'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../../lib/auth-context'
import { normalizeRole, type AppRole } from '../../lib/rbac'
import { motion } from 'motion/react'
import { LoadingScreen } from '../components/loading-screen'

interface ProtectedRouteProps {
  children: ReactNode
  /** Role(s) allowed to open this page. */
  requiredRole?: AppRole | AppRole[]
  /** Legacy prop name kept for backward compatibility. */
  requiredRoles?: AppRole[]
}

function resolveRequiredRoles(
  requiredRole: ProtectedRouteProps['requiredRole'],
  requiredRoles: ProtectedRouteProps['requiredRoles']
): AppRole[] | null {
  if (requiredRoles && requiredRoles.length > 0) {
    return requiredRoles
  }

  if (!requiredRole) {
    return null
  }

  return Array.isArray(requiredRole) ? requiredRole : [requiredRole]
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredRoles,
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, isAuthenticated } = useAuth()

  const allowedRoles = resolveRequiredRoles(requiredRole, requiredRoles)
  const role = normalizeRole(user?.role)
  const allowed =
    allowedRoles === null
      ? isAuthenticated
      : role !== null && allowedRoles.includes(role)

  useEffect(() => {
    if (isLoading) return

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(`/login?redirect=${pathname}`)
      return
    }

    // Check role-based access
    if (!allowed) {
      router.push('/unauthorized')
    }
  }, [isLoading, isAuthenticated, allowed, router, pathname])

  if (isLoading) {
    return <LoadingScreen onComplete={function (): void {
      throw new Error('Function not implemented.')
    } } />
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-muted-foreground">Redirecting to login...</p>
        </motion.div>
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-destructive">Access denied</p>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}