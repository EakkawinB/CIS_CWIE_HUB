'use client'

import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { getTranslation } from '@/lib/translations'

export function LoginPageSidebar() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  return (
    <section className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
      {/* Decorative Circles */}
      <div className="absolute -right-32 -bottom-32 size-[500px] rounded-full border border-primary-foreground/10" />
      <div className="absolute -right-16 -bottom-16 size-[360px] rounded-full border border-primary-foreground/10" />

      {/* Logo - No Background */}
      <Image
        src="/cis-kmutnb-logo.png"
        alt="Official CIS KMUTNB logo"
        width={120}
        height={86}
        className="relative h-20 w-auto object-contain"
      />

      {/* Content */}
      <div className="relative max-w-lg">
        <span className="text-xs font-bold uppercase tracking-[.2em] text-primary-foreground/65">
          {t.loginPage.cooperative}
        </span>
        <h2 className="mt-5 text-balance font-display text-4xl font-bold leading-tight">
          {t.loginPage.title}
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/75">
          {t.loginPage.description}
        </p>

        {/* Benefits List */}
        <div className="mt-8 flex flex-col gap-3 text-sm">
          {[t.loginPage.benefit1, t.loginPage.benefit2, t.loginPage.benefit3].map((benefit) => (
            <p key={benefit} className="flex items-center gap-3">
              <CheckCircle2 className="size-5" />
              {benefit}
            </p>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="relative text-xs text-primary-foreground/55">
        {t.loginPage.footer}
      </p>
    </section>
  )
}
