import type { Metadata } from 'next'
import type { Where } from 'payload'
import { getEvents, getProgrammes, getResultSets } from '@/lib/data'
import { ResultsTable } from '@/components/ResultsTable'
import { Breadcrumbs, EmptyState, PageHero, Section, buttonClass } from '@/components/ui'

export const metadata: Metadata = { title: 'Results', description: 'Verified Karat Racing results by championship, season, event and session.', alternates: { canonical: '/championship-team/results' } }

type SP = { programme?: string; season?: string; event?: string; classification?: string }

export default async function Results({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const [programmes, events] = await Promise.all([getProgrammes(), getEvents()])
  const and: Where[] = [{ attribution: { equals: 'karat' } }]
  const prog = programmes.find((p) => p.slug === sp.programme)
  if (prog) and.push({ programme: { equals: prog.id } })
  if (sp.season && /^\d{4}$/.test(sp.season)) and.push({ season: { equals: Number(sp.season) } })
  const ev = events.find((e) => e.slug === sp.event)
  if (ev) and.push({ event: { equals: ev.id } })
  if (sp.classification) and.push({ classification: { equals: sp.classification } })
  const sets = await getResultSets({ and })
  const seasons = [...new Set(events.map((e) => e.season))].sort((a, b) => b - a)
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Results' }]} />
      <PageHero eyebrow="Race Centre" title="Results" intro="Only verified results from official sources are shown. Each classification is marked provisional or final. Values that have not been published are shown as a dash, never as zero." />
      <Section className="!pt-8">
        <form method="get" className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end" aria-label="Filter results">
          <label className="grid gap-1 text-sm">
            Programme
            <select name="programme" defaultValue={sp.programme ?? ''} className="field-k">
              <option value="">All</option>
              {programmes.map((p) => <option key={p.id} value={p.slug!}>{p.title}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Season
            <select name="season" defaultValue={sp.season ?? ''} className="field-k">
              <option value="">All</option>
              {seasons.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Event
            <select name="event" defaultValue={sp.event ?? ''} className="field-k">
              <option value="">All</option>
              {events.map((e) => <option key={e.id} value={e.slug!}>{e.title}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Classification
            <select name="classification" defaultValue={sp.classification ?? ''} className="field-k">
              <option value="">All</option>
              <option value="overall">Overall</option>
              <option value="rookie">Rookie</option>
            </select>
          </label>
          <button className={buttonClass('outline')}>Apply</button>
        </form>
        {sets.length ? sets.map((r) => <ResultsTable key={r.id} rs={r} />) : <EmptyState title="No verified results">Results appear here after they have been checked against the official classification.</EmptyState>}
      </Section>
    </>
  )
}
