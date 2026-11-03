import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticles, getDriver, getEngagements, getResultSets, publicFind } from '@/lib/data'
import { ArticleCard, mediaOf } from '@/components/cards'
import { RichText } from '@/components/RichText'
import { Breadcrumbs, ExternalLink, JsonLd, Section, SectionHeading, StatusBadge, Val } from '@/components/ui'
import type { MediaCollection, Programme, Source } from '@/payload-types'

type P = { params: Promise<{ driver: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const d = await getDriver((await params).driver)
  if (!d) return { title: 'Driver not found' }
  return { title: d.seo?.title || d.name, description: d.seo?.description || d.shortBio || undefined, alternates: { canonical: `/championship-team/drivers/${d.slug}` }, robots: d.seo?.noindex ? { index: false } : undefined }
}

export default async function DriverPage({ params }: P) {
  const d = await getDriver((await params).driver)
  if (!d) notFound()
  const [engagements, articles, results, media] = await Promise.all([
    getEngagements({ driver: { equals: d.id } }),
    getArticles({ where: { drivers: { contains: d.id } }, limit: 3 }),
    getResultSets({ 'entries.driver': { equals: d.id } }),
    publicFind<MediaCollection>('media-collections', { where: { drivers: { contains: d.id } }, limit: 6 }),
  ])
  const portrait = mediaOf(d.portrait)
  const current = engagements[0]
  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Drivers', href: '/championship-team/drivers' }, { label: d.name }]} />
      <section className="border-b border-white/10 bg-ink-900">
        <div className="container-k grid gap-8 py-12 md:grid-cols-[18rem_1fr] md:items-end">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-navy-700">
            {portrait?.url ? <Image src={portrait.url} alt={portrait.alt ?? d.name} fill priority sizes="18rem" className="object-cover" /> : <Image src="/brand/karat-k.png" alt="" fill className="object-contain p-12 opacity-25" />}
          </div>
          <div>
            {current?.number && <p className="font-display text-7xl font-extrabold text-gold-metal" aria-label={`Number ${current.number} in ${current.season}`}>{current.number}</p>}
            <h1 className="font-display text-[length:var(--text-display-lg)] font-bold uppercase">{d.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {d.nationality && <StatusBadge tone="neutral" label={d.nationality} />}
              {d.isDemo && <StatusBadge tone="warn" label="Demo fixture — fictional" />}
            </div>
            {d.shortBio && <p className="text-mist mt-4 max-w-2xl text-lg">{d.shortBio}</p>}
            {d.socialLinks?.length ? (
              <ul className="mt-4 flex flex-wrap gap-4 text-sm">
                {d.socialLinks.map((s) => (
                  <li key={s.id}>
                    <ExternalLink href={s.url}>{s.label}</ExternalLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {d.bio && (
              <>
                <SectionHeading eyebrow="Biography" title="Profile" />
                <RichText data={d.bio} />
              </>
            )}
            {d.careerTimeline?.length ? (
              <div className="mt-10">
                <SectionHeading eyebrow="Career" title="Racing history" />
                <ol className="grid gap-3 border-l-2 border-gold-500/50 pl-5">
                  {[...d.careerTimeline].sort((a, b) => b.year - a.year).map((c) => (
                    <li key={c.id}>
                      <span className="font-display text-lg font-bold text-gold-200">{c.year}</span> — <span className="font-semibold">{c.category}</span>
                      {c.team && <span className="text-mist"> · {c.team}</span>}
                      {c.notes && <span className="text-mist block text-sm">{c.notes}</span>}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
          <aside className="grid content-start gap-6">
            <div>
              <h2 className="eyebrow mb-3">Programmes with Karat</h2>
              {engagements.length ? (
                <table className="table-k">
                  <caption className="sr-only">Seasons, programmes and race numbers</caption>
                  <thead>
                    <tr>
                      <th scope="col">Season</th>
                      <th scope="col">Programme</th>
                      <th scope="col">No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {engagements.map((e) => (
                      <tr key={e.id}>
                        <td>{e.season}</td>
                        <td>
                          <Link className="underline" href={`/championship-team/programmes/${(e.programme as Programme)?.slug}/${e.season}`}>
                            {(e.programme as Programme)?.title}
                          </Link>
                        </td>
                        <td>
                          <Val v={e.number} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-mist text-sm">No published programmes.</p>
              )}
            </div>
            {d.stats?.length ? (
              <div>
                <h2 className="eyebrow mb-3">Statistics</h2>
                <dl className="grid gap-3">
                  {d.stats.map((s) => (
                    <div key={s.id} className="rounded border border-white/10 p-3">
                      <dt className="text-mist text-xs uppercase tracking-wider">{s.label}</dt>
                      <dd className="font-display text-2xl font-bold">{s.value}</dd>
                      <dd className="text-mist text-xs">
                        Scope: {s.scope}
                        {typeof s.source === 'object' && (s.source as Source)?.url && (
                          <>
                            {' '}
                            · <a className="underline" href={(s.source as Source).url!}>source</a>
                          </>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
            {d.driverPartners?.length ? (
              <div>
                <h2 className="eyebrow mb-3">Personal partners</h2>
                <p className="text-mist mb-2 text-xs">The driver’s own sponsors, which are separate from Karat Racing team partners.</p>
                <ul className="grid gap-1 text-sm">{d.driverPartners.map((p) => <li key={p.id}>{p.url ? <ExternalLink href={p.url}>{p.name}</ExternalLink> : p.name}</li>)}</ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Section>
      {results.length > 0 && (
        <Section labelledBy="d-results" className="!pt-0">
          <SectionHeading id="d-results" eyebrow="Results" title="Recent results" />
          <ul className="grid gap-2">
            {results.slice(0, 10).map((r) => {
              const e = r.entries?.find((x) => (typeof x.driver === 'object' ? x.driver?.id : x.driver) === d.id)
              return (
                <li key={r.id} className="flex flex-wrap items-center gap-3 border-b border-white/10 py-2">
                  <span className="font-display text-xl font-bold text-gold-200">{e?.status && e.status !== 'classified' ? e.status : e?.position ? `P${e.position}` : '—'}</span>
                  <Link className="underline" href={`/championship-team/results?season=${r.season}`}>
                    {r.label}
                  </Link>
                  <StatusBadge tone={r.state === 'final' ? 'success' : 'warn'} label={r.state} />
                </li>
              )
            })}
          </ul>
        </Section>
      )}
      {articles.docs.length > 0 && (
        <Section labelledBy="d-news">
          <SectionHeading id="d-news" eyebrow="News" title={`News about ${d.name}`} />
          <ul className="grid gap-5 md:grid-cols-3">{articles.docs.map((a) => <li key={a.id}><ArticleCard a={a} /></li>)}</ul>
        </Section>
      )}
      {media.docs.length > 0 && (
        <Section labelledBy="d-media" className="!pt-0">
          <SectionHeading id="d-media" eyebrow="Media" title="Galleries" />
          <ul className="grid gap-2">{media.docs.map((m) => <li key={m.id}><Link className="underline" href={`/championship-team/media/${m.slug}`}>{m.title}</Link></li>)}</ul>
        </Section>
      )}
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Person', name: d.name, nationality: d.nationality ?? undefined, url: `${base}/championship-team/drivers/${d.slug}`, memberOf: { '@type': 'SportsTeam', name: 'Karat Racing' } }} />
    </>
  )
}
