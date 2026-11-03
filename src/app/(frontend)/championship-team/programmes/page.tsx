import type { Metadata } from 'next'
import { getProgrammes } from '@/lib/data'
import { PROGRAMME_STATUS_LABEL, SEAT_LABEL } from '@/lib/status'
import { ProgrammeCard } from '@/components/cards'
import { Breadcrumbs, ButtonLink, PageHero, Section, SectionHeading, StatusBadge } from '@/components/ui'
import type { Championship } from '@/payload-types'

export const metadata: Metadata = { title: 'Programmes', description: 'Compare Karat Racing’s intended single-seater programmes: Italian F4, GB4, Indian F4 and Formula X / F2000.', alternates: { canonical: '/championship-team/programmes' } }

export default async function ProgrammesPage() {
  const all = await getProgrammes()
  const active = all.filter((p) => !['future', 'archived'].includes(p.status))
  const future = all.filter((p) => p.status === 'future')
  const archived = all.filter((p) => p.status === 'archived')
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Programmes' }]} />
      <PageHero eyebrow="Championship Team" title="Programmes" intro="Racing categories Karat Racing intends to enter. The status shown on each programme is the current position. Entries are confirmed only with the championship.">
        <ButtonLink href="/championship-team/race-with-us">Discuss a programme</ButtonLink>
      </PageHero>
      <Section>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {active.map((p) => (
            <li key={p.id}>
              <ProgrammeCard p={p} headingLevel="h2" />
            </li>
          ))}
        </ul>
      </Section>

      {/* PROG-03/PROG-10: stacked comparison, readable on mobile, a real table on desktop */}
      <Section paper labelledBy="compare">
        <SectionHeading id="compare" eyebrow="Compare" title="Programme comparison" />
        <div className="hidden overflow-x-auto lg:block" role="region" aria-labelledby="compare" tabIndex={0}>
          <table className="table-k [&_td]:border-navy-800/10 [&_th]:!text-gold-700">
            <caption className="sr-only">Comparison of Karat Racing programmes by status, geography, development purpose, support and enquiry route</caption>
            <thead>
              <tr>
                <th scope="col">Programme</th>
                <th scope="col">Status</th>
                <th scope="col">Geography</th>
                <th scope="col">Development purpose</th>
                <th scope="col">Support</th>
                <th scope="col">Seats</th>
                <th scope="col">Enquire</th>
              </tr>
            </thead>
            <tbody>
              {active.map((p) => (
                <tr key={p.id}>
                  <th scope="row" className="!font-display !text-base !text-navy-800">
                    {p.title}
                  </th>
                  <td>{PROGRAMME_STATUS_LABEL[p.status]}</td>
                  <td>{p.comparison?.geography ?? '—'}</td>
                  <td>{p.comparison?.developmentPurpose ?? '—'}</td>
                  <td>{p.comparison?.support ?? '—'}</td>
                  <td>{SEAT_LABEL[p.seatAvailability ?? 'not-published']}</td>
                  <td>
                    <a className="font-semibold text-royal-600 underline" href={`/championship-team/race-with-us?programme=${p.slug}`}>
                      Enquire<span className="sr-only"> about {p.title}</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="grid gap-4 lg:hidden">
          {active.map((p) => (
            <li key={p.id} className="rounded-card border border-navy-800/15 bg-white/60 p-5">
              <h3 className="font-display text-xl font-bold uppercase">{p.title}</h3>
              <dl className="mt-3 grid gap-2 text-sm">
                {[
                  ['Status', PROGRAMME_STATUS_LABEL[p.status]],
                  ['Geography', p.comparison?.geography],
                  ['Development purpose', p.comparison?.developmentPurpose],
                  ['Support', p.comparison?.support],
                  ['Seats', SEAT_LABEL[p.seatAvailability ?? 'not-published']],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[9rem_1fr] gap-2">
                    <dt className="font-semibold">{k}</dt>
                    <dd>{v ?? '—'}</dd>
                  </div>
                ))}
              </dl>
              <a className="mt-3 inline-block font-semibold text-royal-600 underline" href={`/championship-team/race-with-us?programme=${p.slug}`}>
                Enquire about {p.title}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-mist mt-6 text-sm">Costs, eligibility, machinery and calendars are published only once confirmed from official sources.</p>
      </Section>

      {future.length > 0 && (
        <Section labelledBy="future">
          <SectionHeading id="future" eyebrow="Ambition" title="Future categories" intro="These are long-term ambitions. They are not entries, applications or confirmed plans." />
          <ul className="grid gap-4 md:grid-cols-2">
            {future.map((p) => (
              <li key={p.id} className="rounded-card border border-white/10 p-5">
                <StatusBadge status="future" label={PROGRAMME_STATUS_LABEL.future} />
                <h3 className="mt-2 font-display text-xl font-bold uppercase">{p.title}</h3>
                <p className="text-mist mt-1 text-sm">{p.shortDescription}</p>
                {(p.championship as Championship)?.officialUrl && (
                  <a className="mt-2 inline-block text-sm text-royal-300 underline" href={(p.championship as Championship).officialUrl!} target="_blank" rel="noopener noreferrer">
                    Official championship site<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}
      {archived.length > 0 && (
        <Section labelledBy="archived">
          <SectionHeading id="archived" eyebrow="Archive" title="Previous programmes" />
          <ul className="grid gap-5 md:grid-cols-3">
            {archived.map((p) => (
              <li key={p.id}>
                <ProgrammeCard p={p} />
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}
