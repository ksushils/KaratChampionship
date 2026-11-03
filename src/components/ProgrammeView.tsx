import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticles, getEngagements, getEvents, getFaqs, getProgramme, getProgrammeSeasons, getResultSets, publicFind } from '@/lib/data'
import { PROGRAMME_STATUS_LABEL, SEAT_LABEL } from '@/lib/status'
import type { Championship, ChampionshipSeason, Driver, MediaCollection, Source } from '@/payload-types'
import { ArticleCard, DriverCard, EventRow, mediaOf } from './cards'
import { FaqList } from './FaqList'
import { ResultsTable } from './ResultsTable'
import { RichText } from './RichText'
import { Breadcrumbs, ButtonLink, Card, ExternalLink, JsonLd, Notice, Section, SectionHeading, StatusBadge } from './ui'

const RELATIONSHIP_LABEL: Record<string, string> = {
  entrant: 'Entrant',
  'technical-operator': 'Technical operator',
  'driver-support': 'Driver-support provider',
  'commercial-partner': 'Commercial partner',
  'proposed-participant': 'Proposed participant',
  other: 'Relationship to be confirmed',
}

const PROGRAMME_IMAGE: Record<string, string> = {
  'italian-f4': '/brand/car-front-light.jpg',
  gb4: '/brand/car-rear-light.jpg',
  'indian-f4': '/brand/car-top-light.jpg',
}

export async function ProgrammeView({ slug, seasonParam }: { slug: string; seasonParam?: string }) {
  const p = await getProgramme(slug)
  if (!p) notFound()
  const champ = p.championship as Championship
  const seasons = await getProgrammeSeasons(p.id)
  const requested = seasonParam ? Number(seasonParam) : undefined
  if (seasonParam && (!Number.isInteger(requested) || !seasons.some((s) => s.year === requested))) notFound()
  const thisYear = new Date().getUTCFullYear()
  const ps = requested ? seasons.find((s) => s.year === requested)! : (seasons.find((s) => s.year >= thisYear) ?? seasons[0])
  const year = ps?.year
  const status = ps?.participationStatus ?? p.status
  const seatAvailability = ps?.seatAvailability ?? p.seatAvailability ?? 'not-published'

  // Most recent verified championship season up to the selected year (clearly labelled with its own year).
  const cs = (await publicFind<ChampionshipSeason>('championship-seasons', { where: { championship: { equals: champ.id } }, sort: '-year', depth: 1 })).docs
  const spec = cs.find((s) => !year || s.year <= year) ?? cs[cs.length - 1]

  const [events, engagements, articles, results, faqs, media] = await Promise.all([
    getEvents({ and: [{ programme: { equals: p.id } }, ...(year ? [{ season: { in: [year, year - 1] } }] : [])] }),
    getEngagements({ and: [{ programme: { equals: p.id } }, ...(year ? [{ season: { equals: year } }] : [])] }),
    getArticles({ where: { programmes: { contains: p.id } }, limit: 3 }),
    getResultSets({ programme: { equals: p.id } }),
    getFaqs(undefined, p.id).then(async (own) => (own.length ? own : getFaqs('programmes'))),
    publicFind<MediaCollection>('media-collections', { where: { programme: { equals: p.id } }, limit: 3, depth: 1 }),
  ])
  const seasonEvents = events.filter((e) => !year || e.season === year)
  const isFuture = p.status === 'future'
  const enquire = `/championship-team/race-with-us?programme=${p.slug}${year ? `&season=${year}` : ''}`
  const hero = mediaOf(p.heroImage)?.url ?? PROGRAMME_IMAGE[p.slug ?? ''] ?? '/brand/car-side-light.jpg'
  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''

  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Programmes', href: '/championship-team/programmes' }, { label: p.title, href: `/championship-team/programmes/${p.slug}` }, ...(seasonParam ? [{ label: seasonParam }] : [])]} />
      <section className="relative overflow-hidden border-b border-white/10 bg-ink-900" aria-labelledby="prog-title">
        <div className="container-k grid gap-8 py-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow mb-3">{champ.name}</p>
            <h1 id="prog-title" className="font-display text-[length:var(--text-display-lg)] font-bold uppercase">
              {p.title}
              {seasonParam && <span className="text-gold-metal"> {seasonParam}</span>}
            </h1>
            {/* CHAMP-02: status near the title */}
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Programme status">
              <StatusBadge status={status} label={`${year ? `${year}: ` : ''}${PROGRAMME_STATUS_LABEL[status ?? 'intended']}`} />
              {!isFuture && <StatusBadge tone="neutral" label={RELATIONSHIP_LABEL[p.relationshipType ?? 'other']} />}
              {!isFuture && <StatusBadge status={seatAvailability} label={SEAT_LABEL[seatAvailability]} />}
            </div>
            {p.shortDescription && <p className="text-mist mt-5 max-w-2xl text-lg">{p.shortDescription}</p>}
            {!isFuture && (
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href={enquire}>Discuss this programme</ButtonLink>
                <ButtonLink href={`/testing/enquire?from=${encodeURIComponent(`programme:${p.slug}`)}&programme=${p.slug}`} variant="outline" data-track="testing_handoff_clicked">
                  Ask about testing first
                </ButtonLink>
              </div>
            )}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-paper">
            <Image src={hero} alt="" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
        </div>
        {/* CHAMP-03 season selector */}
        {seasons.length > 0 && (
          <nav aria-label="Seasons" className="container-k pb-6">
            <ul className="flex flex-wrap gap-2 text-sm">
              {seasons.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/championship-team/programmes/${p.slug}/${s.year}`}
                    aria-current={s.year === year ? 'page' : undefined}
                    className={`inline-flex min-h-11 items-center rounded border px-4 ${s.year === year ? 'border-gold-400 text-gold-200' : 'border-white/15 hover:border-white/40'}`}
                  >
                    {s.year} <span className="text-mist ml-2 text-xs">{s.year > thisYear ? 'upcoming' : s.year === thisYear ? 'current' : 'archive'}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </section>

      {p.slug === 'indian-f4' && (
        <Section className="!pb-0">
          <Notice tone="blue" title="About Karat Racing and Indian F4">
            Indian F4 is promoted by Racing Promotions Pvt Ltd, and its participation model may differ from European F4. Karat Racing’s exact role (entrant, technical operator, driver support or another approved relationship) will be published once it is confirmed. Karat Racing’s separate plan to organise a championship in India is not connected to Indian F4.
          </Notice>
        </Section>
      )}

      <Section labelledBy="overview">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeading id="overview" eyebrow="Overview" title={`About ${p.title}`} />
            {p.overview ? <RichText data={p.overview} /> : <p className="prose-k text-mist">{p.shortDescription}</p>}
            {champ.explainer && (
              <div className="mt-8">
                <h3 className="font-display text-xl font-bold uppercase">The championship explained</h3>
                <RichText data={champ.explainer} />
              </div>
            )}
            {p.driverFit && (
              <div className="mt-8">
                <h3 className="font-display text-xl font-bold uppercase">Who it suits</h3>
                <p className="text-mist mt-2">{p.driverFit}</p>
              </div>
            )}
          </div>
          <aside aria-label="Championship facts" className="grid content-start gap-4">
            <Card>
              <h3 className="eyebrow mb-3">Championship</h3>
              <dl className="grid gap-2 text-sm">
                {champ.organiser && <Fact k="Organiser" v={champ.organiser} />}
                {champ.geography && <Fact k="Geography" v={champ.geography} />}
              </dl>
              {champ.officialUrl && (
                <p className="mt-4 text-sm">
                  <ExternalLink href={champ.officialUrl}>Official championship website</ExternalLink>
                </p>
              )}
            </Card>
            {spec && <SpecCard spec={spec} selectedYear={year} />}
          </aside>
        </div>
      </Section>

      {Boolean(p.teamSupport?.length || p.inclusions?.length || p.exclusions?.length) && (
        <Section paper labelledBy="support">
          <SectionHeading id="support" eyebrow="Support" title="What the programme includes" />
          <div className="grid gap-8 md:grid-cols-3">
            {p.teamSupport?.length ? (
              <List title="Team support" items={p.teamSupport.map((x) => [x.item, x.detail])} />
            ) : null}
            {p.inclusions?.length ? <List title="Included" items={p.inclusions.map((x) => [x.item])} /> : null}
            {p.exclusions?.length ? <List title="Not included" items={p.exclusions.map((x) => [x.item])} /> : null}
          </div>
        </Section>
      )}

      {/* CHAMP-08 calendar */}
      <Section labelledBy="calendar">
        <SectionHeading id="calendar" eyebrow={year ? `Calendar · ${year}` : 'Calendar'} title="Events" />
        {seasonEvents.length ? (
          <ul>
            {seasonEvents.map((e) => (
              <EventRow key={e.id} e={e} showProgramme={false} />
            ))}
          </ul>
        ) : (
          <p className="text-mist">No events have been published for this season yet. Calendars are published once they have been verified against the official championship calendar.</p>
        )}
      </Section>

      {/* CHAMP-09 drivers */}
      {engagements.length > 0 && (
        <Section labelledBy="drivers" className="!pt-0">
          <SectionHeading id="drivers" eyebrow={`Line-up · ${year}`} title="Drivers" />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {engagements
              .filter((e) => typeof e.driver === 'object')
              .map((e) => (
                <li key={e.id}>
                  <DriverCard d={e.driver as Driver} number={e.number} />
                </li>
              ))}
          </ul>
        </Section>
      )}

      {/* CHAMP-17 results */}
      {results.length > 0 && (
        <Section labelledBy="results" className="!pt-0">
          <SectionHeading id="results" eyebrow="Results" title="Verified results" />
          {results.slice(0, 2).map((r) => (
            <ResultsTable key={r.id} rs={r} />
          ))}
          <Link className="text-royal-300 underline" href={`/championship-team/results?programme=${p.slug}`}>
            All {p.title} results
          </Link>
        </Section>
      )}

      {/* CHAMP-11..14 commercial */}
      {!isFuture && (
        <Section paper labelledBy="commercial">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <SectionHeading id="commercial" eyebrow="Seat &amp; budget" title="Discuss your programme" />
              <p className="text-mist">
                Seat status: <strong className="text-navy-800">{SEAT_LABEL[seatAvailability]}</strong>.{' '}
                {p.pricing?.mode === 'published' && p.pricing.amount
                  ? `Programme price from ${new Intl.NumberFormat('en-GB', { style: 'currency', currency: p.pricing.currency ?? 'GBP', maximumFractionDigits: 0 }).format(p.pricing.amount)} (${p.pricing.taxBasis === 'excl-vat' ? 'excluding VAT' : p.pricing.taxBasis === 'incl-vat' ? 'including VAT' : 'tax not applicable'}). ${p.pricing.conditions}`
                  : 'Programme costs depend on the season plan, testing and support level, so we discuss them individually and in confidence.'}
              </p>
              <ButtonLink href={enquire} className="mt-6">
                Start a {p.title} enquiry
              </ButtonLink>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold uppercase">Eligibility &amp; regulations</h3>
              {spec?.eligibility?.summary ? (
                <p className="mt-2">
                  {spec.eligibility.summary}
                  {spec.eligibility.reviewedAt && <span className="text-mist block text-xs">Reviewed {new Date(spec.eligibility.reviewedAt).toLocaleDateString('en-GB')}</span>}
                </p>
              ) : (
                <p className="text-mist mt-2">Age and licence requirements are set by the championship and the national sporting authority every season. Please check the current regulations below. We will confirm eligibility with you directly.</p>
              )}
              {Boolean(spec?.documents?.length || p.officialLinks?.length) && (
                <ul className="mt-4 grid gap-2">
                  {spec?.documents?.map((d) => (
                    <li key={d.id}>
                      <a className="font-semibold text-royal-600 underline" href={d.url} target="_blank" rel="noopener noreferrer">
                        {d.label} ({spec.year})<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                  {p.officialLinks?.map((d) => (
                    <li key={d.id}>
                      <a className="font-semibold text-royal-600 underline" href={d.url} target="_blank" rel="noopener noreferrer">
                        {d.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Section>
      )}

      {articles.docs.length > 0 && (
        <Section labelledBy="news">
          <SectionHeading id="news" eyebrow="News" title={`${p.title} news`} />
          <ul className="grid gap-5 md:grid-cols-3">
            {articles.docs.map((a) => (
              <li key={a.id}>
                <ArticleCard a={a} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {media.docs.length > 0 && (
        <Section labelledBy="media" className="!pt-0">
          <SectionHeading id="media" eyebrow="Media" title="Galleries" />
          <ul className="grid gap-3 md:grid-cols-3">
            {media.docs.map((m) => (
              <li key={m.id}>
                <Link className="text-royal-300 underline" href={`/championship-team/media/${m.slug}`}>
                  {m.title}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {faqs.length > 0 && (
        <Section labelledBy="faqs">
          <SectionHeading id="faqs" eyebrow="FAQs" title="Questions about this programme" />
          <div className="max-w-3xl">
            <FaqList faqs={faqs} />
          </div>
        </Section>
      )}

      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebPage', name: `${p.title} — Karat Racing`, url: `${base}/championship-team/programmes/${p.slug}${seasonParam ? `/${seasonParam}` : ''}`, about: { '@type': 'SportsOrganization', name: champ.name, url: champ.officialUrl ?? undefined } }} />
    </>
  )
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-2">
      <dt className="text-mist">{k}</dt>
      <dd>{v}</dd>
    </div>
  )
}

function List({ title, items }: { title: string; items: (string | null | undefined)[][] }) {
  return (
    <div>
      <h3 className="font-display text-lg font-bold uppercase">{title}</h3>
      <ul className="mt-3 grid gap-2">
        {items.map(([a, b], i) => (
          <li key={i} className="border-l-2 border-gold-500 pl-3">
            <span className="font-semibold">{a}</span>
            {b && <span className="text-mist block text-sm">{b}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** CHAMP-05/06/07: versioned machinery & format, always labelled with its season and source. */
function SpecCard({ spec, selectedYear }: { spec: ChampionshipSeason; selectedYear?: number }) {
  const m = spec.machinery ?? {}
  const rows = [
    ['Chassis', m.chassis],
    ['Engine', m.engine],
    ['Gearbox', m.gearbox],
    ['Tyres', m.tyres],
    ['Safety', m.safety],
  ].filter(([, v]) => v)
  const src = typeof m.source === 'object' ? (m.source as Source) : null
  const pts = spec.pointsSystem
  return (
    <Card>
      <h3 className="eyebrow mb-1">{spec.year} season information</h3>
      {selectedYear && spec.year !== selectedYear && <p className="mb-2 text-xs text-warn">Showing the latest verified season ({spec.year}). {selectedYear} details are not yet published.</p>}
      {rows.length > 0 ? (
        <dl className="grid gap-2 text-sm">
          {rows.map(([k, v]) => (
            <Fact key={k} k={k!} v={v!} />
          ))}
        </dl>
      ) : (
        <p className="text-mist text-sm">Car specification not yet verified for publication.</p>
      )}
      {src?.url && (
        <p className="text-mist mt-2 text-xs">
          Source: <ExternalLink href={src.url}>{src.title}</ExternalLink>
          {m.verifiedAt && ` · checked ${new Date(m.verifiedAt).toLocaleDateString('en-GB')}`}
        </p>
      )}
      {spec.format && spec.format.length > 0 && (
        <>
          <h4 className="mt-4 font-semibold">Event format</h4>
          <ul className="mt-1 grid gap-1 text-sm">
            {spec.format.map((f) => (
              <li key={f.id}>
                <span className="font-semibold">{f.element}:</span> <span className="text-mist">{f.detail}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {pts?.description && (
        <>
          <h4 className="mt-4 font-semibold">Points</h4>
          <p className="text-mist text-sm">{pts.description}</p>
        </>
      )}
      {spec.classes && spec.classes.length > 0 && <p className="text-mist mt-3 text-sm">Official classes: {spec.classes.join(', ')}</p>}
    </Card>
  )
}
