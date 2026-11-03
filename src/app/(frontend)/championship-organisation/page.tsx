import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDivision, getFaqs } from '@/lib/data'
import { DIVISION_STATUS_LABEL } from '@/lib/status'
import { FaqList } from '@/components/FaqList'
import { ButtonLink, Card, Notice, Section, SectionHeading, StatusBadge } from '@/components/ui'

export const metadata: Metadata = { title: 'Championship Series — India', description: 'Karat Racing’s ambition to develop and operate a new motorsport championship in India. Planning stage; enquiries welcome.', alternates: { canonical: '/championship-organisation' } }

const STAGES = [
  ['Planning', 'Defining the concept, category and partners.'],
  ['Consultation', 'Talking to circuits, authorities, suppliers and potential participants.'],
  ['Approvals', 'Any sporting or regulatory approvals that are required.'],
  ['Announcement', 'Publishing confirmed details: name, calendar and regulations.'],
]

export default async function Organisation() {
  const [d, faqs] = await Promise.all([getDivision('championship-organisation'), getFaqs('championship-organisation')])
  if (d && d.enabled === false) notFound()
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10" aria-labelledby="o-title">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(220,179,92,0.16),transparent_55%)]" />
        <div className="container-k relative grid gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow mb-3">Karat Racing · Championship Series</p>
            <h1 id="o-title" className="font-display text-[length:var(--text-display-xl)] font-extrabold uppercase leading-[0.95]">
              Building racing in <span className="text-gold-metal">India</span>
            </h1>
            <StatusBadge status={d?.status} label={`Project stage: ${DIVISION_STATUS_LABEL[d?.status ?? 'planned']}`} className="mt-5" />
            <p className="text-mist mt-5 max-w-xl text-lg">{d?.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/championship-organisation/enquire">Get in touch</ButtonLink>
            </div>
          </div>
          <Image src="/brand/car-top-light.jpg" alt="Karat livery concept, top view" width={525} height={535} priority className="mx-auto h-auto w-full max-w-sm rounded-card" />
        </div>
      </section>
      <Section className="!pb-0">
        <Notice tone="blue" title="Separate from the team">
          This project is separate from Karat Racing’s team activity. It is not connected to the existing Indian F4 championship, and Karat Racing does not own or operate Indian F4. Information about the team’s own interest in Indian F4 is on the{' '}
          <Link className="underline" href="/championship-team/programmes/indian-f4">Indian F4 programme page</Link>.
        </Notice>
      </Section>
      <Section labelledBy="o-stages">
        <SectionHeading id="o-stages" eyebrow="Roadmap" title="Project stages" intro="Nothing is announced until it is confirmed. There is no championship name, calendar, venue list, regulations or approval to announce yet." />
        <ol className="grid gap-4 md:grid-cols-4">
          {STAGES.map(([t, b], i) => (
            <li key={t}>
              <Card className="h-full">
                <span className="font-display text-4xl font-extrabold text-gold-500">0{i + 1}</span>
                <h3 className="mt-1 font-display text-lg font-bold uppercase">{t}</h3>
                <p className="text-mist mt-1 text-sm">{b}</p>
                {i === 0 && <StatusBadge tone="gold" label="Current stage" className="mt-3" />}
              </Card>
            </li>
          ))}
        </ol>
      </Section>
      <Section paper labelledBy="o-who">
        <SectionHeading id="o-who" eyebrow="Get involved" title="Who we would like to hear from" />
        <ul className="grid gap-3 md:grid-cols-5">
          {['Potential participants', 'Circuits', 'Sponsors', 'Suppliers', 'Authorities & federations'].map((x) => (
            <li key={x} className="rounded-card border border-navy-800/15 bg-white/70 p-4 font-semibold">{x}</li>
          ))}
        </ul>
        <ButtonLink href="/championship-organisation/enquire" className="mt-8">Make an enquiry</ButtonLink>
      </Section>
      {faqs.length > 0 && (
        <Section>
          <div className="max-w-3xl"><FaqList faqs={faqs} /></div>
        </Section>
      )}
    </>
  )
}
