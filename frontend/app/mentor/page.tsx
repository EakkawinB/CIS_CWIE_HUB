'use client'

import { ProtectedRoute } from '@/components/protected-route'
import dynamic from 'next/dynamic'
import { LoadingScreen } from '@/components/loading-screen'

// Bridges the existing MentorPortal with the Next.js app router,
// exactly like app/student/page.tsx does for StudentPortal.
const MentorPortalWrapper = dynamic(
  () => import('@/src/components/MentorPortal').then(mod => ({
    default: mod.default
  })),
  {
    loading: () => <LoadingScreen onComplete={() => {}} />,
    ssr: false
  }
)

export default function MentorPage() {
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
    <ProtectedRoute requiredRole="mentor">
      <MentorPortalWrapper
        onNotify={handleNotify}
        onLogout={handleLogout}
      />
    </ProtectedRoute>
  )
}
