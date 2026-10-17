import { getTranslation, type Language } from './translations'
import { ApiError } from './api'

/**
 * Translate error message based on language
 * Handles both translation keys and direct error messages
 */
export function translateError(
  error: unknown,
  language: Language
): string {
  const t = getTranslation(language)

  if (error instanceof ApiError) {
    // If the message is a translation key like 'login.errors.accessDenied'
    if (error.message.startsWith('login.errors.')) {
      const keys = error.message.split('.')
      try {
        // Access nested property: t.login.errors.accessDenied
        let value: any = t
        for (const key of keys) {
          value = value[key]
        }
        return typeof value === 'string' ? value : error.message
      } catch {
        return error.detail || error.message || t.login.errors.unknownError
      }
    }
    // Return the detail or message directly
    return error.detail || error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return t.login.errors.unknownError
}

/**
 * Get appropriate loading message based on language
 */
export function getLoadingMessage(
  action: 'sendOtp' | 'verifyOtp' | 'googleLogin' | 'ssoLogin',
  language: Language
): string {
  const messages: Record<Language, Record<string, string>> = {
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

/**
 * Get success message based on language
 */
export function getSuccessMessage(
  action: 'otpSent' | 'otpVerified' | 'loginSuccess',
  language: Language
): string {
  const messages: Record<Language, Record<string, string>> = {
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
