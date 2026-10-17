'use client'

import { useAuth } from '@/lib/auth-context'
import { motion } from 'motion/react'
import { useLanguage } from '@/lib/language-context'
import { getTranslation } from '@/lib/translations'
import { FileText, Users, TrendingUp, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const t = getTranslation(language)

  const stats = [
    {
      icon: FileText,
      label: t.dashboard.documents,
      value: '12 / 14',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      icon: Users,
      label: t.dashboard.matched,
      value: '86%',
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      icon: TrendingUp,
      label: 'Completed Tasks',
      value: '24',
      color: 'bg-green-500/10 text-green-600',
    },
    {
      icon: Calendar,
      label: 'Upcoming Events',
      value: '3',
      color: 'bg-orange-500/10 text-orange-600',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border border-border bg-linear-to-br from-primary/5 to-transparent p-8 md:p-12"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
              Welcome back!
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {user?.email} ({user?.role})
            </p>
            <p className="mt-4 max-w-2xl text-foreground/80">
              You have successfully signed in to CIS CWIE Hub. Explore your cooperative education journey and track your progress.
            </p>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="flex size-24 items-center justify-center rounded-2xl bg-primary/10 text-4xl"
          >
            ✓
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="rounded-2xl border border-border bg-surface p-6 hover:shadow-lg transition-shadow"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} mb-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Content Sections */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid gap-6 lg:grid-cols-3"
      >
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Document submitted', time: '2 hours ago' },
              { action: 'Mentor feedback received', time: '1 day ago' },
              { action: 'Workspace updated', time: '3 days ago' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <p className="text-sm text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              'Upload Document',
              'Contact Mentor',
              'View Schedule',
              'Submit Feedback',
            ].map((action, i) => (
              <button
                key={i}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-surface transition-colors text-left"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Feature Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-blue-200/50 bg-blue-50/30 p-6 text-center"
      >
        <p className="text-sm text-blue-900">
          More dashboard features are coming soon! Role-based content and full integration with your profile data.
        </p>
      </motion.div>
    </motion.div>
  )
}
