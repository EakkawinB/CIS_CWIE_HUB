'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bell, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { getTranslation } from '@/lib/translations'
import { LanguageSwitcher } from './language-switcher'

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const { language } = useLanguage()
  const t = getTranslation(language)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? 'border-b bg-background/90 shadow-sm backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3" aria-label="CIS CWIE Hub home">
          <Image
            src="/cis-kmutnb-logo.png"
            alt="Official CIS KMUTNB logo"
            width={76}
            height={54}
            className="h-12 w-auto object-contain"
            priority
          />
          <span className="hidden border-l pl-3 sm:block">
            <strong className="block text-sm tracking-tight">CIS CWIE Hub</strong>
            <span className="block text-xs text-muted-foreground">
              {t.siteHeader.cooperative}
            </span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-6 text-sm font-medium lg:flex">
          <a href="#announcements">{t.nav.announcements}</a>
          <a href="#eligibility">{t.nav.eligibility}</a>
          <a href="#workflow">{t.nav.workflow}</a>
          <a href="#faq">{t.nav.faq}</a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notifications */}
          <button
            className="rounded-full p-2 hover:bg-accent"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
          </button>

          {/* Status */}
          <span className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
            <i className="size-2 rounded-full bg-secondary" /> {t.nav.guest}
          </span>

          {/* Login Button */}
          <Link
            href="/login"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            {t.nav.login}
          </Link>

          {/* Mobile Menu */}
          <button className="p-2 lg:hidden" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
        </div>
      </nav>
    </header>
  )
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/cis-kmutnb-logo.png"
        alt="Official CIS KMUTNB logo"
        width={compact ? 72 : 120}
        height={compact ? 50 : 86}
        className="h-auto w-auto object-contain"
      />
      <div>
        <strong className="block text-lg">CIS CWIE Hub</strong>
        <span className="text-xs text-muted-foreground">KMUTNB</span>
      </div>
    </div>
  )
}
