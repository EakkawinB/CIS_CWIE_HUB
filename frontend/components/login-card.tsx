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
import { authApi, ApiError } from '@/lib/api'
import { AuthLoadingModal } from './auth-loading-modal'
import { OTPVerificationModal } from './otp-verification'

// Inline helper functions for error translation and messages
const translateError = (error: unknown, language: 'en' | 'th'): string => {
  const t = getTranslation(language)

  if (error instanceof ApiError) {
    if (error.message.startsWith('login.errors.')) {
      const keys = error.message.split('.')
      try {
        let value: any = t
        for (const key of keys) {
          value = value[key]
        }
        return typeof value === 'string' ? value : error.message
      } catch {
        return error.detail || error.message || t.login.errors.unknownError
      }
    }
    return error.detail || error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return t.login.errors.unknownError
}

const getLoadingMessage = (
  action: 'sendOtp' | 'verifyOtp' | 'googleLogin' | 'ssoLogin',
  language: 'en' | 'th'
): string => {
  const messages = {
    en: {
      sendOtp: 'Sending OTP...',
      verifyOtp: 'Verifying OTP...',
      googleLogin: 'Signing in with Google...',
      ssoLogin: 'Connecting to ICIT SSO...',
    },
    th: {
      sendOtp: 'กำลังส่ง OTP...',
      verifyOtp: 'กำลังตรวจสอบ OTP...',
      googleLogin: 'กำลังเข้าสู่ระบบด้วย Google...',
      ssoLogin: 'กำลังเชื่อมต่อกับ ICIT SSO...',
    },
  }
  return messages[language][action] || messages.en[action]
}

const getSuccessMessage = (
  action: 'otpSent' | 'otpVerified' | 'loginSuccess',
  language: 'en' | 'th'
): string => {
  const t = getTranslation(language)
  const messages = {
    en: {
      otpSent: 'OTP sent successfully! Check your email.',
      otpVerified: 'OTP verified successfully!',
      loginSuccess: 'Sign in successful!',
    },
    th: {
      otpSent: 'ส่ง OTP สำเร็จแล้ว! ตรวจสอบอีเมลของคุณ',
      otpVerified: 'ตรวจสอบ OTP สำเร็จแล้ว!',
      loginSuccess: 'เข้าสู่ระบบสำเร็จแล้ว!',
    },
  }
  return messages[language][action] || messages.en[action]
}

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
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false)
  const [otpModalEmail, setOtpModalEmail] = useState('')
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
      setOtpModalEmail(email)
      setIsOTPModalOpen(true)
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
      const { useAuth } = await import('@/lib/auth-context')
      // Note: Can't use hook directly here, but authApi.verifyOtp handles the API call
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

  const handleOTPModalVerifySuccess = async (data: any) => {
    // Redirect to dashboard after successful verification
    setAuthLoading(true)
    setAuthLoadingMessage(getLoadingMessage('verifyOtp', language))

    try {
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

  const handleCloseOTPModal = () => {
    setIsOTPModalOpen(false)
    setOtpModalEmail('')
  }

  const handleBackToLogin = () => {
    setIsOTPModalOpen(false)
    setOtpModalEmail('')
    setEmail('')
    setError(null)
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
      <OTPVerificationModal
        isOpen={isOTPModalOpen}
        email={otpModalEmail}
        onClose={handleCloseOTPModal}
        onVerifySuccess={handleOTPModalVerifySuccess}
        onBackToLogin={handleBackToLogin}
      />

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
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
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
                  disabled={authLoading || isOTPModalOpen}
                />
              </div>
            </label>
            <button
              type="submit"
              disabled={authLoading || isOTPModalOpen}
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
