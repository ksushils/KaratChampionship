import type { Access, CollectionConfig, Where } from 'payload'
import { isAdmin, userDivisions, userRoles } from '../access/roles'
import { auditAfterChange } from '../hooks/audit'

/**
 * Record-level access (CMS-08/09, LEAD acceptance, #11, #24, #34).
 * - admin: everything
 * - commercial: race-programme, partnership, hospitality, general — within their divisions
 * - media: media enquiries
 * - everybody else (incl. recruiter, race-data editor, public): nothing
 * Safeguarding enquiries are admin-only.
 */
export const enquiryAccess: Access = ({ req }) => {
  const user = req.user as never
  if (!user) return false
  if (isAdmin(user)) return true
  const r = userRoles(user)
  const cats: string[] = []
  if (r.includes('commercial')) cats.push('race-programme', 'partnership', 'hospitality', 'general', 'testing', 'championship-organisation')
  if (r.includes('media')) cats.push('media')
  if (!cats.length) return false
  const where: Where = { and: [{ category: { in: cats } }, { division: { in: userDivisions(user) } }] }
  return where
}

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    group: 'Leads',
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'category', 'division', 'status', 'assignedTo', 'createdAt'],
    listSearchableFields: ['reference', 'email', 'name', 'organisation'],
  },
  access: { read: enquiryAccess, update: enquiryAccess, create: () => false, delete: ({ req }) => isAdmin(req.user as never) },
  hooks: { afterChange: [auditAfterChange] },
  fields: [
    { name: 'reference', type: 'text', required: true, unique: true, index: true, admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        { name: 'division', type: 'select', required: true, index: true, options: ['championship-team', 'testing', 'championship-organisation'], admin: { readOnly: true } },
        {
          name: 'category',
          type: 'select',
          required: true,
          index: true,
          options: ['race-programme', 'partnership', 'hospitality', 'media', 'testing', 'championship-organisation', 'safeguarding', 'general'],
          admin: { readOnly: true },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'status', type: 'select', defaultValue: 'new', index: true, options: ['new', 'assigned', 'contacted', 'qualified', 'proposal', 'converted', 'closed'] },
        { name: 'assignedTo', type: 'relationship', relationTo: 'users' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Contact',
      fields: [
        { type: 'row', fields: [{ name: 'name', type: 'text', required: true }, { name: 'email', type: 'email', required: true }] },
        { type: 'row', fields: [{ name: 'phone', type: 'text' }, { name: 'country', type: 'text' }, { name: 'organisation', type: 'text' }] },
        { name: 'role', type: 'text', admin: { description: 'Enquirer role (driver, parent/guardian, manager…)' } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Context',
      fields: [
        { type: 'row', fields: [{ name: 'programme', type: 'text' }, { name: 'season', type: 'text' }, { name: 'ageBand', type: 'text' }] },
        { name: 'involvesMinor', type: 'checkbox', defaultValue: false, admin: { readOnly: true, description: 'Restricted handling — safeguarding policy applies.' } },
        { name: 'message', type: 'textarea' },
        { name: 'details', type: 'json', admin: { description: 'Category-specific answers.' } },
        { name: 'sourcePage', type: 'text' },
        { name: 'campaign', type: 'text' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Privacy',
      fields: [
        { name: 'marketingOptIn', type: 'checkbox', defaultValue: false, admin: { readOnly: true, description: 'Separate from enquiry processing (LEAD-20).' } },
        { name: 'privacyNoticeVersion', type: 'text', admin: { readOnly: true } },
        { name: 'retentionUntil', type: 'date' },
      ],
    },
    { name: 'internalNotes', type: 'array', fields: [{ name: 'at', type: 'date', defaultValue: () => new Date().toISOString() }, { name: 'note', type: 'textarea', required: true }] },
    { name: 'idempotencyKey', type: 'text', unique: true, index: true, admin: { hidden: true } },
  ],
}
