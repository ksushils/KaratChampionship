import type { Metadata } from 'next'
import { getDrivers, getEngagements, getProgrammes } from '@/lib/data'
import { DriverCard } from '@/components/cards'
import { Breadcrumbs, EmptyState, PageHero, Section, buttonClass } from '@/components/ui'
import type { Driver, Programme } from '@/payload-types'

export const metadata: Metadata = { title: 'Drivers', description: 'Karat Racing drivers by programme and season.', alternates: { canonical: '/championship-team/drivers' } }

type P = { searchParams: Promise<{ programme?: string; season?: string }> }

export default async function Drivers({ searchParams }: P) {
  const sp = await searchParams
  const [drivers, engagements, programmes] = await Promise.all([getDrivers(), getEngagements(), getProgrammes()])
  const seasons = [...new Set(engagements.map((e) => e.season))].sort((a, b) => b - a)
  const filtered = engagements.filter(
    (e) => typeof e.driver === 'object' && (!sp.programme || (e.programme as Programme)?.slug === sp.programme) && (!sp.season || String(e.season) === sp.season),
  )
  const unassigned = !sp.programme && !sp.season ? drivers.filter((d) => !engagements.some((e) => (e.driver as Driver)?.id === d.id) && d.alumni === 'none') : []
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Drivers' }]} />
      <PageHero eyebrow="Championship Team" title="Drivers" intro="Announced drivers by programme and season. Racing numbers belong to a season, so a driver’s number can change from year to year." />
      <Section className="!pt-8">
        {/* DRV-02: GET filters work without JavaScript */}
        <form method="get" className="mb-8 flex flex-wrap items-end gap-3" aria-label="Filter drivers">
          <label className="grid gap-1 text-sm">
            Programme
            <select name="programme" defaultValue={sp.programme ?? ''} className="field-k min-w-48">
              <option value="">All programmes</option>
              {programmes.map((p) => (
                <option key={p.id} value={p.slug ?? ''}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Season
            <select name="season" defaultValue={sp.season ?? ''} className="field-k min-w-32">
              <option value="">All seasons</option>
              {seasons.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <button className={buttonClass('outline')}>Apply filters</button>
        </form>
        <p className="sr-only" aria-live="polite">
          {filtered.length} driver engagements shown
        </p>
        {filtered.length + unassigned.length === 0 ? (
          <EmptyState title="No drivers announced">Driver announcements will appear here once they are published.</EmptyState>
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((e) => (
              <li key={e.id}>
                <DriverCard d={e.driver as Driver} number={e.number} programme={`${(e.programme as Programme)?.title ?? ''} ${e.season}`} />
              </li>
            ))}
            {unassigned.map((d) => (
              <li key={d.id}>
                <DriverCard d={d} />
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}
