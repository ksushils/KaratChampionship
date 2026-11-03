import type { Where } from 'payload'

/** Media usage-rights rules (MEDIA-06, MEDIA-07, acceptance #23). */
export interface RightsLike {
  rightsExpiresAt?: string | null
  publicUseApproved?: boolean | null
  downloadPermitted?: boolean | null
}
export const rightsValid = (m: RightsLike, now = new Date()) =>
  Boolean(m.publicUseApproved) && (!m.rightsExpiresAt || new Date(m.rightsExpiresAt).getTime() > now.getTime())
export const canDownload = (m: RightsLike, now = new Date()) => rightsValid(m, now) && Boolean(m.downloadPermitted)

export const publicMediaWhere = (now = new Date()): Where => ({
  and: [
    { publicUseApproved: { equals: true } },
    { or: [{ rightsExpiresAt: { exists: false } }, { rightsExpiresAt: { greater_than: now.toISOString() } }] },
  ],
})
