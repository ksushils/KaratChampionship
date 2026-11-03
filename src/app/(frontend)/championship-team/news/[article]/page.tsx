import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { publicFindOne } from '@/lib/data'
import { mediaOf } from '@/components/cards'
import { RichText } from '@/components/RichText'
import { ShareLinks } from '@/components/ShareLinks'
import { Breadcrumbs, JsonLd, Notice, Section, StatusBadge } from '@/components/ui'
import type { Article, Driver, Event, Partner, Programme } from '@/payload-types'

type P = { params: Promise<{ article: string }> }
const get = (slug: string) => publicFindOne<Article>('articles', { slug: { equals: slug } }, 2)

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const a = await get((await params).article)
  if (!a) return { title: 'Article not found' }
  const img = mediaOf(a.seo?.image) ?? mediaOf(a.heroImage)
  return {
    title: a.seo?.title || a.title,
    description: a.seo?.description || a.standfirst || undefined,
    alternates: { canonical: a.seo?.canonical || `/championship-team/news/${a.slug}` },
    robots: a.seo?.noindex ? { index: false } : undefined,
    openGraph: { type: 'article', title: a.title, description: a.standfirst ?? undefined, publishedTime: a.publishedAt ?? undefined, modifiedTime: a.updatedAt, images: img?.url ? [img.url] : ['/brand/og-default.jpg'] },
  }
}

export default async function ArticlePage({ params }: P) {
  const a = await get((await params).article)
  if (!a) notFound()
  const hero = mediaOf(a.heroImage)
  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const url = `${base}/championship-team/news/${a.slug}`
  const rel = <T,>(arr: unknown[] | null | undefined) => (arr ?? []).filter((x): x is T => Boolean(x && typeof x === 'object'))
  const programmes = rel<Programme>(a.programmes)
  const drivers = rel<Driver>(a.drivers)
  const events = rel<Event>(a.events)
  const partners = rel<Partner>(a.partners)
  const updated = a.publishedAt && new Date(a.updatedAt).getTime() - new Date(a.publishedAt).getTime() > 3_600_000
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'News', href: '/championship-team/news' }, { label: a.title }]} />
      <article>
        <header className="container-k max-w-4xl pb-8 pt-10">
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="neutral" label={a.type.replace('-', ' ')} />
            {programmes.map((p) => <StatusBadge key={p.id} tone="blue" label={p.title} />)}
            {a.isDemo && <StatusBadge tone="warn" label="Demo fixture — fictional" />}
          </div>
          <h1 className="mt-4 font-display text-[length:var(--text-display-lg)] font-bold uppercase leading-[1.02]">{a.title}</h1>
          {a.standfirst && <p className="text-mist mt-4 text-xl">{a.standfirst}</p>}
          <p className="text-mist mt-4 text-sm">
            {a.author && <>By {a.author} · </>}
            {a.publishedAt && <time dateTime={a.publishedAt}>{new Date(a.publishedAt).toLocaleDateString('en-GB', { dateStyle: 'long', timeZone: 'UTC' })}</time>}
            {updated && <> · Updated <time dateTime={a.updatedAt}>{new Date(a.updatedAt).toLocaleDateString('en-GB', { dateStyle: 'long' })}</time></>}
          </p>
        </header>
        {hero?.url && (
          <figure className="container-k max-w-5xl">
            <Image src={hero.url} alt={hero.alt ?? ''} width={hero.width ?? 1600} height={hero.height ?? 900} priority sizes="(min-width: 1024px) 64rem, 100vw" className="h-auto w-full rounded-card" />
            {(hero.caption || hero.credit) && <figcaption className="text-mist mt-2 text-xs">{[hero.caption, hero.credit].filter(Boolean).join(' · ')}</figcaption>}
          </figure>
        )}
        <div className="container-k max-w-4xl py-10">
          {a.corrections?.length ? (
            <div className="mb-8">
              <Notice tone="warn" title="Corrections">
                <ul>
                  {a.corrections.map((c) => (
                    <li key={c.id}>
                      {new Date(c.date).toLocaleDateString('en-GB')}: {c.note}
                    </li>
                  ))}
                </ul>
              </Notice>
            </div>
          ) : null}
          <RichText data={a.body} className="text-[1.05rem]" />
          <div className="mt-10 border-t border-white/10 pt-6">
            <ShareLinks url={url} title={a.title} />
          </div>
          {(drivers.length > 0 || events.length > 0 || partners.length > 0) && (
            <aside aria-label="Related" className="mt-10 grid gap-4 rounded-card border border-white/10 p-6 md:grid-cols-3">
              {drivers.length > 0 && (
                <div>
                  <h2 className="eyebrow mb-2">Drivers</h2>
                  <ul className="grid gap-1">{drivers.map((d) => <li key={d.id}><Link className="underline" href={`/championship-team/drivers/${d.slug}`}>{d.name}</Link></li>)}</ul>
                </div>
              )}
              {events.length > 0 && (
                <div>
                  <h2 className="eyebrow mb-2">Events</h2>
                  <ul className="grid gap-1">{events.map((e) => <li key={e.id}><Link className="underline" href={`/championship-team/events/${e.slug}`}>{e.title}</Link></li>)}</ul>
                </div>
              )}
              {partners.length > 0 && (
                <div>
                  <h2 className="eyebrow mb-2">Partners</h2>
                  <ul className="grid gap-1">{partners.map((p) => <li key={p.id}><Link className="underline" href={`/championship-team/partners/${p.slug}`}>{p.name}</Link></li>)}</ul>
                </div>
              )}
            </aside>
          )}
        </div>
      </article>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'NewsArticle', headline: a.title, description: a.standfirst ?? undefined, datePublished: a.publishedAt, dateModified: a.updatedAt, author: a.author ? { '@type': 'Person', name: a.author } : { '@type': 'Organization', name: 'Karat Racing' }, image: hero?.url ? [`${base}${hero.url}`] : undefined, mainEntityOfPage: url, publisher: { '@type': 'Organization', name: 'Karat Racing', logo: { '@type': 'ImageObject', url: `${base}/brand/karat-k.png` } } }} />
    </>
  )
}
