'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Language } from './translations'

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
    const saved = localStorage.getItem('language') as Language | null
    if (saved && (saved === 'en' || saved === 'th')) {
      setLanguageState(saved)
      document.documentElement.lang = saved
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
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
