import type { CollectionConfig } from 'payload'
import { anyone, publishedOrStaff, roles } from '../access/roles'
import { demoField, seoFields } from '../fields/common'
import { slugField } from '../fields/slug'
import { auditAfterChange, auditAfterDelete } from '../hooks/audit'
import { requireApprovalToPublish } from '../hooks/approval'
import { slugRedirect } from '../hooks/redirects'
import { editorialStatus } from './Racing'

export const ARTICLE_TYPES = [
  { label: 'Announcement', value: 'announcement' },
  { label: 'Race preview', value: 'preview' },
  { label: 'Race report', value: 'report' },
  { label: 'Interview', value: 'interview' },
  { label: 'Feature', value: 'feature' },
  { label: 'Partnership', value: 'partnership' },
  { label: 'Team update', value: 'team-update' },
]

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: { group: 'Editorial', useAsTitle: 'title', defaultColumns: ['title', 'type', 'publishedAt', 'editorialStatus', '_status'] },
  access: { read: publishedOrStaff(['editor', 'media', 'commercial', 'raceData'], 'publishedAt'), create: roles('editor', 'media'), update: roles('editor', 'media'), delete: roles() },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 50 },
  hooks: {
    beforeChange: [
      requireApprovalToPublish,
      ({ data, originalDoc }) => {
        if (data._status === 'published' && !data.publishedAt && !originalDoc?.publishedAt) data.publishedAt = new Date().toISOString()
        return data
      },
    ],
    afterChange: [auditAfterChange, slugRedirect((s) => `/championship-team/news/${s}`)],
    afterDelete: [auditAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { type: 'row', fields: [{ name: 'type', type: 'select', required: true, defaultValue: 'team-update', options: ARTICLE_TYPES }, { name: 'author', type: 'text' }] },
    { name: 'standfirst', type: 'textarea', maxLength: 300 },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' }, description: 'Embargo / publication time (stored in UTC; shown in your browser time).' },
    },
    editorialStatus,
    { name: 'season', type: 'number', index: true, admin: { position: 'sidebar' } },
    { name: 'programmes', type: 'relationship', relationTo: 'programmes', hasMany: true },
    { name: 'drivers', type: 'relationship', relationTo: 'drivers', hasMany: true },
    { name: 'events', type: 'relationship', relationTo: 'events', hasMany: true },
    { name: 'partners', type: 'relationship', relationTo: 'partners', hasMany: true },
    {
      name: 'corrections',
      type: 'array',
      admin: { description: 'Public correction notes (NEWS-09).' },
      fields: [{ name: 'date', type: 'date', required: true }, { name: 'note', type: 'text', required: true }],
    },
    seoFields,
    demoField,
  ],
}

export const MediaCollections: CollectionConfig = {
  slug: 'media-collections',
  admin: { group: 'Media', useAsTitle: 'title' },
  access: { read: publishedOrStaff(['media', 'editor']), create: roles('media', 'editor'), update: roles('media', 'editor'), delete: roles('media') },
  versions: { drafts: true },
  hooks: { afterChange: [auditAfterChange, slugRedirect((s) => `/championship-team/media/${s}`)] },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { name: 'description', type: 'textarea' },
    { name: 'season', type: 'number', index: true },
    { name: 'programme', type: 'relationship', relationTo: 'programmes' },
    { name: 'event', type: 'relationship', relationTo: 'events' },
    { name: 'drivers', type: 'relationship', relationTo: 'drivers', hasMany: true },
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'videos',
      type: 'array',
      admin: { description: 'Authorised video only (MEDIA-04). Embeds load after media-embed consent.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'provider', type: 'select', defaultValue: 'youtube', options: ['youtube', 'vimeo', 'link'] },
        { name: 'captionsAvailable', type: 'checkbox' },
      ],
    },
    demoField,
  ],
}

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: { group: 'Commercial', useAsTitle: 'name' },
  access: {
    // Public only sees partners with logo/publication approval (SPON-16).
    read: ({ req }) => (req.user && (req.user as any).roles?.some((r: string) => ['admin', 'commercial', 'editor'].includes(r)) ? true : { publicationApproved: { equals: true } }),
    create: roles('commercial'),
    update: roles('commercial'),
    delete: roles(),
  },
  hooks: { afterChange: [auditAfterChange, slugRedirect((s) => `/championship-team/partners/${s}`)] },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'textarea' },
    { name: 'website', type: 'text' },
    { name: 'publicationApproved', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Logo and name approved for public display.' } },
    demoField,
  ],
}

export const Partnerships: CollectionConfig = {
  slug: 'partnerships',
  admin: { group: 'Commercial', useAsTitle: 'label', defaultColumns: ['label', 'tier', 'startDate', 'endDate', 'publicationApproved'] },
  access: {
    read: ({ req }) => (req.user && (req.user as any).roles?.some((r: string) => ['admin', 'commercial', 'editor'].includes(r)) ? true : { publicationApproved: { equals: true } }),
    create: roles('commercial'),
    update: roles('commercial'),
    delete: roles(),
  },
  hooks: {
    afterChange: [auditAfterChange],
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        const m = { ...originalDoc, ...data }
        if (m.partner) {
          const p = await req.payload.findByID({ collection: 'partners', id: typeof m.partner === 'object' ? m.partner.id : m.partner, depth: 0, req, overrideAccess: true })
          data.label = `${p?.name} — ${m.tier}`
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'label', type: 'text', admin: { readOnly: true } },
    { name: 'partner', type: 'relationship', relationTo: 'partners', required: true },
    { name: 'tier', type: 'select', required: true, defaultValue: 'official', options: ['title', 'principal', 'official', 'technical', 'supplier', 'other'] },
    { name: 'scope', type: 'select', defaultValue: 'team', options: ['team', 'programme', 'driver'] },
    { name: 'programme', type: 'relationship', relationTo: 'programmes', admin: { condition: (_, s) => s?.scope === 'programme' } },
    { name: 'driver', type: 'relationship', relationTo: 'drivers', admin: { condition: (_, s) => s?.scope === 'driver' } },
    { name: 'season', type: 'number' },
    { type: 'row', fields: [{ name: 'startDate', type: 'date' }, { name: 'endDate', type: 'date', admin: { description: 'After this date the partner is shown as historical, not current.' } }] },
    { name: 'publicationApproved', type: 'checkbox', defaultValue: false },
    { name: 'rightsNotes', type: 'textarea' },
    { name: 'displayOrder', type: 'number', defaultValue: 0 },
    demoField,
  ],
}

export const Vacancies: CollectionConfig = {
  slug: 'vacancies',
  admin: { group: 'People & Careers', useAsTitle: 'title', defaultColumns: ['title', 'discipline', 'location', 'closingDate', '_status'] },
  access: { read: publishedOrStaff(['recruiter', 'editor']), create: roles('recruiter'), update: roles('recruiter'), delete: roles('recruiter') },
  versions: { drafts: true },
  hooks: { afterChange: [auditAfterChange, slugRedirect((s) => `/championship-team/careers/${s}`)] },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { type: 'row', fields: [{ name: 'discipline', type: 'select', options: ['engineering', 'mechanical', 'operations', 'commercial', 'media', 'coaching', 'other'] }, { name: 'location', type: 'text' }, { name: 'contractType', type: 'select', options: ['full-time', 'part-time', 'contract', 'seasonal', 'internship'] }] },
    { name: 'summary', type: 'textarea' },
    { name: 'responsibilities', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'requirements', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'closingDate', type: 'date' },
    { name: 'applicationMode', type: 'select', defaultValue: 'form', options: ['form', 'external'] },
    { name: 'externalUrl', type: 'text', admin: { condition: (_, s) => s?.applicationMode === 'external' } },
    { name: 'internshipEligibility', type: 'textarea', admin: { condition: (_, s) => s?.contractType === 'internship', description: 'Owner-approved eligibility wording (JOB-09). Required for internships.' } },
    { name: 'closed', type: 'checkbox', defaultValue: false },
    demoField,
  ],
}

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: { group: 'People & Careers', useAsTitle: 'reference', defaultColumns: ['reference', 'vacancy', 'status', 'createdAt'] },
  // JOB-08 / acceptance #34: recruiters and admins only. Never public.
  access: { read: roles('recruiter'), create: () => false, update: roles('recruiter'), delete: roles('recruiter') },
  hooks: { afterChange: [auditAfterChange] },
  fields: [
    { name: 'reference', type: 'text', unique: true, index: true },
    { name: 'vacancy', type: 'relationship', relationTo: 'vacancies' },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'country', type: 'text' },
    { name: 'coverNote', type: 'textarea' },
    { name: 'profileLink', type: 'text' },
    { name: 'cv', type: 'upload', relationTo: 'cv-uploads' },
    { name: 'status', type: 'select', defaultValue: 'new', options: ['new', 'reviewing', 'interview', 'offer', 'rejected', 'withdrawn'] },
    { name: 'retentionUntil', type: 'date' },
    { name: 'idempotencyKey', type: 'text', unique: true, admin: { hidden: true } },
  ],
}

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: { group: 'Editorial', useAsTitle: 'question', defaultColumns: ['question', 'category', 'published'] },
  access: { read: ({ req }) => (req.user ? true : { published: { equals: true } }), create: roles('editor'), update: roles('editor'), delete: roles('editor') },
  hooks: { afterChange: [auditAfterChange] },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    { name: 'category', type: 'select', required: true, options: ['programmes', 'driver-enquiries', 'sponsorship', 'logistics', 'general', 'testing', 'championship-organisation', 'careers', 'media'] },
    { name: 'programmes', type: 'relationship', relationTo: 'programmes', hasMany: true },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'published', type: 'checkbox', defaultValue: true },
  ],
}

export const LiveUpdates: CollectionConfig = {
  slug: 'live-updates',
  admin: { group: 'Racing', useAsTitle: 'text', defaultColumns: ['postedAt', 'event', 'text'] },
  access: { read: anyone, create: roles('raceData', 'media'), update: roles('raceData', 'media'), delete: roles('raceData') },
  fields: [
    { name: 'event', type: 'relationship', relationTo: 'events', required: true },
    { name: 'postedAt', type: 'date', required: true, defaultValue: () => new Date().toISOString(), admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'text', type: 'textarea', required: true, maxLength: 600 },
    { name: 'author', type: 'text' },
  ],
}
