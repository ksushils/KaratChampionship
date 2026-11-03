import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEvent, getResultSets, getSessionsFor, getSettings } from '@/lib/data'
import { eventPhase } from '@/lib/events'
import { EVENT_STATUS_LABEL } from '@/lib/status'
import { formatDateRange } from '@/lib/time'
import { ArticleCard, mediaOf } from '@/components/cards'
import { SessionTime, TimeModeProvider } from '@/components/LocalTime'
import { ResultsTable } from '@/components/ResultsTable'
import { Breadcrumbs, ButtonLink, Card, EmptyState, ExternalLink, JsonLd, Notice, Section, SectionHeading, StatusBadge } from '@/components/ui'
import type { Article, Circuit, Driver, MediaCollection, Programme } from '@/payload-types'

type P = { params: Promise<{ event: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const e = await getEvent((await params).event)
  if (!e) return { title: 'Event not found' }
  return { title: e.title, description: e.summary ?? `${e.title} — timetable, drivers, results and media.`, alternates: { canonical: `/championship-team/events/${e.slug}` } }
}

export default async function EventPage({ params }: P) {
  const e = await getEvent((await params).event)
  if (!e) notFound()
  const [sessions, results, { flags }] = await Promise.all([getSessionsFor([e.id]), getResultSets({ event: { equals: e.id } }), getSettings()])
  const circuit = e.circuit as Circuit | null
  const programme = e.programme as Programme | null
  const tz = e.timeZone || circuit?.timeZone || 'UTC'
  const phase = eventPhase(e)
  const drivers = (e.driversEntered ?? []).filter((d): d is Driver => typeof d === 'object')
  const links = e.officialLinks ?? {}
  const gallery = typeof e.gallery === 'object' ? (e.gallery as MediaCollection | null) : null
  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const lastUpdate = [e.revisedAt, e.updatedAt, ...sessions.map((s) => s.updatedAt)].filter(Boolean).sort().pop()

  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Calendar', href: '/championship-team/calendar' }, { label: e.title }]} />
      <section className="border-b border-white/10 bg-ink-900">
        <div className="container-k py-12">
          <p className="eyebrow mb-3">
            {[programme?.title, `Season ${e.season}`, e.round && `Round ${e.round}`].filter(Boolean).join(' · ')}
          </p>
          <h1 className="font-display text-[length:var(--text-display-lg)] font-bold uppercase">{e.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge status={e.status} label={EVENT_STATUS_LABEL[e.status]} />
            {phase === 'race-weekend' && <StatusBadge tone="gold" label="Race weekend in progress" />}
            {e.isDemo && <StatusBadge tone="warn" label="Demo fixture — fictional" />}
          </div>
          <p className="mt-4 text-lg">
            <time dateTime={e.startDate}>{formatDateRange(e.startDate, e.endDate)}</time>
            {circuit && (
              <>
                {' '}
                · {circuit.name}
                {e.layout && ` (${e.layout})`}, {circuit.country}
              </>
            )}
          </p>
          {e.changeNote && (
            <div className="mt-5 max-w-2xl">
              <Notice tone="warn" title="Update">
                {e.changeNote}
              </Notice>
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`/championship-team/events/${e.slug}/ics`} className="inline-flex min-h-11 items-center rounded border border-gold-400/70 px-4 font-display text-sm font-semibold uppercase tracking-[0.08em] text-gold-200 hover:bg-gold-400/10" data-track="calendar_downloaded">
              Add to calendar (.ics)
            </a>
            {flags.hospitalityEnquiries && phase === 'upcoming' && (
              <ButtonLink href={`/championship-team/hospitality?event=${e.slug}`} variant="ghost">
                Hospitality enquiry →
              </ButtonLink>
            )}
          </div>
          {lastUpdate && <p className="text-mist mt-4 text-xs">Timetable last updated {new Date(lastUpdate).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC</p>}
        </div>
      </section>

      <Section labelledBy="timetable">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <SectionHeading id="timetable" eyebrow="Timetable" title="Sessions" intro={`Times are shown in circuit local time (${tz}) unless you switch.`} />
            {sessions.length ? (
              <TimeModeProvider allowViewer={Boolean(flags.viewerLocalTime)}>
                <div className="overflow-x-auto" role="region" aria-labelledby="timetable" tabIndex={0}>
                  <table className="table-k">
                    <caption className="sr-only">Session timetable for {e.title}</caption>
                    <thead>
                      <tr>
                        <th scope="col">Session</th>
                        <th scope="col">Group</th>
                        <th scope="col">Start</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((s) => (
                        <tr key={s.id}>
                          <th scope="row" className="!font-sans !text-[0.92rem] !normal-case !tracking-normal !text-white">
                            {s.name}
                          </th>
                          <td>{s.group ?? '—'}</td>
                          <td>
                            <SessionTime iso={s.startsAt} circuitTz={tz} certainty={s.certainty} />
                          </td>
                          <td className="capitalize">{s.status === 'scheduled' ? (s.certainty === 'confirmed' ? 'Confirmed' : s.certainty === 'tbc' ? 'TBC' : 'Provisional') : s.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TimeModeProvider>
            ) : (
              <EmptyState title="Timetable not yet published">Session times are published once the organiser releases the official timetable.</EmptyState>
            )}
          </div>
          <aside className="grid content-start gap-5">
            {circuit && (
              <Card>
                <h2 className="eyebrow mb-2">Circuit</h2>
                <p className="font-display text-xl font-bold uppercase">{circuit.name}</p>
                <p className="text-mist text-sm">{[circuit.locality, circuit.country].filter(Boolean).join(', ')}</p>
                {circuit.layouts?.find((l) => l.name === e.layout)?.lengthKm && <p className="mt-2 text-sm">Lap length: {circuit.layouts.find((l) => l.name === e.layout)!.lengthKm} km</p>}
                {circuit.description && <p className="text-mist mt-2 text-sm">{circuit.description}</p>}
                {(() => {
                  const diagram = mediaOf(circuit.layouts?.find((l) => l.name === e.layout)?.diagram ?? circuit.layouts?.[0]?.diagram)
                  return diagram?.url ? <Image src={diagram.url} alt={diagram.alt ?? `${circuit.name} layout`} width={400} height={300} className="mt-3 h-auto w-full rounded bg-white p-2" /> : null
                })()}
              </Card>
            )}
            {(links.liveTiming || links.stream || links.results || links.noticeboard || links.tickets) && (
              <Card>
                <h2 className="eyebrow mb-2">Official links</h2>
                <ul className="grid gap-2 text-sm">
                  {links.liveTiming && <li><ExternalLink href={links.liveTiming} onClickEvent="official_timing_clicked">Official live timing</ExternalLink></li>}
                  {links.stream && <li><ExternalLink href={links.stream} onClickEvent="official_stream_clicked">Official stream</ExternalLink></li>}
                  {links.results && <li><ExternalLink href={links.results}>Official results</ExternalLink></li>}
                  {links.noticeboard && <li><ExternalLink href={links.noticeboard}>Official noticeboard</ExternalLink></li>}
                  {links.tickets && <li><ExternalLink href={links.tickets}>Tickets &amp; visitor information (organiser)</ExternalLink></li>}
                </ul>
                <p className="text-mist mt-3 text-xs">Admission, tickets and paddock access are controlled by the event organiser.</p>
              </Card>
            )}
          </aside>
        </div>
      </Section>

      {drivers.length > 0 && (
        <Section labelledBy="entered" className="!pt-0">
          <SectionHeading id="entered" eyebrow="Entry" title="Karat drivers entered" />
          <ul className="flex flex-wrap gap-3">
            {drivers.map((d) => (
              <li key={d.id}>
                <Link href={`/championship-team/drivers/${d.slug}`} className="inline-flex min-h-11 items-center rounded border border-white/15 px-4 hover:border-gold-400">
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(typeof e.preview === 'object' && e.preview) || (typeof e.report === 'object' && e.report) ? (
        <Section labelledBy="editorial" className="!pt-0">
          <SectionHeading id="editorial" eyebrow="Editorial" title="Preview &amp; report" />
          <ul className="grid gap-5 md:grid-cols-2">
            {[e.preview, e.report].filter((a): a is Article => Boolean(a && typeof a === 'object')).map((a) => (
              <li key={a.id}>
                <ArticleCard a={a} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {results.length > 0 && (
        <Section labelledBy="ev-results" className="!pt-0">
          <SectionHeading id="ev-results" eyebrow="Results" title="Session results" />
          {results.map((r) => (
            <ResultsTable key={r.id} rs={r} />
          ))}
        </Section>
      )}

      {gallery && (
        <Section className="!pt-0">
          <Link className="text-royal-300 underline" href={`/championship-team/media/${gallery.slug}`}>
            View the {gallery.title} gallery
          </Link>
        </Section>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SportsEvent',
          name: e.title,
          startDate: e.startDate.slice(0, 10),
          endDate: (e.endDate ?? e.startDate).slice(0, 10),
          eventStatus: e.status === 'cancelled' ? 'https://schema.org/EventCancelled' : e.status === 'postponed' ? 'https://schema.org/EventPostponed' : 'https://schema.org/EventScheduled',
          location: circuit ? { '@type': 'Place', name: circuit.name, address: circuit.country } : undefined,
          url: `${base}/championship-team/events/${e.slug}`,
        }}
      />
    </>
  )
}
