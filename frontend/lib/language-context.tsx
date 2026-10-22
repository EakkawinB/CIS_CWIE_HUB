'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Language } from './translations'
import i18n from './i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load language from i18n after initialization
    const currentLang = (i18n.language || 'en') as Language
    setLanguageState(currentLang)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    i18n.changeLanguage(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
      document.documentElement.lang = lang
    }
  }

  // Provide context to children regardless of mounted state
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  // Return default value if context is not available (during SSR/initial render)
  if (!context) {
    return {
      language: 'en' as Language,
      setLanguage: () => {},
    }
  }

  return context
}
