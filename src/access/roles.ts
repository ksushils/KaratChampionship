import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

export const ROLES = [
  { label: 'Administrator', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Race-data editor', value: 'raceData' },
  { label: 'Commercial manager', value: 'commercial' },
  { label: 'Media manager', value: 'media' },
  { label: 'Recruiter', value: 'recruiter' },
] as const
export type Role = (typeof ROLES)[number]['value']

export const DIVISION_KEYS = ['championship-team', 'testing', 'championship-organisation'] as const
export type DivisionKey = (typeof DIVISION_KEYS)[number]

type UserLike = { roles?: Role[] | null; divisions?: DivisionKey[] | null; collection?: string } | null | undefined

export const userRoles = (user: UserLike): Role[] => (user && Array.isArray(user.roles) ? user.roles : [])
export const hasRole = (user: UserLike, ...roles: Role[]) => {
  const r = userRoles(user)
  return r.includes('admin') || roles.some((x) => r.includes(x))
}
export const isAdmin = (user: UserLike) => userRoles(user).includes('admin')
export const userDivisions = (user: UserLike): DivisionKey[] =>
  isAdmin(user) ? [...DIVISION_KEYS] : user?.divisions?.length ? user.divisions : ['championship-team']

const u = (req: PayloadRequest) => req.user as unknown as UserLike

/** Collection access: any of the listed roles (admin always). */
export const roles =
  (...r: Role[]): Access =>
  ({ req }) =>
    hasRole(u(req), ...r)

export const adminOnly: Access = ({ req }) => isAdmin(u(req))
export const authenticated: Access = ({ req }) => Boolean(req.user)
export const anyone: Access = () => true
export const nobody: Access = () => false

export const fieldRoles =
  (...r: Role[]): FieldAccess =>
  ({ req }) =>
    hasRole(u(req), ...r)

/**
 * Public read for draft-enabled content: published only, and not before its embargo time.
 * Staff with an editorial role see everything (needed for previews and the admin panel).
 */
export const publishedOrStaff =
  (staffRoles: Role[], embargoField?: string): Access =>
  ({ req }) => {
    if (req.user && hasRole(u(req), ...staffRoles)) return true
    const now = new Date().toISOString()
    const and: Where[] = [{ _status: { equals: 'published' } }]
    if (embargoField) {
      and.push({ or: [{ [embargoField]: { exists: false } }, { [embargoField]: { less_than_equal: now } }] })
    }
    return { and }
  }

/** Public read for non-draft content gated by an approval checkbox. */
export const approvedOrStaff =
  (staffRoles: Role[], field = 'approvedForPublication'): Access =>
  ({ req }) => {
    if (req.user && hasRole(u(req), ...staffRoles)) return true
    return { [field]: { equals: true } }
  }
