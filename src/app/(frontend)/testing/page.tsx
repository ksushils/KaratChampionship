import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDivision, getFaqs } from '@/lib/data'
import { DIVISION_STATUS_LABEL } from '@/lib/status'
import { FaqList } from '@/components/FaqList'
import { ButtonLink, Card, Notice, Section, SectionHeading, StatusBadge } from '@/components/ui'

export const metadata: Metadata = { title: 'Testing & Karat Academy', description: 'Karat Racing’s proposed testing and driver-development business using Karat-operated and partner-provided single-seaters.', alternates: { canonical: '/testing' } }

export default async function Testing() {
  const [d, faqs] = await Promise.all([getDivision('testing'), getFaqs('testing')])
  if (d && d.enabled === false) notFound()
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10" aria-labelledby="t-title">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(60,200,255,0.15),transparent_55%)]" />
        <div className="container-k relative grid gap-10 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-3">Karat Racing · Testing &amp; Karat Academy</p>
            <h1 id="t-title" className="font-display text-[length:var(--text-display-xl)] font-extrabold uppercase leading-[0.95]">
              Develop your <span className="text-gold-metal">performance</span>
            </h1>
            <StatusBadge status={d?.status} label={DIVISION_STATUS_LABEL[d?.status ?? 'planned']} className="mt-5" />
            <p className="text-mist mt-5 max-w-xl text-lg">{d?.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/testing/enquire">Make a testing enquiry</ButtonLink>
              <ButtonLink href="/championship-team" variant="outline">Championship Team</ButtonLink>
            </div>
          </div>
          <Image src="/brand/car-aerial-dark.jpg" alt="Karat Racing livery concept seen from above" width={940} height={300} priority className="h-auto w-full rounded-card" />
        </div>
      </section>
      <Section labelledBy="t-what">
        <SectionHeading id="t-what" eyebrow="The proposition" title="What testing could include" intro="Below are the kinds of request we expect to handle. Exact services, cars, venues and dates will be confirmed for each enquiry." />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ['First single-seater experience', 'For karters trying a race car for the first time in a controlled programme.'],
            ['Pre-season preparation', 'Track time and set-up work before a championship season starts.'],
            ['Category familiarisation', 'Getting used to a different car generation or category.'],
            ['Structured development', 'Coached, data-led days with clear goals for each session.'],
          ].map(([t, b]) => (
            <li key={t}>
              <Card className="h-full">
                <h3 className="font-display text-lg font-bold uppercase text-gold-200">{t}</h3>
                <p className="text-mist mt-2 text-sm">{b}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
      <Section paper labelledBy="t-cars">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <SectionHeading id="t-cars" eyebrow="Cars" title="Owned and partner cars" />
            <p className="text-mist">Testing may use cars owned or operated by Karat Racing, or cars provided by partners. Each proposal will say clearly whose car it is and who runs it.</p>
          </div>
          <div className="grid content-start gap-3">
            <Notice tone="blue" title="Not available yet">We do not take online bookings, publish test prices, show live car availability or take deposits. Circuit access and eligibility are confirmed for each test.</Notice>
            <Notice tone="warn" title="Safety">Motorsport testing is dangerous. Every participant must meet the eligibility, licensing and safety requirements for the car and the circuit.</Notice>
          </div>
        </div>
      </Section>
      <Section labelledBy="t-dev">
        <SectionHeading id="t-dev" eyebrow="Connection" title="Testing and racing" intro="Testing is a separate service from a race season. Some drivers go on to a Championship Team programme, but a test does not commit you to one, and it does not guarantee a race seat." />
        <ButtonLink href="/championship-team/driver-development" variant="outline">How we approach driver development</ButtonLink>
        {faqs.length > 0 && <div className="mt-10 max-w-3xl"><FaqList faqs={faqs} /></div>}
      </Section>
    </>
  )
}
