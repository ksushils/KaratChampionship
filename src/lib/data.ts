import 'server-only'
import type { CollectionSlug, Where } from 'payload'
import { cache } from 'react'
import { payloadClient } from './payload'
import { currentPartnershipWhere, sortByHierarchy } from './partners'
import type {
  Article,
  Division,
  Driver,
  DriverEngagement,
  Event,
  Faq,
  Partnership,
  Programme,
  ProgrammeSeason,
  ResultSet,
  Session,
  Standing,
} from '@/payload-types'

/**
 * All public reads go through here with overrideAccess:false and NO user, so collection
 * access control (embargo, publication, rights expiry, approval) is enforced for every
 * public channel: pages, search, sitemap, feeds (UTIL-07, acceptance #12, #28).
 */
export async function publicFind<T = unknown>(collection: CollectionSlug, opts: { where?: Where; sort?: string; limit?: number; depth?: number; page?: number } = {}) {
  const payload = await payloadClient()
  const res = await payload.find({ collection, overrideAccess: false, depth: opts.depth ?? 1, limit: opts.limit ?? 100, sort: opts.sort, where: opts.where, page: opts.page })
  return res as unknown as { docs: T[]; totalDocs: number; totalPages: number; page?: number }
}

export async function publicFindOne<T = unknown>(collection: CollectionSlug, where: Where, depth = 2): Promise<T | null> {
  const r = await publicFind<T>(collection, { where, limit: 1, depth })
  return r.docs[0] ?? null
}

export const getSettings = cache(async () => {
  const payload = await payloadClient()
  const [site, flags, team] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 0 }),
    payload.findGlobal({ slug: 'feature-flags', depth: 0 }),
    payload.findGlobal({ slug: 'team-content', depth: 1 }),
  ])
  return { site, flags, team }
})

export const getDivisions = cache(async () => (await publicFind<Division>('divisions', { sort: 'order', depth: 1 })).docs)
export const getDivision = async (key: string) => (await getDivisions()).find((d) => d.key === key) ?? null

export const getProgrammes = cache(async () => (await publicFind<Programme>('programmes', { sort: 'order', depth: 2 })).docs)
export const getProgramme = async (slug: string) => publicFindOne<Programme>('programmes', { slug: { equals: slug } }, 2)
export const getProgrammeSeasons = async (programmeId: number) =>
  (await publicFind<ProgrammeSeason>('programme-seasons', { where: { programme: { equals: programmeId } }, sort: '-year', depth: 1 })).docs

export const getEvents = cache(async (where?: Where) => (await publicFind<Event>('events', { where, sort: 'startDate', depth: 2, limit: 500 })).docs)
export const getEvent = async (slug: string) => publicFindOne<Event>('events', { slug: { equals: slug } }, 2)
export const getSessionsFor = async (eventIds: (number | string)[]) =>
  eventIds.length ? (await publicFind<Session>('sessions', { where: { event: { in: eventIds } }, sort: 'startsAt', depth: 0, limit: 500 })).docs : []

export const getDrivers = cache(async () => (await publicFind<Driver>('drivers', { sort: 'name', depth: 1 })).docs)
export const getDriver = async (slug: string) => publicFindOne<Driver>('drivers', { slug: { equals: slug } }, 2)
export const getEngagements = cache(async (where?: Where) => (await publicFind<DriverEngagement>('driver-engagements', { where, sort: '-season', depth: 2, limit: 500 })).docs)

export const getArticles = async (opts: { where?: Where; limit?: number; page?: number } = {}) =>
  publicFind<Article>('articles', { where: opts.where, sort: '-publishedAt', depth: 1, limit: opts.limit ?? 12, page: opts.page })

export const getResultSets = async (where?: Where) => (await publicFind<ResultSet>('result-sets', { where, sort: '-createdAt', depth: 2, limit: 200 })).docs
export const getStandings = async (where?: Where) => (await publicFind<Standing>('standings', { where, sort: '-season', depth: 1, limit: 50 })).docs

export const getFaqs = async (category?: string | string[], programmeId?: number) => {
  const and: Where[] = []
  if (category) and.push({ category: Array.isArray(category) ? { in: category } : { equals: category } })
  if (programmeId) and.push({ programmes: { contains: programmeId } })
  return (await publicFind<Faq>('faqs', { where: and.length ? { and } : undefined, sort: 'order', depth: 0 })).docs
}

export const getCurrentPartnerships = cache(async () => {
  const docs = (await publicFind<Partnership>('partnerships', { where: currentPartnershipWhere(), depth: 2 })).docs
  // Partner itself must also be publicly approved (access drops unapproved relations to IDs).
  return sortByHierarchy(docs.filter((p) => typeof p.partner === 'object' && p.partner))
})

export const relId = (v: unknown): number | string | null => (v && typeof v === 'object' ? ((v as { id: number }).id ?? null) : ((v as number) ?? null))
