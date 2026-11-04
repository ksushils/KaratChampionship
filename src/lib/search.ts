import 'server-only'
import { publicFind } from './data'
import { TESTING_PAGE } from './nav'
import type { Article, Driver, Event, Faq, Programme } from '@/payload-types'

export type SearchHit = { type: string; title: string; href: string; excerpt?: string | null }

const STATIC_PAGES: SearchHit[] = [
  { type: 'Page', title: 'Race with us', href: '/championship-team/race-with-us', excerpt: 'Discuss a race programme with Karat Racing' },
  { type: 'Page', title: 'Partner with us', href: '/championship-team/partner-with-us', excerpt: 'Sponsorship and partnership opportunities, livery positions' },
  { type: 'Page', title: 'Hospitality', href: '/championship-team/hospitality', excerpt: 'Race-weekend guest enquiries' },
  { type: 'Page', title: 'Driver development', href: '/championship-team/driver-development', excerpt: 'Karting to single-seaters, engineering, data, families' },
  { type: 'Page', title: 'Calendar', href: '/championship-team/calendar', excerpt: 'Race weekends and team events' },
  { type: 'Page', title: 'Careers', href: '/championship-team/careers', excerpt: 'Jobs and vacancies' },
  { type: 'Page', title: 'Press', href: '/championship-team/press', excerpt: 'Media enquiries and downloads' },
  { type: 'Page', title: 'Testing & Karat Academy', href: TESTING_PAGE, excerpt: 'Testing and driver development' },
  { type: 'Page', title: 'Championship Series — India', href: '/championship-organisation', excerpt: 'Championship organisation project in India' },
  { type: 'Page', title: 'Safeguarding', href: '/safeguarding', excerpt: 'Young driver welfare and concerns' },
  { type: 'Page', title: 'Contact', href: '/championship-team/contact', excerpt: 'Contact routes' },
]

/**
 * UTIL-06/07: searches only what an anonymous visitor may read (access control enforced),
 * so drafts, embargoed drivers, enquiries and applications can never appear.
 */
export async function siteSearch(raw: string): Promise<SearchHit[]> {
  const q = raw.trim().slice(0, 80)
  if (q.length < 2) return []
  const like = { like: q }
  const [articles, drivers, events, programmes, faqs] = await Promise.all([
    publicFind<Article>('articles', { where: { or: [{ title: like }, { standfirst: like }] }, limit: 10, depth: 0 }),
    publicFind<Driver>('drivers', { where: { name: like }, limit: 10, depth: 0 }),
    publicFind<Event>('events', { where: { title: like }, limit: 10, depth: 0 }),
    publicFind<Programme>('programmes', { where: { or: [{ title: like }, { shortDescription: like }] }, limit: 10, depth: 0 }),
    publicFind<Faq>('faqs', { where: { or: [{ question: like }, { answer: like }] }, limit: 10, depth: 0 }),
  ])
  const ql = q.toLowerCase()
  return [
    ...programmes.docs.map((p) => ({ type: 'Programme', title: p.title, href: `/championship-team/programmes/${p.slug}`, excerpt: p.shortDescription })),
    ...drivers.docs.map((d) => ({ type: 'Driver', title: d.name, href: `/championship-team/drivers/${d.slug}`, excerpt: d.shortBio })),
    ...events.docs.map((e) => ({ type: 'Event', title: e.title, href: `/championship-team/events/${e.slug}`, excerpt: e.summary })),
    ...articles.docs.map((a) => ({ type: 'News', title: a.title, href: `/championship-team/news/${a.slug}`, excerpt: a.standfirst })),
    ...faqs.docs.map((f) => ({ type: 'FAQ', title: f.question, href: `/championship-team/faqs#${f.category}`, excerpt: f.answer })),
    ...STATIC_PAGES.filter((p) => p.title.toLowerCase().includes(ql) || p.excerpt?.toLowerCase().includes(ql)),
  ]
}
