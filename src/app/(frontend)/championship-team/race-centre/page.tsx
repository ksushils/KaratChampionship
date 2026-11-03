import Link from 'next/link'
import type { Metadata } from 'next'
import { getEvents, getResultSets, getSessionsFor, getSettings, publicFind } from '@/lib/data'
import { countdownTarget, currentEvents, nextEvent, raceCentreState, type RaceCentreState } from '@/lib/events'
import { formatDateRange, formatInZone } from '@/lib/time'
import { ConsentEmbed } from '@/components/ConsentEmbed'
import { Countdown } from '@/components/Countdown'
import { ResultsTable } from '@/components/ResultsTable'
import { Breadcrumbs, ButtonLink, Card, EmptyState, ExternalLink, PageHero, Section, StatusBadge } from '@/components/ui'
import type { Circuit, Event, LiveUpdate, Programme, Session } from '@/payload-types'

export const metadata: Metadata = { title: 'Race Centre', description: 'Karat Racing Race Centre: current race weekends, timetables, official timing links and verified results.', alternates: { canonical: '/championship-team/race-centre' } }

const STATE_LABEL: Record<RaceCentreState, string> = {
  'off-season': 'Off-season',
  'pre-event': 'Coming up',
  'live-session': 'Session in progress',
  'between-sessions': 'Race weekend — between sessions',
  completed: 'Completed',
}

export default async function RaceCentre() {
  const [events, { flags }] = await Promise.all([getEvents(), getSettings()])
  const now = new Date()
  const live = currentEvents(events, now)
  const focus: Event[] = live.length ? live : ([nextEvent(events, now)].filter(Boolean) as Event[])
  const sessions = await getSessionsFor(focus.map((e) => e.id))
  const updates = flags.liveText && focus.length ? (await publicFind<LiveUpdate>('live-updates', { where: { event: { in: focus.map((e) => e.id) } }, sort: '-postedAt', limit: 30, depth: 0 })).docs : []
  const lastCompleted = [...events].reverse().find((e) => e.status === 'completed' || (e.endDate && new Date(e.endDate) < now && e.status !== 'cancelled'))
  const lastResults = lastCompleted ? await getResultSets({ event: { equals: lastCompleted.id } }) : []

  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Race Centre' }]} />
      <PageHero eyebrow="Race Centre" title="Race Centre" intro="Follow the current race weekend: timetables, official timing and verified results. We do not show live lap data here. Official timing is always a link to the organiser’s service." />
      <Section className="!pt-8">
        {focus.length === 0 ? (
          <EmptyState title="Off-season" action={<ButtonLink href="/championship-team/news" variant="outline">Read the latest news</ButtonLink>}>
            There are no upcoming events on the published calendar. Events are added once the championships confirm them.
          </EmptyState>
        ) : (
          <div className="grid gap-6">
            {live.length > 1 && <p className="text-mist">{live.length} programmes are racing this weekend.</p>}
            {focus.map((e) => (
              <EventPanel key={e.id} e={e} sessions={sessions.filter((s) => (typeof s.event === 'object' ? s.event.id : s.event) === e.id)} now={now} updates={updates.filter((u) => u.event === e.id)} />
            ))}
          </div>
        )}
      </Section>
      {lastCompleted && lastResults.length > 0 && (
        <Section className="!pt-0" labelledBy="last">
          <h2 id="last" className="mb-4 font-display text-2xl font-bold uppercase">
            Latest results — {lastCompleted.title}
          </h2>
          {lastResults.slice(0, 2).map((r) => (
            <ResultsTable key={r.id} rs={r} />
          ))}
        </Section>
      )}
    </>
  )
}

function EventPanel({ e, sessions, now, updates }: { e: Event; sessions: Session[]; now: Date; updates: LiveUpdate[] }) {
  const state = raceCentreState(e, sessions, now)
  const target = countdownTarget(sessions, now)
  const c = e.circuit as Circuit | null
  const tz = e.timeZone || c?.timeZone || 'UTC'
  const links = e.officialLinks ?? {}
  return (
    <Card className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={state === 'live-session' ? 'success' : state === 'between-sessions' ? 'gold' : 'blue'} label={STATE_LABEL[state]} />
            {e.isDemo && <StatusBadge tone="warn" label="Demo fixture" />}
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold uppercase">
            <Link href={`/championship-team/events/${e.slug}`} className="hover:text-gold-300">
              {e.title}
            </Link>
          </h2>
          <p className="text-mist text-sm">
            {(e.programme as Programme)?.title} · {formatDateRange(e.startDate, e.endDate)}
            {c && ` · ${c.name}`}
          </p>
        </div>
        {target?.startsAt ? <Countdown target={target.startsAt} label={`${target.name} starts in`} /> : <p className="text-mist text-sm">No confirmed session start to count down to.</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="eyebrow mb-2">Today &amp; next sessions ({tz})</h3>
          <ul className="grid gap-1 text-sm">
            {sessions.map((s) => (
              <li key={s.id} className="flex justify-between gap-3 border-b border-white/5 py-1.5">
                <span>{s.name}</span>
                <span className="text-mist">{s.startsAt && s.certainty !== 'tbc' ? `${formatInZone(s.startsAt, tz, 'day')} ${formatInZone(s.startsAt, tz, 'time')}${s.certainty === 'provisional' ? ' (prov.)' : ''}` : 'TBC'}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid content-start gap-3">
          <h3 className="eyebrow">Follow live (official sources)</h3>
          {links.liveTiming ? (
            <ExternalLink href={links.liveTiming} onClickEvent="official_timing_clicked">Official live timing</ExternalLink>
          ) : (
            <p className="text-mist text-sm">No official timing link has been published for this event. Please check the championship’s official website.</p>
          )}
          {links.stream && <ConsentEmbed url={links.stream} title={`${e.title} — official stream`} />}
          <p className="text-mist text-xs">If a stream or timing service is unavailable, use the championship’s official website or social channels.</p>
        </div>
      </div>
      {updates.length > 0 && (
        <div>
          <h3 className="eyebrow mb-2">Team updates</h3>
          <ol className="grid gap-2" aria-label="Team updates, newest first">
            {updates.map((u) => (
              <li key={u.id} className="rounded border border-white/10 p-3 text-sm">
                <time dateTime={u.postedAt} className="text-gold-300 font-semibold">
                  {formatInZone(u.postedAt, tz, 'time')} {formatInZone(u.postedAt, tz, 'tzname')}
                </time>{' '}
                — {u.text}
                <span className="text-mist block text-xs">Manual update{u.author ? ` by ${u.author}` : ''}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  )
}
