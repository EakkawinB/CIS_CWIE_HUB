'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  CheckCircle2,
  CircleAlert,
  GraduationCap,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { SectionHeading } from './motion-primitives'
import { useLanguage } from '@/lib/language-context'
import { getTranslation } from '@/lib/translations'

export function EligibilityChecker() {
  const [gpa, setGpa] = useState('')
  const [credits, setCredits] = useState('')
  const [result, setResult] = useState<'pass' | 'fail' | null>(null)
  const { language } = useLanguage()
  const t = getTranslation(language)

  const gpaNum = Number(gpa)
  const creditsNum = Number(credits)

  function verify(e: React.FormEvent) {
    e.preventDefault()
    if (!gpa || !credits) return
    setResult(gpaNum >= 3 && creditsNum >= 78 ? 'pass' : 'fail')
  }

  return (
    <section id="eligibility" className="bg-primary py-24 text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t.eligibility.eyebrow}
          title={t.eligibility.title}
          description={t.eligibility.description}
        />

        <div className="mt-12 grid overflow-hidden rounded-3xl border border-primary-foreground/20 bg-background text-foreground shadow-2xl lg:grid-cols-[.8fr_1.2fr]">
          {/* Left Column - Requirements */}
          <div className="bg-surface p-7 md:p-10">
            <GraduationCap className="size-9 text-primary" />
            <h3 className="mt-5 font-display text-2xl font-bold">
              {t.eligibility.minRequirements}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t.eligibility.enterInfo}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
                <span className="text-sm">{t.eligibility.gpa}</span>
                <strong className="text-primary">≥ 3.00</strong>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
                <span className="text-sm">{t.eligibility.credits}</span>
                <strong className="text-primary">≥ 78</strong>
              </div>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              {t.eligibility.demoOnly}
            </p>
          </div>

          {/* Right Column - Form & Results */}
          <div className="p-7 md:p-10">
            <form onSubmit={verify} className="grid gap-5 sm:grid-cols-2">
              {/* GPA Input */}
              <label className="flex flex-col gap-2 text-sm font-semibold">
                {t.eligibility.gpa}
                <input
                  required
                  min="0"
                  max="4"
                  step="0.01"
                  value={gpa}
                  onChange={(e) => {
                    setGpa(e.target.value)
                    setResult(null)
                  }}
                  placeholder={t.eligibility.gpaPlaceholder}
                  className="h-12 rounded-xl border border-input bg-background px-4 font-normal outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              {/* Credits Input */}
              <label className="flex flex-col gap-2 text-sm font-semibold">
                {t.eligibility.credits}
                <input
                  required
                  min="0"
                  step="1"
                  value={credits}
                  onChange={(e) => {
                    setCredits(e.target.value)
                    setResult(null)
                  }}
                  placeholder={t.eligibility.creditsPlaceholder}
                  className="h-12 rounded-xl border border-input bg-background px-4 font-normal outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              {/* Submit Button */}
              <button className="h-12 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:col-span-2">
                {t.eligibility.verify}
              </button>
            </form>

            {/* Results */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key={result}
                  initial={{ opacity: 0, scale: 0.97, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-6 rounded-2xl border p-5 ${
                    result === 'pass'
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-secondary/30 bg-secondary/5'
                  }`}
                >
                  {result === 'pass' ? (
                    <>
                      {/* Pass Result */}
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="size-8 text-primary" />
                        <div>
                          <h4 className="font-display text-xl font-bold">
                            {t.eligibility.congratulations}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {t.eligibility.congratulationsDesc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                        <p className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-primary" />
                          {t.eligibility.gpaPass}
                        </p>
                        <p className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-primary" />
                          {t.eligibility.creditPass}
                        </p>
                      </div>

                      <Link
                        href="/login"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                      >
                        {t.eligibility.continueLogin}
                        <ArrowRight className="size-4" />
                      </Link>
                    </>
                  ) : (
                    <>
                      {/* Fail Result */}
                      <div className="flex items-center gap-3">
                        <CircleAlert className="size-8 text-secondary" />
                        <div>
                          <h4 className="font-display text-xl font-bold">
                            {t.eligibility.notMeet}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {t.eligibility.notMeetDesc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <p className="rounded-lg bg-background p-3 text-sm">
                          GPA: <strong>{gpaNum.toFixed(2)} / 3.00</strong>
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {t.eligibility.gap}: {Math.max(0, 3 - gpaNum).toFixed(2)}
                          </span>
                        </p>
                        <p className="rounded-lg bg-background p-3 text-sm">
                          {t.eligibility.credits}: <strong>{creditsNum} / 78</strong>
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {t.eligibility.missing}: {Math.max(0, 78 - creditsNum)}
                          </span>
                        </p>
                      </div>

                      <p className="mt-4 text-sm font-medium">
                        {t.eligibility.keepWorking}
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
