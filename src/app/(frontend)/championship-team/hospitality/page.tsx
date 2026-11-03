import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { randomUUID } from 'node:crypto'
import { getEvents, getSettings } from '@/lib/data'
import { nextEvent } from '@/lib/events'
import { HospitalityEnquiryForm } from '@/components/forms'
import { Breadcrumbs, Card, Notice, PageHero, Section, SectionHeading } from '@/components/ui'

export const metadata: Metadata = { title: 'Hospitality', description: 'Race-weekend and team engagement opportunities with Karat Racing — by enquiry.', alternates: { canonical: '/championship-team/hospitality' } }

export default async function Hospitality({ searchParams }: { searchParams: Promise<{ event?: string }> }) {
  const sp = await searchParams
  const [{ flags }, events] = await Promise.all([getSettings(), getEvents()])
  if (!flags.hospitalityEnquiries) notFound()
  const upcoming = events.filter((e) => e.status !== 'cancelled' && e.endDate && new Date(e.endDate) > new Date())
  const options = upcoming.map((e) => ({ value: e.slug!, label: e.title }))
  const def = options.find((o) => o.value === sp.event)?.value ?? nextEvent(upcoming)?.slug ?? undefined
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Hospitality' }]} />
      <PageHero eyebrow="Partners" title="Hospitality" intro="Bring guests closer to a race weekend. Every request is discussed individually." image="/brand/car-rear-light.jpg" />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="grid content-start gap-4">
            <SectionHeading eyebrow="How it works" title="Enquiry, not booking" />
            <Card>
              <ul className="grid gap-3 text-sm">
                <li>1. Tell us the event, group size and what you would like to achieve.</li>
                <li>2. We check what is possible with the championship organiser.</li>
                <li>3. We send a written proposal. Nothing is confirmed until both sides agree it in writing.</li>
              </ul>
            </Card>
            <Notice tone="warn" title="Access">Passes, paddock access and on-track activities are controlled by the championship and circuit, and cannot be guaranteed.</Notice>
          </div>
          <div>
            <HospitalityEnquiryForm initialKey={randomUUID()} events={options} defaultEvent={def} />
          </div>
        </div>
      </Section>
    </>
  )
}
