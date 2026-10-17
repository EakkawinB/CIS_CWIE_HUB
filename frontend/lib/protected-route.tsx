'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './auth-context'
import { motion } from 'motion/react'
import { LoadingScreen } from '@/components/loading-screen'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRoles?: Array<'student' | 'teacher' | 'staff'>
}

export function ProtectedRoute({
  children,
  requiredRoles,
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isLoading) return

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(`/login?redirect=${pathname}`)
      return
    }

    // Check role-based access
    if (requiredRoles && user && !requiredRoles.includes(user.role)) {
      router.push('/unauthorized')
    }
  }, [isLoading, isAuthenticated, user, router, pathname, requiredRoles])

  if (isLoading) {
    return <LoadingScreen />
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

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
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
