'use client'

import { useAuth } from '@/lib/auth-context'
import { motion } from 'motion/react'
import { LogOut, User, Settings } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { getTranslation } from '@/lib/translations'

export function AuthHeader() {
  const { user, logout } = useAuth()
  const { language } = useLanguage()
  const t = getTranslation(language)

  if (!user) return null

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo/Brand */}
          <Link href="/dashboard" className="font-display font-bold text-lg">
            CIS CWIE Hub
          </Link>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-right"
            >
              <p className="text-sm font-semibold text-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </motion.div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-surface transition-colors"
                title="Profile"
              >
                <User className="h-4 w-4 text-muted-foreground" />
              </button>

              <button
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-surface transition-colors"
                title="Settings"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  logout()
                  window.location.href = '/'
                }}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-surface transition-colors text-destructive hover:text-destructive"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
