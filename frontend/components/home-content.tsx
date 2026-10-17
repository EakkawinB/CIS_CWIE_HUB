'use client'

import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { Announcements } from '@/components/announcements'
import { UpcomingEvents } from '@/components/upcoming-events'
import { EligibilityChecker } from '@/components/eligibility-checker'
import {
  PartnerCompanies,
  Features,
  Workflow,
  Statistics,
  FAQ,
  CTA,
  Footer,
} from '@/components/landing-sections'

export function HomeContent() {
  return (
    <main className="overflow-hidden">
      <SiteHeader />
      <Hero />
      <Announcements />
      <UpcomingEvents />
      <EligibilityChecker />
      <PartnerCompanies />
      <Features />
      <Workflow />
      <Statistics />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
