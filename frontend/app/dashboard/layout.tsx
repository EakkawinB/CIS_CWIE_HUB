'use client'

import { ReactNode } from 'react'
import { ProtectedRoute } from '@/lib/protected-route'
import { AuthHeader } from '@/components/auth-header'
import { motion } from 'motion/react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-background"
      >
        <AuthHeader />
        <main className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
          {children}
        </main>
      </motion.div>
    </ProtectedRoute>
  )
}
