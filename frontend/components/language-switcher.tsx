'use client'

import { useLanguage } from '@/lib/language-context'

const FlagUK = () => (
  <svg width="18" height="13" viewBox="0 0 22 16" className="rounded-sm flex-shrink-0">
    <rect width="22" height="16" fill="#012169" />
    <path d="M0,0 L22,16 M22,0 L0,16" stroke="#fff" strokeWidth="3" />
    <path d="M0,0 L22,16 M22,0 L0,16" stroke="#C8102E" strokeWidth="1.5" />
    <path d="M11,0 V16 M0,8 H22" stroke="#fff" strokeWidth="5" />
    <path d="M11,0 V16 M0,8 H22" stroke="#C8102E" strokeWidth="3" />
  </svg>
)

const FlagTH = () => (
  <svg width="18" height="13" viewBox="0 0 22 16" className="rounded-sm flex-shrink-0">
    <rect width="22" height="16" fill="#A51931" />
    <rect y="2.67" width="22" height="10.67" fill="#F4F5F8" />
    <rect y="5.33" width="22" height="5.33" fill="#2D2A4A" />
  </svg>
)

type Lang = 'en' | 'th'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const handleToggle = () => {
    const next: Lang = language === 'en' ? 'th' : 'en'
    setLanguage(next)
  }

  return (
    <button
      onClick={handleToggle}
      className="relative flex items-center gap-0 rounded-full border border-border bg-muted p-0.5 cursor-pointer w-32"
      aria-label={language === 'en' ? 'Switch to Thai' : 'เปลี่ยนเป็นภาษาอังกฤษ'}
    >
      {/* sliding thumb */}
      <span
        className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-background border border-border shadow-sm transition-all duration-200 ${
          language === 'th' ? 'left-[calc(50%)]' : 'left-0.5'
        }`}
      />

      {/* EN option */}
      <span
        className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-colors ${
          language === 'en' ? 'text-foreground' : 'text-muted-foreground'
        }`}
      >
        <FlagUK /> EN
      </span>

      {/* TH option */}
      <span
        className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs font-medium transition-colors ${
          language === 'th' ? 'text-foreground' : 'text-muted-foreground'
        }`}
      >
        <FlagTH /> TH
      </span>
    </button>
  )
}
