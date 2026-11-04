import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getArticles, getCurrentPartnerships, getEngagements, getEvents, getProgrammes, getResultSets, getSessionsFor, getSettings } from '@/lib/data'
import { countdownTarget, eventPhase, isSeasonComplete, nextEvent } from '@/lib/events'
import { ArticleCard, DriverCard, ProgrammeCard, mediaOf } from '@/components/cards'
import { Countdown } from '@/components/Countdown'
import { HeroVideo, TEAM_TRACK } from '@/components/HeroVideo'
import { ButtonLink, Card, Section, SectionHeading, StatusBadge } from '@/components/ui'
import { EVENT_STATUS_LABEL, PROGRAMME_STATUS_LABEL } from '@/lib/status'
import { formatDateRange } from '@/lib/time'
import type { Driver, Event, Programme } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Championship Team',
  description: 'Karat Racing Championship Team — single-seater race programmes in Italian F4, GB4 and Indian F4, with engineering, preparation and driver development.',
  alternates: { canonical: '/championship-team' },
}

const PHASE_LABEL = { upcoming: 'Next event', 'race-weekend': 'Race weekend', completed: 'Completed', postponed: 'Postponed', cancelled: 'Cancelled' }

export default async function TeamHome() {
  const [programmes, events, engagements, articles, partnerships, results, { team }] = await Promise.all([
    getProgrammes(),
    getEvents(),
    getEngagements(),
    getArticles({ limit: 3 }),
    getCurrentPartnerships(),
    getResultSets({ state: { equals: 'final' } }),
    getSettings(),
  ])
  const current = programmes.filter((p) => p.status !== 'future')
  const future = programmes.filter((p) => p.status === 'future')
  const next = nextEvent(events)
  const sessions = next ? await getSessionsFor([next.id]) : []
  const target = countdownTarget(sessions)
  const seasonDone = isSeasonComplete(events)
  const latestYear = engagements[0]?.season
  const roster = engagements.filter((e) => e.season === latestYear && typeof e.driver === 'object')
  const latestResult = results.find((r) => r.attribution === 'karat')

  return (
    <>
      {/* HOME-01 hero — background video: the aerial car on track (scripts/build-team-video.mjs) */}
      <section className="relative isolate flex min-h-[36rem] flex-col justify-center overflow-hidden border-b border-white/10 md:min-h-[42rem]" aria-labelledby="team-hero">
        <HeroVideo sources={TEAM_TRACK} controlClassName="bottom-[5.25rem] right-4 md:bottom-auto md:top-4" className="absolute inset-0 -z-20 h-full w-full object-cover object-[72%_50%]" />
        <p className="sr-only">Background video: an overhead view of the Karat Racing livery concept car on a circuit, with the track moving past at speed.</p>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/60 md:bg-transparent md:bg-gradient-to-r md:from-night md:from-10% md:via-night/70 md:via-40% md:to-night/0 md:to-65%" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-night to-transparent" />
        <div className="container-k relative pb-28 pt-16 md:pb-32 md:pt-24">
          <p className="eyebrow mb-4">Karat Racing · Championship Team</p>
          <h1 id="team-hero" className="max-w-3xl font-display text-[length:var(--text-display-xl)] font-extrabold uppercase leading-[0.95] drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            Prepared to <span className="text-gold-metal">race.</span> Built to develop.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85">
            Single-seater programmes for drivers stepping up from karting and moving through junior categories. Each one has engineering, car preparation and a structured approach to every race weekend.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/championship-team/race-with-us">Discuss your race programme</ButtonLink>
            <ButtonLink href="/championship-team/partner-with-us" variant="outline" className="bg-night/40 backdrop-blur-sm">
              Partner with Karat
            </ButtonLink>
          </div>
        </div>
        {/* Programme "timing board" strip along the bottom of the hero */}
        {current.length > 0 && (
          <nav aria-label="Programmes" className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-night/70 backdrop-blur">
            <ul className="container-k flex items-stretch gap-0 overflow-x-auto [scrollbar-width:none]">
              {current.map((p, i) => (
                <li key={p.id} className="shrink-0 border-r border-white/10 first:border-l">
                  <Link href={`/championship-team/programmes/${p.slug}`} className="group flex min-h-16 items-center gap-3 px-4 hover:bg-white/5 md:px-6">
                    <span className="font-display text-2xl font-extrabold text-gold-500/80">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="block font-display text-sm font-bold uppercase tracking-wider group-hover:text-gold-300">{p.title}</span>
                      <span className="block text-[0.7rem] uppercase tracking-widest text-mist">{PROGRAMME_STATUS_LABEL[p.status] ?? p.status}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </section>

      {/* HOME-04/05 next event, HOME-14 hidden when none */}
      {(next || seasonDone) && (
        <Section className="!py-10">
          <Card className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            {next ? (
              <NextEventPanel e={next} target={target} />
            ) : (
              <div>
                <p className="eyebrow mb-2">Season complete</p>
                <p className="font-display text-2xl font-bold uppercase">The published calendar for this season is complete.</p>
                <p className="text-mist mt-2">We will publish next season’s events once the championships confirm them.</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/championship-team/calendar" variant="outline">
                Full calendar
              </ButtonLink>
              <ButtonLink href="/championship-team/race-centre" variant="blue">
                Race Centre
              </ButtonLink>
            </div>
          </Card>
        </Section>
      )}

      {/* HOME-03 programmes */}
      <Section labelledBy="home-programmes">
        <SectionHeading id="home-programmes" eyebrow="Programmes" title="Where Karat intends to race" intro="Each programme shows its current participation status. “Intended” means the entry is not yet confirmed." />
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {current.map((p) => (
            <li key={p.id}>
              <ProgrammeCard p={p} />
            </li>
          ))}
        </ul>
        {future.length > 0 && (
          <p className="text-mist mt-6 text-sm">
            Longer-term ambitions: {future.map((f) => f.title).join(' and ')}. These are not current entries.{' '}
            <Link href="/championship-team/programmes" className="text-royal-300 underline">
              Compare all programmes
            </Link>
          </p>
        )}
      </Section>

      {/* HOME-09 proposition */}
      <Section paper labelledBy="home-approach">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading id="home-approach" eyebrow="How we work" title="Engineering, preparation, development" />
            <ul className="grid gap-5">
              {(team.workingMethods ?? []).map((w) => (
                <li key={w.id} className="border-l-2 border-gold-500 pl-4">
                  <p className="font-display text-lg font-bold uppercase">{w.title}</p>
                  <p className="text-mist">{w.body}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/championship-team/driver-development" variant="blue">
                Driver development
              </ButtonLink>
              <ButtonLink href="/championship-team/about" variant="ghost" className="!text-navy-800">
                About the team →
              </ButtonLink>
            </div>
          </div>
          <figure>
            <Image src="/brand/livery-presentation.jpg" alt="Karat Racing livery concept shown from the side, front, top and rear" width={1600} height={1050} sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full rounded-card shadow-2xl" />
            <figcaption className="text-mist mt-2 text-xs">Livery concept. Final liveries depend on championship regulations and partner agreements.</figcaption>
          </figure>
        </div>
      </Section>

      {/* HOME-07 roster */}
      {roster.length > 0 && (
        <Section labelledBy="home-drivers">
          <SectionHeading id="home-drivers" eyebrow={`Drivers · ${latestYear}`} title="Driver line-up" />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {roster.slice(0, 8).map((e) => (
              <li key={e.id}>
                <DriverCard d={e.driver as Driver} number={e.number} programme={(e.programme as Programme)?.title} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* HOME-06 latest verified results */}
      {latestResult && (
        <Section labelledBy="home-results" className="!pt-0">
          <SectionHeading id="home-results" eyebrow="Latest result" title={latestResult.label} />
          <ol className="grid gap-2 md:max-w-2xl">
            {(latestResult.entries ?? [])
              .filter((x) => x.isKarat)
              .map((x) => (
                <li key={x.id} className="flex items-center gap-4 rounded border border-gold-400/30 bg-royal-500/10 px-4 py-3">
                  <span className="font-display text-3xl font-extrabold text-gold-200">{x.status !== 'classified' ? x.status : `P${x.position}`}</span>
                  <span>
                    <span className="font-semibold">{x.driverName}</span>
                    <span className="text-mist block text-sm">{latestResult.state === 'final' ? 'Final' : 'Provisional'} classification · verified</span>
                  </span>
                </li>
              ))}
          </ol>
          <Link href="/championship-team/results" className="mt-4 inline-block text-royal-300 underline">
            All results
          </Link>
        </Section>
      )}

      {/* HOME-08 news */}
      {articles.docs.length > 0 && (
        <Section labelledBy="home-news">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading id="home-news" eyebrow="News" title="Latest from the team" />
            <ButtonLink href="/championship-team/news" variant="outline" className="mb-8">
              All news
            </ButtonLink>
          </div>
          <ul className="grid gap-5 md:grid-cols-3">
            {articles.docs.map((a) => (
              <li key={a.id}>
                <ArticleCard a={a} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* HOME-11 heritage */}
      {team.acquisitionApproved && (
        <Section paper labelledBy="home-heritage" className="!py-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow mb-2">Heritage</p>
              <h2 id="home-heritage" className="font-display text-3xl font-bold uppercase">
                From KIC Motorsport to Karat Racing
              </h2>
            </div>
            <ButtonLink href="/championship-team/heritage" variant="blue">
              Read our heritage
            </ButtonLink>
          </div>
        </Section>
      )}

      {/* HOME-10 partners */}
      {partnerships.length > 0 && (
        <Section labelledBy="home-partners">
          <SectionHeading id="home-partners" eyebrow="Partners" title="With thanks to our partners" />
          <ul className="flex flex-wrap items-center gap-6">
            {partnerships.map((ps) => {
              const p = ps.partner as { id: number; name: string; slug: string; logo?: unknown; isDemo?: boolean | null }
              const logo = mediaOf(p.logo)
              return (
                <li key={ps.id}>
                  <Link href={`/championship-team/partners/${p.slug}`} className="flex min-h-16 items-center rounded border border-white/10 px-5 py-3 hover:border-gold-400">
                    {logo?.url ? <Image src={logo.url} alt={p.name} width={140} height={56} className="h-12 w-auto object-contain" /> : <span className="font-display text-lg font-semibold uppercase">{p.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </Section>
      )}

      {/* HOME-12 secondary commercial route + HOME-02 primary */}
      <Section className="!pt-4">
        <div className="clip-angle edge-glow grid gap-8 bg-gradient-to-br from-navy-700 via-navy-800 to-ink-900 p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="eyebrow mb-2">Drivers &amp; families</p>
            <h2 className="font-display text-3xl font-bold uppercase">Discuss your race programme</h2>
            <p className="text-mist mt-3">Tell us about the driver, the category you are considering and the season. A short, confidential enquiry is all it takes — no documents required.</p>
            <ButtonLink href="/championship-team/race-with-us" className="mt-6">
              Start an enquiry
            </ButtonLink>
          </div>
          <div className="md:border-l md:border-white/10 md:pl-8">
            <p className="eyebrow mb-2">Businesses</p>
            <h2 className="font-display text-3xl font-bold uppercase">Partner with Karat</h2>
            <p className="text-mist mt-3">Livery, content, hospitality, technical collaboration and support for young drivers — partnerships planned around your goals.</p>
            <ButtonLink href="/championship-team/partner-with-us" variant="outline" className="mt-6">
              Explore partnerships
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  )
}

function NextEventPanel({ e, target }: { e: Event; target: { name: string; startsAt?: string | null } | null }) {
  const phase = eventPhase(e)
  const circuit = typeof e.circuit === 'object' ? e.circuit : null
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow">{PHASE_LABEL[phase]}</p>
          <StatusBadge status={e.status} label={EVENT_STATUS_LABEL[e.status]} />
          {e.isDemo && <StatusBadge tone="warn" label="Demo fixture" />}
        </div>
        <p className="mt-2 font-display text-2xl font-bold uppercase">
          <Link href={`/championship-team/events/${e.slug}`} className="hover:text-gold-300">
            {e.title}
          </Link>
        </p>
        <p className="text-mist">
          {formatDateRange(e.startDate, e.endDate)}
          {circuit && ` · ${circuit.name}, ${circuit.country}`}
        </p>
      </div>
      {target?.startsAt && phase === 'upcoming' && <Countdown target={target.startsAt} label={`${target.name} starts in`} />}
    </div>
  )
}
