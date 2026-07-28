'use client'

import { Reveal } from './motion-primitives'
import { ArrowUpRight, Megaphone } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { getTranslation } from '@/lib/translations'

export function Announcements() {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const items = t.announcementsList
  const loop = [...items, ...items]

  return (
    <section id="announcements" className="border-y border-border bg-surface py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 sm:flex-row sm:justify-between lg:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <Megaphone className="size-3.5" /> {t.announcements.badge}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
            {t.announcements.title}
          </h2>
        </Reveal>
        <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          {t.announcements.viewAll} <ArrowUpRight className="size-4" />
        </a>
      </div>
      <div className="group relative mt-10 overflow-hidden">
        <div className="flex w-max gap-5 px-5 animate-marquee">
          {loop.map((a, i) => (
            <article
              key={i}
              className="w-80 shrink-0 rounded-2xl border border-border bg-background/70 p-6 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {a.tag}
                </span>
                <span className="text-xs text-muted-foreground">{a.date}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
