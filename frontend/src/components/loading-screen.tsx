'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

interface LoginLoadingOverlayProps {
  onComplete: () => void
}

const LOADING_MS = 4000 

export { LoginLoadingOverlay as LoadingScreen }

export function LoginLoadingOverlay({
  onComplete,
}: LoginLoadingOverlayProps) {
  // เก็บ callback ล่าสุดไว้ใน ref กัน timer ถูก reset เมื่อ parent re-render
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const timer = window.setTimeout(() => onCompleteRef.current(), LOADING_MS)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-white/50 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl border border-primary/10 bg-white p-8 shadow-xl shadow-primary/10"
      >
        <img
          src="/cis-kmutnb-logo.png"
          alt="CIS KMUTNB Logo"
          className="size-16 object-contain"
        />

        <div className="text-center">
          <h2 className="text-lg font-bold text-foreground">CIS CWIE Hub</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cooperative Education Platform
          </p>
        </div>

        {/* Spinner: วงรองจาง + ส่วนหมุนสีหลัก */}
        <motion.div
          className="size-10 rounded-full border-[3px] border-primary/15 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />

        <motion.p
          className="text-sm font-medium text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading your experience...
        </motion.p>
      </motion.div>
    </motion.div>
  )
}