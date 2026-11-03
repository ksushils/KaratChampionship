import type { Metadata } from 'next'
import { getFaqs } from '@/lib/data'
import { FaqList } from '@/components/FaqList'
import { Breadcrumbs, ButtonLink, PageHero, Section, SectionHeading } from '@/components/ui'

export const metadata: Metadata = { title: 'FAQs', description: 'Frequently asked questions about Karat Racing programmes, driver enquiries, sponsorship and logistics.', alternates: { canonical: '/championship-team/faqs' } }

const CATS = [
  ['programmes', 'Programmes'],
  ['driver-enquiries', 'Driver enquiries'],
  ['sponsorship', 'Sponsorship'],
  ['logistics', 'Logistics'],
  ['general', 'General'],
] as const

export default async function Faqs() {
  const all = await getFaqs(CATS.map(([k]) => k))
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'FAQs' }]} />
      <PageHero eyebrow="Help" title="Frequently asked questions" />
      <Section>
        <nav aria-label="FAQ categories" className="mb-10 flex flex-wrap gap-2">
          {CATS.map(([k, l]) => (
            <a key={k} href={`#${k}`} className="inline-flex min-h-11 items-center rounded border border-white/15 px-4 hover:border-gold-400">{l}</a>
          ))}
        </nav>
        <div className="grid max-w-3xl gap-12">
          {CATS.map(([k, l]) => {
            const list = all.filter((f) => f.category === k)
            if (!list.length) return null
            return (
              <div key={k} id={k}>
                <SectionHeading title={l} />
                <FaqList faqs={list} />
              </div>
            )
          })}
        </div>
        <div className="mt-12">
          <ButtonLink href="/championship-team/contact" variant="outline">Ask us something else</ButtonLink>
        </div>
      </Section>
    </>
  )
}
