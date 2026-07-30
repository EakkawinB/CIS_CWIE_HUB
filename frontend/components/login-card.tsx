'use client'

import { useState, useRef, useEffect } from 'react'
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
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { getTranslation } from '@/lib/translations'
import { authApi } from '@/lib/api'
import { translateError, getLoadingMessage, getSuccessMessage } from '@/lib/error-translator'
import { AuthLoadingModal } from './auth-loading-modal'

export function LoginCard() {
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loadingButton, setLoadingButton] = useState<'google' | 'sso' | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authLoadingMessage, setAuthLoadingMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [resendCountdown, setResendCountdown] = useState(0)
  const countdownInterval = useRef<NodeJS.Timeout | null>(null)
  const { language } = useLanguage()
  const t = getTranslation(language)

  // Cleanup countdown on unmount
  useEffect(() => {
    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current)
    }
  }, [])

  // Handle countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      countdownInterval.current = setInterval(() => {
        setResendCountdown((prev) => prev - 1)
      }, 1000)
    } else {
      if (countdownInterval.current) clearInterval(countdownInterval.current)
    }

    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current)
    }
  }, [resendCountdown])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!email.trim()) {
      setError(t.login.errors.emailRequired)
      return
    }

    setAuthLoading(true)
    setAuthLoadingMessage(getLoadingMessage('sendOtp', language))

    try {
      await authApi.requestOtp(email)
      setSent(true)
      setResendCountdown(60)
      setSuccess(true)
      setSuccessMessage(getSuccessMessage('otpSent', language))
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const errorMessage = translateError(err, language)
      setError(errorMessage)
    } finally {
      setAuthLoading(false)
      setAuthLoadingMessage('')
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!otp || otp.length !== 6) {
      setError(t.login.errors.invalidOTP)
      return
    }

    setAuthLoading(true)
    setAuthLoadingMessage(getLoadingMessage('verifyOtp', language))

    try {
      const response = await authApi.verifyOtp(email, otp)
      console.log('OTP verified successfully:', response)
      setSuccess(true)
      setSuccessMessage(getSuccessMessage('otpVerified', language))
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1500)
    } catch (err) {
      const errorMessage = translateError(err, language)
      setError(errorMessage)
    } finally {
      setAuthLoading(false)
      setAuthLoadingMessage('')
    }
  }

  const handleResendOTP = async () => {
    setError(null)
    setSuccess(false)

    setAuthLoading(true)
    setAuthLoadingMessage(getLoadingMessage('sendOtp', language))

    try {
      await authApi.requestOtp(email)
      setResendCountdown(60)
      setSuccess(true)
      setSuccessMessage(getSuccessMessage('otpSent', language))
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const errorMessage = translateError(err, language)
      setError(errorMessage)
    } finally {
      setAuthLoading(false)
      setAuthLoadingMessage('')
    }
  }

  const handleGoogleLogin = async () => {
    setLoadingButton('google')
    setAuthLoading(true)
    setAuthLoadingMessage(getLoadingMessage('googleLogin', language))
    try {
      // TODO: Implement actual Google OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('Google login initiated')
    } catch (error) {
      console.error('Google login error:', error)
      setError(t.login.errors.unknownError)
    } finally {
      setLoadingButton(null)
      setAuthLoading(false)
      setAuthLoadingMessage('')
    }
  }

  const handleSSOLogin = async () => {
    setLoadingButton('sso')
    setAuthLoading(true)
    setAuthLoadingMessage(getLoadingMessage('ssoLogin', language))
    try {
      // TODO: Implement actual ICIT SSO flow
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('SSO login initiated')
    } catch (error) {
      console.error('SSO login error:', error)
      setError(t.login.errors.unknownError)
    } finally {
      setLoadingButton(null)
      setAuthLoading(false)
      setAuthLoadingMessage('')
    }
  }

  const handleBackToEmail = () => {
    setSent(false)
    setOtp('')
    setError(null)
    setSuccess(false)
  }

  return (
    <>
      <AuthLoadingModal isOpen={authLoading} message={authLoadingMessage} />

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

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 flex items-start gap-3 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {success && successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 flex items-start gap-3 rounded-xl bg-green-500/10 p-3 text-sm text-green-600"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              <p>{successMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form
                key="email"
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleSendOTP}
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
                      className="h-12 w-full rounded-xl border border-input bg-background pr-4 pl-11 font-normal outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                      disabled={authLoading}
                    />
                  </div>
                </label>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {t.login.connecting}
                    </>
                  ) : (
                    <>
                      {t.login.sendOTP}
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleVerifyOTP}
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
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder={t.login.otpPlaceholder}
                    className="h-12 rounded-xl border border-input bg-background px-4 text-center font-mono text-xl tracking-[.4em] outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    disabled={authLoading}
                  />
                </label>

                <button
                  type="submit"
                  disabled={authLoading || otp.length !== 6}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {t.login.connecting}
                    </>
                  ) : (
                    <>
                      {t.login.verifySignIn}
                      <ShieldCheck className="size-4" />
                    </>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="flex-1 text-center text-xs font-medium text-muted-foreground hover:text-primary"
                  >
                    {t.login.differentEmail}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendCountdown > 0 || authLoading}
                    className="flex-1 text-center text-xs font-medium text-muted-foreground hover:text-primary disabled:opacity-50"
                  >
                    {resendCountdown > 0
                      ? `${language === 'th' ? 'ส่งใหม่' : 'Resend'} (${resendCountdown}s)`
                      : language === 'th'
                        ? 'ส่งใหม่'
                        : 'Resend OTP'}
                  </button>
                </div>
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
            disabled={loadingButton !== null || authLoading}
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
            disabled={loadingButton !== null || authLoading}
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
    </>
  )
}
