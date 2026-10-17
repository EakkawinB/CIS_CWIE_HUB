'use client'

import { LoginCard } from '@/components/login-card'
import { LoginPageSidebar } from '@/components/login-page-sidebar'
import { LoadingScreen } from '@/components/loading-screen'
import { LanguageSwitcher } from '@/components/language-switcher'
import { LanguageProvider } from '@/lib/language-context'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <LanguageProvider>
      <main className="min-h-screen bg-surface">
        <div className="grid min-h-screen lg:grid-cols-2">
          {/* Language Switcher - Top Right */}
          <div className="fixed top-5 right-5 z-50">
            <LanguageSwitcher />
          </div>
          {/* Left Section - Branding and Benefits (Desktop Only) */}
          <LoginPageSidebar />

          {/* Right Section - Login Card (Logo removed for responsive) */}
          <section className="flex items-center justify-center px-5 py-10">
            <LoginCard />
          </section>
        </div>
      </main>
    </LanguageProvider>
  )
}
