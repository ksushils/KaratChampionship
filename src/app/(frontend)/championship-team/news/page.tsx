import Link from 'next/link'
import type { Metadata } from 'next'
import type { Where } from 'payload'
import { getArticles, getDrivers, getProgrammes, getSettings } from '@/lib/data'
import { ArticleCard } from '@/components/cards'
import { Breadcrumbs, EmptyState, PageHero, Section, buttonClass } from '@/components/ui'
import { ARTICLE_TYPES } from '@/collections/Editorial'

type SP = { programme?: string; season?: string; driver?: string; type?: string; q?: string; page?: string }

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams
  const filtered = Object.keys(sp).some((k) => k !== 'page')
  // SEO-11: filtered views are not indexed; paginated pages canonicalise to themselves.
  return {
    title: 'News',
    description: 'News, race previews and reports from Karat Racing’s Championship Team.',
    alternates: { canonical: sp.page && !filtered ? `/championship-team/news?page=${sp.page}` : '/championship-team/news' },
    robots: filtered ? { index: false, follow: true } : undefined,
  }
}

export default async function News({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const [programmes, drivers, { flags }] = await Promise.all([getProgrammes(), getDrivers(), getSettings()])
  const and: Where[] = []
  const prog = programmes.find((p) => p.slug === sp.programme)
  if (prog) and.push({ programmes: { contains: prog.id } })
  const drv = drivers.find((d) => d.slug === sp.driver)
  if (drv) and.push({ drivers: { contains: drv.id } })
  if (sp.season && /^\d{4}$/.test(sp.season)) and.push({ season: { equals: Number(sp.season) } })
  if (sp.type && ARTICLE_TYPES.some((t) => t.value === sp.type)) and.push({ type: { equals: sp.type } })
  if (sp.q) and.push({ or: [{ title: { like: sp.q.slice(0, 80) } }, { standfirst: { like: sp.q.slice(0, 80) } }] })
  const page = Math.max(1, Number(sp.page) || 1)
  const res = await getArticles({ where: and.length ? { and } : undefined, limit: 12, page })
  const pageHref = (n: number) => `?${new URLSearchParams({ ...Object.fromEntries(Object.entries(sp).filter(([, v]) => v)), page: String(n) })}`
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'News' }]} />
      <PageHero eyebrow="News & Media" title="News" intro="Announcements, race previews, reports and team updates.">
        {flags.rss && (
          <a className={buttonClass('outline')} href="/championship-team/news/rss.xml">
            RSS feed
          </a>
        )}
      </PageHero>
      <Section className="!pt-8">
        <form method="get" role="search" aria-label="Filter news" className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6 lg:items-end">
          <label className="grid gap-1 text-sm lg:col-span-2">
            Search news
            <input type="search" name="q" defaultValue={sp.q} className="field-k" />
          </label>
          <label className="grid gap-1 text-sm">
            Programme
            <select name="programme" defaultValue={sp.programme ?? ''} className="field-k">
              <option value="">All</option>
              {programmes.map((p) => <option key={p.id} value={p.slug!}>{p.title}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Type
            <select name="type" defaultValue={sp.type ?? ''} className="field-k">
              <option value="">All</option>
              {ARTICLE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Driver
            <select name="driver" defaultValue={sp.driver ?? ''} className="field-k">
              <option value="">All</option>
              {drivers.map((d) => <option key={d.id} value={d.slug!}>{d.name}</option>)}
            </select>
          </label>
          <button className={buttonClass('outline')}>Apply</button>
        </form>
        {res.docs.length ? (
          <>
            <p className="text-mist mb-4 text-sm" aria-live="polite">{res.totalDocs} article{res.totalDocs === 1 ? '' : 's'}</p>
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{res.docs.map((a) => <li key={a.id}><ArticleCard a={a} /></li>)}</ul>
            {res.totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-10 flex flex-wrap gap-2">
                {Array.from({ length: res.totalPages }).map((_, i) => (
                  <Link key={i} href={pageHref(i + 1)} aria-current={page === i + 1 ? 'page' : undefined} className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded border ${page === i + 1 ? 'border-gold-400 text-gold-200' : 'border-white/15'}`}>
                    {i + 1}
                  </Link>
                ))}
              </nav>
            )}
          </>
        ) : (
          <EmptyState title="No articles found">Try removing a filter, or check back soon.</EmptyState>
        )}
      </Section>
    </>
  )
}
