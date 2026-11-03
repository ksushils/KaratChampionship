import Image from 'next/image'
import type { Metadata } from 'next'
import { randomUUID } from 'node:crypto'
import { getFaqs, getSettings } from '@/lib/data'
import { mediaOf } from '@/components/cards'
import { FaqList } from '@/components/FaqList'
import { PartnershipEnquiryForm } from '@/components/forms'
import { Breadcrumbs, Card, Notice, PageHero, Section, SectionHeading, buttonClass } from '@/components/ui'

export const metadata: Metadata = { title: 'Partner with us', description: 'Partnership opportunities with Karat Racing: livery, clothing, digital content, events, hospitality, technical collaboration and driver development.', alternates: { canonical: '/championship-team/partner-with-us' } }

const THEMES = [
  ['Livery', 'Brand placement on the race car, positioned around your objectives and the championship’s rules.'],
  ['Team clothing', 'Placement on team kit worn at events and in content.'],
  ['Digital content', 'Stories, behind-the-scenes footage and campaigns produced with the team.'],
  ['Events', 'Car displays, launches and appearances, subject to availability.'],
  ['Hospitality', 'Race-weekend experiences for clients and colleagues, within organiser permissions.'],
  ['Technical collaboration', 'Product or engineering partnerships suited to a racing environment.'],
  ['Driver development', 'Support for young drivers and their progress.'],
]

const POSITIONS = [
  ['1', 'Engine cover / airbox side', 'Primary side-on visibility'],
  ['2 & 3', 'Front wing endplates', 'Front-on and onboard visibility'],
  ['4', 'Sidepod & nose', 'Side and front visibility'],
  ['5', 'Rear wing & front wing mainplane', 'Rear and side visibility'],
  ['6 & 7', 'Rear wing endplates', 'Rear-on visibility'],
  ['8', 'Cockpit surround', 'Onboard and side visibility'],
  ['9', 'Roll hoop / airbox top', 'Overhead and onboard visibility'],
]

export default async function PartnerWithUs() {
  const [{ team }, faqs] = await Promise.all([getSettings(), getFaqs('sponsorship')])
  const deck = mediaOf(team.commercialDeck)
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Partner with us' }]} />
      <PageHero eyebrow="Partnerships" title="Partner with Karat" intro="Partnerships built around what you want to achieve, whether that is brand visibility, business relationships, content or supporting young drivers." image="/brand/car-side-light.jpg">
        <a href="#enquire" className={buttonClass('gold')}>
          Start a conversation
        </a>
        {deck?.url && (
          <a href={deck.url} className={buttonClass('outline')} download data-track="media_downloaded">
            Download commercial overview{team.commercialDeckVersion ? ` (v${team.commercialDeckVersion})` : ''}
          </a>
        )}
      </PageHero>
      <Section labelledBy="themes">
        <SectionHeading id="themes" eyebrow="Opportunities" title="Partnership themes" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {THEMES.map(([t, b]) => (
            <li key={t}>
              <Card className="h-full">
                <h3 className="font-display text-lg font-bold uppercase text-gold-200">{t}</h3>
                <p className="text-mist mt-2 text-sm">{b}</p>
              </Card>
            </li>
          ))}
        </ul>
        <p className="text-mist mt-6 text-sm">All opportunities depend on availability, championship regulations, rights and a written agreement.</p>
      </Section>
      <Section paper labelledBy="livery">
        <SectionHeading id="livery" eyebrow="Livery inventory" title="Branding positions" intro="Indicative positions on the Karat livery concept. Exact sizes and availability vary by championship and season." />
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <figure>
            <Image src="/brand/livery-placements.jpg" alt="Karat livery concept with numbered branding positions 1 to 9 marked on side, front, top and rear views" width={1024} height={672} sizes="(min-width: 1024px) 60vw, 100vw" className="h-auto w-full rounded-card shadow-xl" />
            <figcaption className="text-mist mt-2 text-xs">Positions marked on the livery concept.</figcaption>
          </figure>
          <table className="table-k [&_td]:border-navy-800/10 [&_th]:!text-gold-700">
            <caption className="sr-only">Livery branding positions</caption>
            <thead>
              <tr>
                <th scope="col">Position</th>
                <th scope="col">Location</th>
                <th scope="col">Visibility</th>
              </tr>
            </thead>
            <tbody>
              {POSITIONS.map(([n, l, v]) => (
                <tr key={n}>
                  <th scope="row" className="!font-display !text-lg !text-navy-800">{n}</th>
                  <td>{l}</td>
                  <td className="text-mist">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      {(team.audienceMetrics?.length ?? 0) > 0 && (
        <Section labelledBy="audience">
          <SectionHeading id="audience" eyebrow="Audience" title="Reach" />
          <ul className="grid gap-4 md:grid-cols-4">
            {team.audienceMetrics!.map((m) => (
              <li key={m.id} className="rounded-card border border-white/10 p-5">
                <p className="font-display text-4xl font-extrabold text-gold-200">{m.value}</p>
                <p className="font-semibold">{m.label}</p>
                <p className="text-mist text-xs">{m.scope} · {m.period}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}
      <Section labelledBy="enquire" id="enquire">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading id="enquire-h" eyebrow="Enquire" title="Partnership enquiry" />
            <PartnershipEnquiryForm initialKey={randomUUID()} />
          </div>
          <div className="grid content-start gap-6">
            <Notice tone="blue">We never show prospective partners’ logos publicly without written approval.</Notice>
            {faqs.length > 0 && (
              <div>
                <h2 className="eyebrow mb-3">Questions</h2>
                <FaqList faqs={faqs} />
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  )
}
