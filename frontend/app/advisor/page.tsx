'use client'

import { ProtectedRoute } from '@/components/protected-route'
import dynamic from 'next/dynamic'
import { LoadingScreen } from '@/components/loading-screen'

// Bridges the existing AdvisorPortal with the Next.js app router,
// exactly like app/student/page.tsx does for StudentPortal.
const AdvisorPortalWrapper = dynamic(
  () => import('@/src/components/AdvisorPortal').then(mod => ({
    default: mod.default
  })),
  {
    loading: () => <LoadingScreen onComplete={() => {}} />,
    ssr: false
  }
)

export default function AdvisorPage() {
  const handleNotify = (message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    console.log(`[${type.toUpperCase()}] ${message}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('cis_cwie_auth')
    localStorage.removeItem('cis_cwie_token')
    localStorage.removeItem('access_token')
    window.location.href = '/login'
  }

  return (
    <ProtectedRoute requiredRole="advisor">
      <AdvisorPortalWrapper
        onNotify={handleNotify}
        onLogout={handleLogout}
      />
    </ProtectedRoute>
  )
}
