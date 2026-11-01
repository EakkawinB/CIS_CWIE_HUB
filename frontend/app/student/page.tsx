'use client'

import { ProtectedRoute } from '@/components/protected-route'
import dynamic from 'next/dynamic'
import { LoadingScreen } from '@/components/loading-screen'

// Dynamically import StudentPortal from the old src structure
// Note: This bridges the old Vite/SPA app with the new Next.js app router
const StudentPortalWrapper = dynamic(
  () => import('@/src/components/StudentPortal').then(mod => ({
    default: mod.default
  })),
  { 
    loading: () => <LoadingScreen />,
    ssr: false 
  }
)

export default function StudentPage() {
  const handleNotify = (message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    console.log(`[${type.toUpperCase()}] ${message}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    window.location.href = '/login'
  }

  return (
    <ProtectedRoute requiredRole="student">
      <StudentPortalWrapper 
        onNotify={handleNotify}
        onLogout={handleLogout}
      />
    </ProtectedRoute>
  )
}
