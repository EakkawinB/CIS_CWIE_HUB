'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl border border-border bg-background p-8 text-center shadow-2xl shadow-primary/10">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex size-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mx-auto mb-6"
          >
            <Shield className="size-10" />
          </motion.div>

          {/* Content */}
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Access Denied
          </h1>

          <p className="text-muted-foreground mb-6">
            You don't have permission to access this resource. Your current role may not have access to this area.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold transition hover:opacity-90"
            >
              <ArrowLeft className="size-4" />
              Back to Dashboard
            </Link>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-border text-foreground font-semibold transition hover:bg-surface"
            >
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
          </div>

          {/* Help Text */}
          <p className="mt-6 text-xs text-muted-foreground">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
