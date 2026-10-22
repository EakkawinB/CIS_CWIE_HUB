'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { ApiResponse } from './api'

export interface AuthUser {
  email: string
  role: 'student' | 'teacher' | 'staff'
  profile_id: number
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, otp: string) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'cis_cwie_auth'
const TOKEN_KEY = 'cis_cwie_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const token = localStorage.getItem(TOKEN_KEY)

        if (stored && token) {
          const userData: AuthUser = JSON.parse(stored)
          setUser(userData)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(TOKEN_KEY)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = useCallback(async (email: string, otp: string) => {
    const { authApi } = await import('./api')

    try {
      const response = await authApi.verifyOtp(email, otp)

      const userData: AuthUser = {
        email,
        role: response.role as AuthUser['role'],
        profile_id: response.profile_id ?? 0,
      }

      // Generate a simple token (in production, this should come from backend)
      const token = btoa(`${email}:${Date.now()}`)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
      localStorage.setItem(TOKEN_KEY, token)

      setUser(userData)
      setIsAuthenticated(true)
    } catch (error) {
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const refresh = useCallback(async () => {
    // In a real app, call a refresh token endpoint
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const userData: AuthUser = JSON.parse(stored)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Failed to refresh auth:', error)
        logout()
      }
    } else {
      logout()
    }
  }, [logout])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refresh,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
