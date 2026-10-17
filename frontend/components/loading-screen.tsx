'use client'

import { motion } from 'motion/react'

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        {/* CIS CWIE Hub Logo/Brand */}
        <div className="flex size-20 items-center justify-center rounded-2xl overflow-hidden">
          <img
            src="/cis-kmutnb-logo.png"
            alt="CIS KMUTNB Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* System Name */}
        <div className="text-center">
          <h1 className="font-display text-xl font-bold text-foreground">
            CIS CWIE Hub
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cooperative Education Platform
          </p>
        </div>

        {/* Modern Spinner */}
        <div className="relative size-12">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-1 rounded-full border-2 border-transparent border-b-primary border-l-primary"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Loading Text with fade animation */}
        <motion.p
          className="text-sm font-medium text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading your experience...
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
