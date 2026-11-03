import type { Metadata } from 'next'
import { randomUUID } from 'node:crypto'
import { getSettings } from '@/lib/data'
import { GeneralEnquiryForm } from '@/components/forms'
import { Notice, PageHero, Section } from '@/components/ui'

export const metadata: Metadata = { title: 'Safeguarding', alternates: { canonical: '/safeguarding' } }

export default async function Safeguarding() {
  const { site } = await getSettings()
  return (
    <>
      <PageHero eyebrow="Karat Racing" title="Safeguarding" intro="Many drivers in junior single-seater racing are under 18. Their welfare comes first in everything we do." />
      <Section className="!pt-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="prose-k">
            <h2>Our commitments</h2>
            <ul>
              <li>A parent or guardian is involved in every enquiry and agreement concerning a driver under 18.</li>
              <li>We publish young drivers’ personal information and photographs only with documented permission.</li>
              <li>We never publish home addresses, private contact details, accommodation or detailed travel plans.</li>
              <li>Only authorised staff can access enquiries that involve young drivers.</li>
            </ul>
            {site.safeguardingLead ? <p>Safeguarding lead: <strong>{site.safeguardingLead}</strong></p> : <p className="text-mist">[Approved safeguarding lead to be named before launch.]</p>}
            <Notice tone="warn" title="Emergency">If a child or young person is in immediate danger, contact the emergency services in your country.</Notice>
          </div>
          <div>
            <h2 className="mb-4 font-display text-2xl font-bold uppercase">Raise a concern</h2>
            <p className="text-mist mb-4 text-sm">Messages sent here go only to the safeguarding contact.</p>
            <GeneralEnquiryForm initialKey={randomUUID()} category="safeguarding" submitLabel="Send to safeguarding contact" />
          </div>
        </div>
      </Section>
    </>
  )
}
