import type { Where } from 'payload'

/** Partner rights logic (SPON-05, SPON-06, acceptance #22). */
export interface PartnershipLike {
  startDate?: string | null
  endDate?: string | null
  publicationApproved?: boolean | null
  logoApproved?: boolean | null
}

export function isCurrentPartnership(p: PartnershipLike, now = new Date()): boolean {
  if (!p.publicationApproved) return false
  const t = now.getTime()
  if (p.startDate && new Date(p.startDate).getTime() > t) return false
  if (p.endDate && new Date(p.endDate).getTime() + 86_400_000 <= t) return false
  return true
}

export const TIER_ORDER = ['title', 'principal', 'official', 'technical', 'supplier', 'other'] as const

export function sortByHierarchy<T extends { tier?: string | null; displayOrder?: number | null }>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const ta = TIER_ORDER.indexOf((a.tier ?? 'other') as (typeof TIER_ORDER)[number])
    const tb = TIER_ORDER.indexOf((b.tier ?? 'other') as (typeof TIER_ORDER)[number])
    return ta - tb || (a.displayOrder ?? 999) - (b.displayOrder ?? 999)
  })
}

/** Where-clause for currently valid, approved partnerships. */
export const currentPartnershipWhere = (now = new Date()): Where => {
  const iso = now.toISOString()
  const dayAgo = new Date(now.getTime() - 86_400_000).toISOString()
  return {
    and: [
      { publicationApproved: { equals: true } },
      { or: [{ startDate: { exists: false } }, { startDate: { less_than_equal: iso } }] },
      { or: [{ endDate: { exists: false } }, { endDate: { greater_than: dayAgo } }] },
    ],
  }
}
