'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { authApi } from '@/lib/api'

interface OTPVerificationModalProps {
  isOpen: boolean
  email: string
  onClose: () => void
  onVerifySuccess?: (data: any) => void
  onBackToLogin: () => void
}

export function OTPVerificationModal({
  isOpen,
  email,
  onClose,
  onVerifySuccess,
  onBackToLogin,
}: OTPVerificationModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(30)
  const [isResendActive, setIsResendActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [maskEmail, setMaskEmail] = useState(true)
  const [isResendDisabledByRequest, setIsResendDisabledByRequest] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize countdown when modal opens
  useEffect(() => {
    if (isOpen && !isResendActive) {
      setTimeLeft(30)
      setOtp(['', '', '', '', '', ''])
      setErrorMessage('')
      setSuccessMessage('')
      inputRefs.current[0]?.focus()
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [isOpen])

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return

    if (timeLeft <= 0) {
      setIsResendActive(true)
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
      return
    }

    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [timeLeft, isOpen])

  // Format time as m:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Mask email for privacy
  const getMaskedEmail = () => {
    if (!maskEmail) return email
    const [name, domain] = email.split('@')
    if (!name || !domain) return email
    const visibleChars = Math.max(1, Math.floor(name.length / 3))
    const masked = name.slice(0, visibleChars) + '*'.repeat(name.length - visibleChars)
    return `${masked}@${domain}`
  }

  // Handle digit input
  const handleInput = (index: number, value: string) => {
    // Strip non-digits
    const digit = value.replace(/\D/g, '')

    if (digit.length > 1) {
      // Handle paste - spread digits across boxes
      const digits = digit.slice(0, 6).split('')
      const newOtp = [...otp]
      digits.forEach((d, i) => {
        if (index + i < 6) {
          newOtp[index + i] = d
        }
      })
      setOtp(newOtp)
      // Focus the last filled box
      const lastFilledIndex = Math.min(index + digits.length - 1, 5)
      inputRefs.current[lastFilledIndex]?.focus()
    } else {
      // Single digit
      const newOtp = [...otp]
      newOtp[index] = digit
      setOtp(newOtp)

      // Auto-advance to next box if digit is entered
      if (digit && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  // Handle backspace and arrow keys
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (otp[index] === '' && index > 0) {
        // Move to previous box if current is empty
        inputRefs.current[index - 1]?.focus()
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
      } else {
        // Clear current box
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    } else if (e.key === 'Enter' && isComplete) {
      e.preventDefault()
      handleVerify()
    }
  }

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('')

    if (digits.length > 0) {
      const newOtp = [...otp]
      digits.forEach((d, i) => {
        newOtp[i] = d
      })
      setOtp(newOtp)

      // Focus the last filled box
      const lastFilledIndex = Math.min(digits.length - 1, 5)
      inputRefs.current[lastFilledIndex]?.focus()
    }
  }

  // Check if all boxes are filled
  const isComplete = otp.every((digit) => digit !== '')

  // Handle verify
  const handleVerify = async () => {
    if (!isComplete || isVerifying) return

    setIsVerifying(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const code = otp.join('')
      await authApi.verifyOtp(email, code)

      setSuccessMessage('Email verified successfully!')
      setTimeout(() => {
        onVerifySuccess?.({
          email,
          role: 'student', // This will be set by the actual API response in login-card
          profile_id: 0, // This will be set by the actual API response in login-card
        })
        onClose()
      }, 1500)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'OTP verification failed'
      setErrorMessage(errorMsg)
      console.error('OTP verification error:', error)
    } finally {
      setIsVerifying(false)
    }
  }

  // Handle resend
  const handleResend = async () => {
    if (isResending || isResendDisabledByRequest) return

    setIsResending(true)
    setErrorMessage('')
    setSuccessMessage('')
    setIsResendDisabledByRequest(true)

    try {
      await authApi.requestOtp(email)

      // Reset UI
      setOtp(['', '', '', '', '', ''])
      setTimeLeft(30)
      setIsResendActive(false)
      setSuccessMessage('New code sent to your email')
      inputRefs.current[0]?.focus()

      // Re-enable resend after a short delay
      setTimeout(() => {
        setIsResendDisabledByRequest(false)
      }, 1000)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to resend OTP'
      setErrorMessage(errorMsg)
      setIsResendDisabledByRequest(false)
      console.error('Resend OTP error:', error)
    } finally {
      setIsResending(false)
    }
  }

  // Handle close button
  const handleCloseModal = () => {
    if (!isVerifying && !isResending) {
      setOtp(['', '', '', '', '', ''])
      setErrorMessage('')
      setSuccessMessage('')
      onClose()
    }
  }

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isVerifying && !isResending) {
      handleCloseModal()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md rounded-3xl bg-background border border-border shadow-2xl shadow-primary/10 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="absolute top-5 right-5">
                <button
                  onClick={handleCloseModal}
                  disabled={isVerifying || isResending}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-7 md:p-9">
                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    Verify Your Email
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    We've sent a 6-digit verification code to your email.
                  </p>
                </div>

                {/* Email Display */}
                <div className="mb-8 flex items-center justify-between gap-2 p-3 rounded-xl bg-muted/50">
                  <span className="text-sm font-medium text-foreground">{getMaskedEmail()}</span>
                  <button
                    onClick={() => setMaskEmail(!maskEmail)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                    aria-label={maskEmail ? 'Show email' : 'Hide email'}
                  >
                    {maskEmail ? (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 flex items-start gap-3 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{errorMessage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Message */}
                <AnimatePresence>
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 flex items-start gap-3 rounded-xl bg-green-500/10 p-3 text-sm text-green-600"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{successMessage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* OTP Input Fields */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-foreground mb-4">
                    Enter verification code
                  </label>
                  <div className="flex gap-2 md:gap-3 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={digit}
                        onChange={(e) => handleInput(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={isVerifying || isResending}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-lg border-2 border-input bg-background text-center text-xl md:text-2xl font-semibold text-foreground placeholder-muted-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="•"
                      />
                    ))}
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerify}
                  disabled={!isComplete || isVerifying || isResending}
                  className="w-full h-12 rounded-xl bg-primary text-sm md:text-base font-semibold text-primary-foreground transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify'
                  )}
                </button>

                {/* Resend Section */}
                <div className="mb-6 text-center text-sm">
                  {isResendActive ? (
                    <button
                      onClick={handleResend}
                      disabled={isResending || isResendDisabledByRequest || isVerifying}
                      className="text-primary hover:text-primary/80 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResending ? 'Sending...' : 'Resend code'}
                    </button>
                  ) : (
                    <p className="text-muted-foreground">
                      Didn't get it?{' '}
                      <span className="text-foreground font-semibold">
                        Resend in {formatTime(timeLeft)}
                      </span>
                    </p>
                  )}
                </div>

                {/* Back to Login Button */}
                <button
                  onClick={onBackToLogin}
                  disabled={isVerifying || isResending}
                  className="w-full h-11 rounded-xl border-2 border-border bg-background text-sm md:text-base font-semibold text-foreground transition-all duration-200 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
