'use client'

import { CalendarDays, Clock, MapPin, ArrowRight } from 'lucide-react'
import { Reveal, SectionHeading } from './motion-primitives'
import { useLanguage } from '@/lib/language-context'
import { getTranslation } from '@/lib/translations'

export function UpcomingEvents() {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const events = t.eventsList

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow={t.events.eyebrow}
          title={t.events.title}
          description={t.events.description}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {events.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.08}>
              <article className="group h-full rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-primary px-3 py-2 text-center text-primary-foreground">
                    <strong className="block text-2xl leading-none">{e.day}</strong>
                    <span className="text-[10px] font-bold tracking-wide">{e.month}</span>
                  </div>
                  <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-primary">
                    {e.label}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">{e.title}</h3>
                <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Clock className="size-4" /> {e.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4" /> {e.place}
                  </p>
                </div>
                <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  {t.events.register} <ArrowRight className="size-4" />
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
