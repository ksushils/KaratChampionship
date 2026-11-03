import type { CollectionConfig } from 'payload'
import { approvedOrStaff, publishedOrStaff, roles } from '../access/roles'
import { demoField, linkArray, seoFields, substantiationFields } from '../fields/common'
import { slugField } from '../fields/slug'
import { auditAfterChange, auditAfterDelete } from '../hooks/audit'
import { requireMinorConsent } from '../hooks/approval'
import { slugRedirect } from '../hooks/redirects'

export const Drivers: CollectionConfig = {
  slug: 'drivers',
  admin: { group: 'Racing', useAsTitle: 'name', defaultColumns: ['name', 'nationality', 'announceAt', '_status'] },
  // DRV-13 / acceptance #12: embargoed drivers are invisible to every public channel via access control.
  access: { read: publishedOrStaff(['editor', 'raceData', 'media', 'commercial'], 'announceAt'), create: roles('editor'), update: roles('editor', 'raceData'), delete: roles() },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 50 },
  hooks: {
    beforeChange: [requireMinorConsent],
    afterChange: [auditAfterChange, slugRedirect((s) => `/championship-team/drivers/${s}`)],
    afterDelete: [auditAfterDelete],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'nationality', type: 'text' },
            { name: 'portrait', type: 'upload', relationTo: 'media' },
            { name: 'shortBio', type: 'textarea' },
            { name: 'bio', type: 'richText' },
            {
              name: 'careerTimeline',
              type: 'array',
              fields: [
                { type: 'row', fields: [{ name: 'year', type: 'number', required: true }, { name: 'category', type: 'text', required: true }, { name: 'team', type: 'text' }] },
                { name: 'notes', type: 'text' },
                { name: 'source', type: 'relationship', relationTo: 'sources' },
              ],
            },
            {
              name: 'stats',
              type: 'array',
              admin: { description: 'Sourced statistics with explicit scope (DRV-06).' },
              fields: [
                { type: 'row', fields: [{ name: 'label', type: 'text', required: true }, { name: 'value', type: 'text', required: true }, { name: 'scope', type: 'text', required: true }] },
                { name: 'source', type: 'relationship', relationTo: 'sources' },
              ],
            },
            linkArray('socialLinks', 'Approved social accounts (DRV-10)'),
            {
              name: 'driverPartners',
              type: 'array',
              admin: { description: 'Personal sponsors — shown separately from team partners (DRV-11).' },
              fields: [{ name: 'name', type: 'text', required: true }, { name: 'url', type: 'text' }],
            },
          ],
        },
        {
          label: 'Safeguarding',
          description: 'Never enter home addresses, private contact details or full dates of birth (DRV-15).',
          fields: [
            { name: 'isMinor', type: 'checkbox', defaultValue: false, admin: { description: 'Under 18 at time of publication.' } },
            {
              name: 'safeguarding',
              type: 'group',
              admin: { condition: (d) => Boolean(d?.isMinor) },
              fields: [
                { name: 'guardianConsentRecorded', type: 'checkbox' },
                { name: 'mediaConsentRecorded', type: 'checkbox' },
                { name: 'consentReference', type: 'text', admin: { description: 'Where the signed consent is held (not the document itself).' } },
              ],
            },
          ],
        },
        {
          label: 'Publishing',
          fields: [
            { name: 'announceAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' }, description: 'Embargo: hidden from site, search, sitemap and API until this time.' } },
            { name: 'alumni', type: 'select', defaultValue: 'none', options: [{ label: 'Current/not alumni', value: 'none' }, { label: 'Former Karat Racing driver', value: 'karat' }, { label: 'Predecessor (KIC Motorsport) association', value: 'kic' }] },
            seoFields,
          ],
        },
      ],
    },
    slugField('name'),
    demoField,
  ],
}

export const DriverEngagements: CollectionConfig = {
  slug: 'driver-engagements',
  admin: { group: 'Racing', useAsTitle: 'label', defaultColumns: ['label', 'season', 'number', 'announceAt'] },
  access: { read: publishedOrStaff(['editor', 'raceData', 'media', 'commercial'], 'announceAt'), create: roles('editor', 'raceData'), update: roles('editor', 'raceData'), delete: roles() },
  versions: { drafts: true },
  hooks: {
    afterChange: [auditAfterChange],
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        const m = { ...originalDoc, ...data }
        const d = m.driver ? await req.payload.findByID({ collection: 'drivers', id: typeof m.driver === 'object' ? m.driver.id : m.driver, depth: 0, req, overrideAccess: true, draft: true }) : null
        data.label = `${d?.name ?? 'Driver'} — ${m.season}${m.number ? ` #${m.number}` : ''}`
        return data
      },
    ],
  },
  fields: [
    { name: 'label', type: 'text', admin: { readOnly: true } },
    { name: 'driver', type: 'relationship', relationTo: 'drivers', required: true, index: true },
    { name: 'programme', type: 'relationship', relationTo: 'programmes', required: true },
    { name: 'season', type: 'number', required: true, index: true },
    { name: 'number', type: 'text', admin: { description: 'Season-specific racing number — not a permanent identifier.' } },
    { type: 'row', fields: [{ name: 'startDate', type: 'date' }, { name: 'endDate', type: 'date' }] },
    { name: 'announceAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
    demoField,
  ],
}

export const People: CollectionConfig = {
  slug: 'people',
  admin: { group: 'Team', useAsTitle: 'name', defaultColumns: ['name', 'role', 'department', 'approvedForPublication'] },
  access: { read: approvedOrStaff(['editor']), create: roles('editor'), update: roles('editor'), delete: roles() },
  hooks: { afterChange: [auditAfterChange], afterDelete: [auditAfterDelete] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'department', type: 'select', defaultValue: 'leadership', options: ['leadership', 'engineering', 'mechanics', 'coaching', 'operations', 'commercial'] },
    { name: 'bio', type: 'textarea' },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    linkArray('links'),
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'approvedForPublication', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    demoField,
  ],
}

export const Facilities: CollectionConfig = {
  slug: 'facilities',
  admin: { group: 'Team', useAsTitle: 'name' },
  access: { read: approvedOrStaff(['editor']), create: roles('editor'), update: roles('editor'), delete: roles() },
  hooks: { afterChange: [auditAfterChange] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'location', type: 'text' },
    {
      name: 'ownership',
      type: 'select',
      required: true,
      options: [
        { label: 'Owned by Karat Racing', value: 'owned' },
        { label: 'Operated by Karat Racing', value: 'operated' },
        { label: 'Partner-provided', value: 'partner' },
      ],
    },
    { name: 'partnerName', type: 'text', admin: { condition: (_, s) => s?.ownership === 'partner' } },
    { name: 'capabilities', type: 'text', hasMany: true },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'approvedForPublication', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    substantiationFields,
  ],
}

export const HeritageMilestones: CollectionConfig = {
  slug: 'heritage-milestones',
  admin: { group: 'Team', useAsTitle: 'title', defaultColumns: ['title', 'year', 'entity', 'approvedForPublication'] },
  access: { read: approvedOrStaff(['editor']), create: roles('editor'), update: roles('editor'), delete: roles() },
  hooks: {
    afterChange: [auditAfterChange],
    beforeChange: [
      ({ data, originalDoc }) => {
        const m = { ...originalDoc, ...data }
        if (m.approvedForPublication && !m.substantiation?.sources?.length) throw new Error('Heritage milestones need a source before approval (TEAM-02).')
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { type: 'row', fields: [{ name: 'year', type: 'number', required: true }, { name: 'date', type: 'date' }, { name: 'season', type: 'text' }] },
    {
      name: 'entity',
      type: 'select',
      required: true,
      options: [
        { label: 'Karat Racing', value: 'karat' },
        { label: 'KIC Motorsport', value: 'kic' },
        { label: 'Other approved entity', value: 'other' },
      ],
      admin: { description: 'Every achievement is attributed to a named entity (TEAM-04).' },
    },
    { name: 'entityName', type: 'text', admin: { condition: (_, s) => s?.entity === 'other' } },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'approvedForPublication', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    substantiationFields,
  ],
}
