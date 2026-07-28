'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  Globe2,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { getTranslation } from '@/lib/translations'

export function LoginCard() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [loadingButton, setLoadingButton] = useState<'google' | 'sso' | null>(null)
  const { language } = useLanguage()
  const t = getTranslation(language)

  const handleGoogleLogin = async () => {
    setLoadingButton('google')
    try {
      // Simulate Google login process
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // TODO: Implement actual Google OAuth flow
      console.log('Google login initiated')
    } catch (error) {
      console.error('Google login error:', error)
    } finally {
      setLoadingButton(null)
    }
  }

  const handleSSOLogin = async () => {
    setLoadingButton('sso')
    try {
      // Simulate SSO login process
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // TODO: Implement actual ICIT SSO flow
      console.log('SSO login initiated')
    } catch (error) {
      console.error('SSO login error:', error)
    } finally {
      setLoadingButton(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md rounded-3xl border border-border bg-background p-7 shadow-2xl shadow-primary/10 md:p-9"
    >
      {/* Back to Home Link */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        {t.login.backHome}
      </Link>

      {/* Header Icon */}
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <LockKeyhole className="size-5" />
      </div>

      {/* Title and Description */}
      <h1 className="mt-5 text-balance font-display text-3xl font-bold">
        {t.login.signIn}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t.login.accessWorkspace}
      </p>

      {/* Form */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.form
              key="email"
              exit={{ opacity: 0, x: -10 }}
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
            >
              <label className="flex flex-col gap-2 text-sm font-semibold">
                {t.login.universityEmail}
                <div className="relative">
                  <Mail className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.login.emailPlaceholder}
                    className="h-12 w-full rounded-xl border border-input bg-background pr-4 pl-11 font-normal outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </label>
              <button className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                {t.login.sendOTP}
                <ArrowRight className="size-4" />
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="mb-4 rounded-xl bg-surface p-3 text-sm text-muted-foreground">
                {t.login.otpSent}{' '}
                <strong className="text-foreground">{email}</strong>.
              </p>

              <label className="flex flex-col gap-2 text-sm font-semibold">
                {t.login.oneTimePassword}
                <input
                  required
                  inputMode="numeric"
                  maxLength={6}
                  placeholder={t.login.otpPlaceholder}
                  className="h-12 rounded-xl border border-input bg-background px-4 text-center font-mono text-xl tracking-[.4em] outline-none focus:ring-2 focus:ring-ring"
                />
              </label>

              <button className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                {t.login.verifySignIn}
                <ShieldCheck className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-3 w-full text-center text-xs font-medium text-muted-foreground hover:text-primary"
              >
                {t.login.differentEmail}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="my-7 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">{t.login.orContinueWith}</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* Alternative Login Methods */}
      <div className="grid gap-3">
        {/* Continue with Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loadingButton !== null}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold transition hover:bg-surface disabled:opacity-50"
        >
          {loadingButton === 'google' ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t.login.connecting}
            </>
          ) : (
            <>
              <Globe2 className="size-4" />
              {t.login.continueGoogle}
            </>
          )}
        </button>

        {/* Login with ICIT SSO Button */}
        <button
          onClick={handleSSOLogin}
          disabled={loadingButton !== null}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border text-sm font-semibold transition hover:bg-surface disabled:opacity-50"
        >
          {loadingButton === 'sso' ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t.login.connecting}
            </>
          ) : (
            <>
              <KeyRound className="size-4" />
              {t.login.loginSSO}
            </>
          )}
        </button>
      </div>

      {/* Security Notice */}
      <p className="mt-6 flex items-start gap-2 rounded-xl bg-surface p-3 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        {t.login.accessRestricted}
      </p>
    </motion.div>
  )
}
