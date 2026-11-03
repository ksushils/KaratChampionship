import Link from 'next/link'
import type { Metadata } from 'next'
import type { Where } from 'payload'
import { getEvents, getProgrammes, getSettings } from '@/lib/data'
import { overlapping } from '@/lib/events'
import { EventRow } from '@/components/cards'
import { Breadcrumbs, EmptyState, Notice, PageHero, Section, buttonClass, cx } from '@/components/ui'
import type { Circuit, Event, Programme } from '@/payload-types'

export const metadata: Metadata = { title: 'Calendar', description: 'Karat Racing Championship Team calendar: race weekends, official tests and team events.', alternates: { canonical: '/championship-team/calendar' } }

type SP = { programme?: string; season?: string; country?: string; circuit?: string; type?: string; view?: string }

export default async function Calendar({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const [all, programmes, { flags }] = await Promise.all([getEvents(), getProgrammes(), getSettings()])
  const seasons = [...new Set(all.map((e) => e.season))].sort((a, b) => b - a)
  const countries = [...new Set(all.map((e) => (e.circuit as Circuit)?.country).filter(Boolean))] as string[]
  const circuits = [...new Map(all.map((e) => e.circuit as Circuit).filter(Boolean).map((c) => [c.slug, c])).values()]
  const events = all.filter(
    (e) =>
      (!sp.programme || (e.programme as Programme)?.slug === sp.programme) &&
      (!sp.season || String(e.season) === sp.season) &&
      (!sp.country || (e.circuit as Circuit)?.country === sp.country) &&
      (!sp.circuit || (e.circuit as Circuit)?.slug === sp.circuit) &&
      (!sp.type || e.type === sp.type),
  )
  const clashes = overlapping(events.filter((e) => e.status !== 'cancelled'))
  const view = sp.view === 'month' ? 'month' : 'list'
  const qs = (v: string) => `?${new URLSearchParams({ ...Object.fromEntries(Object.entries(sp).filter(([, x]) => x)), view: v }).toString()}`
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Calendar' }]} />
      <PageHero eyebrow="Race Centre" title="Calendar" intro="Race weekends, official tests and team events. Times are shown in the circuit’s local time, and every event can be added to your own calendar.">
        {flags.calendarFeed && (
          <a href="/championship-team/calendar/feed.ics" className={buttonClass('outline')} data-track="calendar_downloaded">
            Subscribe (iCal feed)
          </a>
        )}
      </PageHero>
      <Section className="!pt-8">
        <form method="get" className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:items-end" aria-label="Filter calendar">
          <Select name="programme" label="Programme" value={sp.programme} options={programmes.map((p) => [p.slug!, p.title])} />
          <Select name="season" label="Season" value={sp.season} options={seasons.map((s) => [String(s), String(s)])} />
          <Select name="country" label="Country" value={sp.country} options={countries.map((c) => [c, c])} />
          <Select name="circuit" label="Circuit" value={sp.circuit} options={circuits.map((c) => [c.slug!, c.name])} />
          <Select name="type" label="Event type" value={sp.type} options={[['race-weekend', 'Race weekend'], ['official-test', 'Official test'], ['launch', 'Launch'], ['team-event', 'Team event']]} />
          <input type="hidden" name="view" value={view} />
          <button className={buttonClass('outline')}>Apply</button>
        </form>
        <div className="mb-6 flex gap-2" role="group" aria-label="Calendar view">
          <Link href={qs('list')} aria-current={view === 'list' ? 'page' : undefined} className={cx('inline-flex min-h-11 items-center rounded border px-4', view === 'list' ? 'border-gold-400 text-gold-200' : 'border-white/15')}>
            List
          </Link>
          <Link href={qs('month')} aria-current={view === 'month' ? 'page' : undefined} className={cx('inline-flex min-h-11 items-center rounded border px-4', view === 'month' ? 'border-gold-400 text-gold-200' : 'border-white/15')}>
            Month
          </Link>
        </div>
        <Notice tone="blue">This calendar covers Championship Team events only. Testing days are arranged separately by the Testing & Karat Academy business.</Notice>
        {clashes.length > 0 && (
          <p className="text-mist mt-4 text-sm">
            <span aria-hidden="true">⇄ </span>
            Some weekends overlap across programmes: {clashes.map((g) => g.map((e) => e.title).join(' and ')).join('; ')}.
          </p>
        )}
        <div className="mt-6">
          {events.length === 0 ? (
            <EmptyState title="No events match">No published events match these filters. Calendars are published once they have been checked against official sources.</EmptyState>
          ) : view === 'month' ? (
            <MonthView events={events} />
          ) : (
            <ul>{events.map((e) => <EventRow key={e.id} e={e} />)}</ul>
          )}
        </div>
      </Section>
    </>
  )
}

function Select({ name, label, value, options }: { name: string; label: string; value?: string; options: (string | null)[][] }) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <select name={name} defaultValue={value ?? ''} className="field-k">
        <option value="">All</option>
        {options.map(([v, l]) => (
          <option key={v} value={v ?? ''}>
            {l}
          </option>
        ))}
      </select>
    </label>
  )
}

/** CAL-03: month grid on wide screens; a grouped list on small screens (usable mobile alternative). */
function MonthView({ events }: { events: Event[] }) {
  const months = new Map<string, Event[]>()
  for (const e of events) {
    const k = e.startDate.slice(0, 7)
    months.set(k, [...(months.get(k) ?? []), e])
  }
  return (
    <div className="grid gap-10">
      {[...months.entries()].map(([k, list]) => {
        const [y, m] = k.split('-').map(Number)
        const first = new Date(Date.UTC(y, m - 1, 1))
        const days = new Date(Date.UTC(y, m, 0)).getUTCDate()
        const offset = (first.getUTCDay() + 6) % 7
        const label = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(first)
        return (
          <section key={k} aria-label={label}>
            <h2 className="mb-3 font-display text-2xl font-bold uppercase">{label}</h2>
            <ul className="md:hidden">{list.map((e) => <EventRow key={e.id} e={e} />)}</ul>
            <div className="hidden md:block">
              <div className="grid grid-cols-7 gap-px overflow-hidden rounded-card border border-white/10 bg-white/10" aria-hidden="true">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <div key={d} className="bg-ink-900 p-2 text-center text-xs uppercase tracking-wider text-gold-300">{d}</div>
                ))}
                {Array.from({ length: offset }).map((_, i) => <div key={`o${i}`} className="min-h-24 bg-night" />)}
                {Array.from({ length: days }).map((_, i) => {
                  const day = i + 1
                  const iso = `${k}-${String(day).padStart(2, '0')}`
                  const todays = list.filter((e) => e.startDate.slice(0, 10) <= iso && (e.endDate ?? e.startDate).slice(0, 10) >= iso)
                  return (
                    <div key={day} className="min-h-24 bg-night p-1.5">
                      <span className="text-mist text-xs">{day}</span>
                      {todays.map((e) => (
                        <Link key={e.id} href={`/championship-team/events/${e.slug}`} tabIndex={-1} className={cx('mt-1 block truncate rounded px-1.5 py-0.5 text-[0.7rem]', e.status === 'cancelled' ? 'bg-danger/20 line-through' : 'bg-royal-500/40')}>
                          {e.title}
                        </Link>
                      ))}
                    </div>
                  )
                })}
              </div>
              <ul className="sr-only">{list.map((e) => <EventRow key={e.id} e={e} />)}</ul>
            </div>
          </section>
        )
      })}
    </div>
  )
}
