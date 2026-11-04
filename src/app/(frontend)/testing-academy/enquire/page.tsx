import type { Metadata } from 'next'
import { randomUUID } from 'node:crypto'
import { getProgramme } from '@/lib/data'
import { GeneralEnquiryForm } from '@/components/forms'
import { Breadcrumbs, Notice, PageHero, Section } from '@/components/ui'

export const metadata: Metadata = { title: 'Testing enquiry', description: 'Make a testing or driver-development enquiry with Karat Racing.', alternates: { canonical: '/testing-academy/enquire' } }

export default async function TestingEnquire({ searchParams }: { searchParams: Promise<{ programme?: string; from?: string }> }) {
  const sp = await searchParams
  // CHAMP-20: programme context is handed off from Championship Team pages.
  const p = sp.programme ? await getProgramme(sp.programme) : null
  return (
    <>
      <Breadcrumbs items={[{ label: 'Testing & Karat Academy', href: '/testing-academy' }, { label: 'Enquire' }]} />
      <PageHero eyebrow="Testing & Karat Academy" title="Testing enquiry" intro="Tell us what you want from a test. We will reply with what is possible. This is an enquiry, not a booking." />
      <Section className="!pt-8">
        <div className="grid max-w-3xl gap-6">
          {p && <Notice tone="blue">You came from the <strong>{p.title}</strong> programme page. We have added it to your enquiry.</Notice>}
          <GeneralEnquiryForm
            initialKey={randomUUID()}
            category="testing"
            defaults={p ? { programme: p.title } : undefined}
            topics={[
              { value: 'first-experience', label: 'First single-seater experience' },
              { value: 'pre-season', label: 'Pre-season preparation' },
              { value: 'familiarisation', label: 'Category familiarisation' },
              { value: 'development', label: 'Structured development programme' },
              { value: 'other', label: 'Something else' },
            ]}
            submitLabel="Send testing enquiry"
          />
        </div>
      </Section>
    </>
  )
}
