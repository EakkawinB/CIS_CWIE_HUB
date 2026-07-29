'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, CheckCircle2, FileText, Users } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { getTranslation } from '@/lib/translations'

export function Hero() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-0 size-[420px] rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute top-40 -left-24 size-[360px] rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold text-primary"
          >
            <span className="size-1.5 rounded-full bg-secondary" /> {t.hero.badge}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl"
          >
            {t.hero.title}{' '}
            <span
              style={{
                animation: "color-shift 3s ease-in-out infinite",
                display: "inline-block",
              }}
            >
              {t.hero.titleHighlight}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-pretty text-lg font-medium text-foreground/80"
          >
            {t.hero.subtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground"
          >
            {t.hero.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
            >
              {t.hero.getStarted} <ArrowRight className="size-4" />
            </Link>
            <a
              href="#why"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-surface"
            >
              {t.hero.learnMore}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-2xl border border-border bg-background/80 p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span className="size-2.5 rounded-full bg-secondary" /> {t.dashboard.title}
              </div>
              <span className="text-xs text-muted-foreground">Term 2 / 2026</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { icon: FileText, label: t.dashboard.documents, value: '12 / 14' },
                { icon: Users, label: t.dashboard.matched, value: '86%' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-surface p-4">
                  <s.icon className="size-5 text-primary" />
                  <p className="mt-3 text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              {[t.dashboard.profileComplete, t.dashboard.resumeApproved, t.dashboard.interviewScheduled].map((txt) => (
                <div key={txt} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <CheckCircle2 className="size-4 text-primary" /> {txt}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-background p-4 shadow-xl md:block"
          >
            <p className="text-2xl font-bold text-primary">100%</p>
            <p className="text-xs text-muted-foreground">{t.dashboard.paperlessWorkflow}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
