'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  FileCheck2,
  Handshake,
  LineChart,
  ClipboardCheck,
  BellRing,
  Languages,
  UserRound,
  FileUp,
  Building2,
  BriefcaseBusiness,
  Flag,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import { Reveal, SectionHeading } from './motion-primitives'
import { useLanguage } from '@/lib/language-context'
import { getTranslation } from '@/lib/translations'
import { Counter } from './counter'

const companies = [
  'SCG',
  'PTT',
  'CP Group',
  'AIS',
  'TRUE',
  'IBM',
  'Accenture',
  'KBTG',
  'CPF',
  'ThaiBev',
]

// ==================== Partner Companies ====================
export function PartnerCompanies() {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const row = [...companies, ...companies]

  return (
    <section className="overflow-hidden py-20">
      <SectionHeading
        eyebrow={t.companies.eyebrow}
        title={t.companies.title}
        description={t.companies.description}
      />

      <div className="mt-12 flex w-max gap-4 animate-marquee">
        {row.map((c, i) => (
          <div
            key={i}
            className="flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-border bg-card font-display text-xl font-bold text-muted-foreground grayscale transition hover:text-primary hover:grayscale-0"
          >
            {c}
          </div>
        ))}
      </div>

      <div className="mt-4 flex w-max gap-4 animate-marquee-reverse">
        {row.reverse().map((c, i) => (
          <div
            key={i}
            className="flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-border bg-surface font-display text-xl font-bold text-muted-foreground grayscale transition hover:text-primary hover:grayscale-0"
          >
            {c}
          </div>
        ))}
      </div>
    </section>
  )
}

// ==================== Features ====================
export function Features() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  const features = [
    [
      t.features.paperless,
      FileCheck2,
      t.features.paperlessDesc,
    ],
    [
      t.features.matching,
      Handshake,
      t.features.matchingDesc,
    ],
    [
      t.features.monitoring,
      LineChart,
      t.features.monitoringDesc,
    ],
    [
      t.features.evaluation,
      ClipboardCheck,
      t.features.evaluationDesc,
    ],
    [
      t.features.notifications,
      BellRing,
      t.features.notificationsDesc,
    ],
    [
      t.features.multiLanguage,
      Languages,
      t.features.multiLanguageDesc,
    ],
  ] as const

  return (
    <section id="why" className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t.features.eyebrow}
          title={t.features.title}
          description={t.features.description}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, Icon, description], i) => (
            <Reveal key={title} delay={i * 0.05}>
              <article className="group h-full rounded-2xl border border-border bg-background p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== Workflow ====================
export function Workflow() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  const steps = t.workflow.steps.map((step, index) => [
    step,
      [UserRound, FileUp, Handshake, FileCheck2, Building2, BriefcaseBusiness, LineChart, ClipboardCheck, Flag][index],
    ]) as const

  return (
    <section id="workflow" className="py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t.workflow.eyebrow}
          title={t.workflow.title}
          description={t.workflow.description}
        />

        <div className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="absolute top-7 right-10 left-10 hidden h-px bg-border lg:block" />

          {steps.map(([s, I], i) => (
            <Reveal key={s} delay={i * 0.04}>
              <div className="relative flex items-center gap-4 rounded-xl border border-border bg-background p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <I className="size-4" />
                </span>
                <div>
                  <span className="text-xs font-bold text-secondary">
                    STEP {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-semibold">{s}</h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== Statistics ====================
export function Statistics() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  const stats = [
    ['30', t.statistics.students],
    ['20', t.statistics.advisors],
    ['15', t.statistics.companies],
    ['100', t.statistics.paperless],
  ]

  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-primary-foreground/20 bg-primary-foreground/20 px-5 md:grid-cols-4">
        {stats.map(([n, l]) => (
          <Reveal key={l} className="bg-primary p-8 text-center">
            <strong className="font-display text-4xl md:text-5xl">
              <Counter end={parseInt(n)} duration={2.5} />
              {l === t.statistics.paperless ? '%' : '+'}
            </strong>
            <p className="mt-2 text-sm text-primary-foreground/70">{l}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ==================== FAQ ====================
export function FAQ() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  const faqs = [
    [t.faq.q1, t.faq.a1],
    [t.faq.q2, t.faq.a2],
    [t.faq.q3, t.faq.a3],
    [t.faq.q4, t.faq.a4],
    [t.faq.q5, t.faq.a5],
  ]

  return (
    <section id="faq" className="bg-surface py-24">
      <div className="mx-auto max-w-3xl px-5">
        <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />

        <Accordion className="mt-10" defaultValue={['item-0']} multiple>
          {faqs.map(([q, a], i) => (
            <AccordionItem key={q} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-semibold">
                {q}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

// ==================== CTA ====================
export function CTA() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  return (
    <section className="px-5 py-20">
      <Reveal className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground shadow-2xl md:px-16 md:py-20">
        <span className="text-xs font-bold uppercase tracking-[.2em] text-primary-foreground/70">
          {t.cta.eyebrow}
        </span>
        <h2 className="mx-auto mt-4 max-w-3xl text-balance font-display text-3xl font-bold md:text-5xl">
          {t.cta.title}
        </h2>
        <p className="mt-4 text-primary-foreground/75">{t.cta.subtitle}</p>
        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-background px-6 py-3 text-sm font-semibold text-primary shadow-lg transition hover:scale-[1.02]"
        >
          {t.cta.loginNow}
          <ArrowRight className="size-4" />
        </Link>
      </Reveal>
    </section>
  )
}

// ==================== Footer ====================
export function Footer() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        {/* Logo and About */}
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/cis-kmutnb-logo.png"
              alt="Official CIS KMUTNB logo"
              width={88}
              height={63}
              className="h-14 w-auto object-contain"
            />
            <div>
              <strong className="font-display">CIS CWIE Hub</strong>
              <p className="text-xs text-muted-foreground">KMUTNB</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t.footer.about}
            <br />
            {t.footer.university}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold">{t.footer.quickLinks}</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <a href="#">{t.footer.footerContact}</a>
            <a href="#">{t.footer.privacyPolicy}</a>
            <a href="#faq">{t.footer.help}</a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-bold">{t.footer.footerContact}</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <span className="flex gap-2">
              <MapPin className="size-4 shrink-0" />
              {t.footer.address}
            </span>
            <span className="flex gap-2">
              <Mail className="size-4" />
              {t.footer.email}
            </span>
            <span className="flex gap-2">
              <Phone className="size-4" />
              {t.footer.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        {t.footer.copyright}
      </div>
    </footer>
  )
}
