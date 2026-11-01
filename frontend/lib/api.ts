// API utilities for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ApiResponse<T> {
  data?: T
  message?: string
  detail?: string
  role?: string
  profile_id?: number | string
  access_token?: string
  token_type?: string
  status?: string
  success?: boolean
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public detail?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Helper function to get JWT token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('cis_cwie_token')
  }
  return null
}

// Helper function to map backend error messages to translation keys
function getErrorKey(
  statusCode: number,
  detail: string | undefined
): string {
  if (!detail) {
    if (statusCode === 403) return 'login.errors.accessDenied'
    if (statusCode === 404) return 'login.errors.userNotFound'
    if (statusCode === 400) return 'login.errors.invalidOTP'
    if (statusCode >= 500) return 'login.errors.unknownError'
    return 'login.errors.fetchFailed'
  }

  // Map backend error messages to translation keys
  const detailLower = detail.toLowerCase()

  if (detailLower.includes('ไม่มีสิทธิ์') || detailLower.includes('not authorized')) {
    return 'login.errors.accessDenied'
  }
  if (detailLower.includes('ไม่ถูกต้อง') || detailLower.includes('incorrect')) {
    return 'login.errors.otpInvalid'
  }
  if (detailLower.includes('หมดอายุ') || detailLower.includes('expired')) {
    return 'login.errors.otpExpired'
  }

  return 'login.errors.unknownError'
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()

  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  // Add authorization header if token exists
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorDetail = errorData.detail || errorData.message
      const errorKey = getErrorKey(response.status, errorDetail)

      throw new ApiError(response.status, errorKey, errorDetail)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Request aborted (timeout)
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(408, 'login.errors.requestTimeout')
    }

    // Network error
    if (error instanceof TypeError) {
      throw new ApiError(
        0,
        'login.errors.networkError',
        error.message
      )
    }

    throw new ApiError(
      500,
      'login.errors.unknownError',
      error instanceof Error ? error.message : 'Unknown error occurred'
    )
  }
}

export const authApi = {
  // Request OTP
  requestOtp: async (
    email: string,
    options?: { signal?: AbortSignal }
  ): Promise<ApiResponse<void>> => {
    return request('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
      signal: options?.signal,
    })
  },

  // Verify OTP
  verifyOtp: async (
    email: string,
    otp: string
  ): Promise<ApiResponse<{ role: string; profile_id: number; access_token: string }>> => {
    return request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    })
  },

  // Get current user
  getCurrentUser: async () => {
    return request('/auth/me', {
      method: 'GET',
    })
  },

  // TODO: Implement Google OAuth callback handler
  // googleLogin: async (token: string) => { ... }
}