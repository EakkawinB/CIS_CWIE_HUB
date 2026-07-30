'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background"
    >
      <div className="flex flex-col items-center justify-center px-5 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md rounded-3xl border border-border bg-background p-7 shadow-2xl shadow-primary/10 text-center md:p-9"
        >
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-green-500/10 text-center mx-auto">
            <div className="text-4xl">✓</div>
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome!
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            You have successfully signed in to CIS CWIE Hub.
          </p>

          <p className="mt-6 rounded-xl bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
            Role-based navigation and full dashboard functionality will be implemented soon. 
            This is a temporary welcome page.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
