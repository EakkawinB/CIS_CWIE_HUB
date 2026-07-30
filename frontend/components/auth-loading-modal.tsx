'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Loader2 } from 'lucide-react'

interface AuthLoadingModalProps {
  isOpen: boolean
  message: string
}

export function AuthLoadingModal({ isOpen, message }: AuthLoadingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-border bg-background p-8 shadow-2xl"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-center text-sm font-medium text-foreground">
                {message}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
