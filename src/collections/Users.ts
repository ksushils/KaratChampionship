import type { CollectionConfig } from 'payload'
import { DIVISION_KEYS, ROLES, adminOnly, isAdmin } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', group: 'Governance', defaultColumns: ['email', 'name', 'roles', 'divisions'], description: 'Privileged accounts must be protected by MFA at the identity layer before launch (see SECURITY.md).' },
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8h session expiry
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    cookies: { secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' },
  },
  access: {
    // Users can read/update themselves; only admins manage others (CMS-07/08).
    read: ({ req }) => (isAdmin(req.user as never) ? true : req.user ? { id: { equals: req.user.id } } : false),
    create: adminOnly,
    update: ({ req }) => (isAdmin(req.user as never) ? true : req.user ? { id: { equals: req.user.id } } : false),
    delete: adminOnly,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: ROLES.map((r) => ({ label: r.label, value: r.value })),
      access: { update: ({ req }) => isAdmin(req.user as never), create: ({ req }) => isAdmin(req.user as never) },
      saveToJWT: true,
    },
    {
      name: 'divisions',
      type: 'select',
      hasMany: true,
      defaultValue: ['championship-team'],
      options: DIVISION_KEYS.map((d) => ({ label: d, value: d })),
      admin: { description: 'Business divisions this user may act for (CMS-09).' },
      access: { update: ({ req }) => isAdmin(req.user as never), create: ({ req }) => isAdmin(req.user as never) },
      saveToJWT: true,
    },
  ],
}
