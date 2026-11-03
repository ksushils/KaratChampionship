import type { MetadataRoute } from 'next'
import { publicFind } from '@/lib/data'
import type { Article, Driver, Event, MediaCollection, Partner, Programme, ProgrammeSeason, Vacancy } from '@/payload-types'

export const dynamic = 'force-dynamic'

/** SEO-03: built from public reads only — drafts, embargoed drivers and private records cannot appear. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.APP_ENV !== 'production' && process.env.SITEMAP_IN_NONPROD !== 'true') return []
  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const statics = ['/', '/championship-team', '/championship-team/about', '/championship-team/heritage', '/championship-team/people', '/championship-team/facilities', '/championship-team/programmes', '/championship-team/drivers', '/championship-team/alumni', '/championship-team/calendar', '/championship-team/race-centre', '/championship-team/results', '/championship-team/standings', '/championship-team/driver-development', '/championship-team/race-with-us', '/championship-team/partners', '/championship-team/partner-with-us', '/championship-team/hospitality', '/championship-team/news', '/championship-team/media', '/championship-team/press', '/championship-team/careers', '/championship-team/faqs', '/championship-team/contact', '/testing', '/testing/enquire', '/championship-organisation', '/championship-organisation/enquire', '/privacy', '/cookies', '/terms', '/accessibility', '/safeguarding']
  const [programmes, seasons, drivers, events, articles, media, partners, vacancies] = await Promise.all([
    publicFind<Programme>('programmes', { depth: 0, limit: 200 }),
    publicFind<ProgrammeSeason>('programme-seasons', { depth: 1, limit: 500 }),
    publicFind<Driver>('drivers', { depth: 0, limit: 1000 }),
    publicFind<Event>('events', { depth: 0, limit: 1000 }),
    publicFind<Article>('articles', { depth: 0, limit: 5000 }),
    publicFind<MediaCollection>('media-collections', { depth: 0, limit: 1000 }),
    publicFind<Partner>('partners', { depth: 0, limit: 500 }),
    publicFind<Vacancy>('vacancies', { depth: 0, limit: 200 }),
  ])
  const noindex = (d: { seo?: { noindex?: boolean | null } | null; isDemo?: boolean | null }) => d.seo?.noindex || d.isDemo
  return [
    ...statics.map((p) => ({ url: `${base}${p}` })),
    ...programmes.docs.filter((d) => !noindex(d)).map((d) => ({ url: `${base}/championship-team/programmes/${d.slug}`, lastModified: d.updatedAt })),
    ...seasons.docs.filter((s) => typeof s.programme === 'object').map((s) => ({ url: `${base}/championship-team/programmes/${(s.programme as Programme).slug}/${s.year}`, lastModified: s.updatedAt })),
    ...drivers.docs.filter((d) => !noindex(d)).map((d) => ({ url: `${base}/championship-team/drivers/${d.slug}`, lastModified: d.updatedAt })),
    ...events.docs.filter((d) => !d.isDemo).map((d) => ({ url: `${base}/championship-team/events/${d.slug}`, lastModified: d.updatedAt })),
    ...articles.docs.filter((d) => !noindex(d)).map((d) => ({ url: `${base}/championship-team/news/${d.slug}`, lastModified: d.updatedAt })),
    ...media.docs.filter((d) => !d.isDemo).map((d) => ({ url: `${base}/championship-team/media/${d.slug}`, lastModified: d.updatedAt })),
    ...partners.docs.filter((d) => !d.isDemo).map((d) => ({ url: `${base}/championship-team/partners/${d.slug}`, lastModified: d.updatedAt })),
    ...vacancies.docs.filter((d) => !d.isDemo).map((d) => ({ url: `${base}/championship-team/careers/${d.slug}`, lastModified: d.updatedAt })),
  ]
}
