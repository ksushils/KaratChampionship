import type { CollectionConfig, Field } from 'payload'
import { anyone, approvedOrStaff, publishedOrStaff, roles } from '../access/roles'
import { PROGRAMME_STATUS, demoField, linkArray, seoFields, substantiationFields } from '../fields/common'
import { slugField } from '../fields/slug'
import { auditAfterChange, auditAfterDelete } from '../hooks/audit'
import { slugRedirect } from '../hooks/redirects'
import { requireApprovalToPublish } from '../hooks/approval'
import { isValidTimeZone } from '../lib/time'

const audit = { afterChange: [auditAfterChange], afterDelete: [auditAfterDelete] }
const editorialStatus: Field = {
  name: 'editorialStatus',
  type: 'select',
  defaultValue: 'draft',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'In review', value: 'in-review' },
    { label: 'Approved', value: 'approved' },
    { label: 'Archived', value: 'archived' },
  ],
  admin: { position: 'sidebar', description: 'Only administrators can approve. Publishing requires approval.' },
  access: {
    update: ({ req, data, siblingData }) => {
      const roles = (req.user as { roles?: string[] } | null)?.roles ?? []
      if (roles.includes('admin')) return true
      const v = (siblingData ?? data)?.editorialStatus
      return v !== 'approved'
    },
  },
}
export { editorialStatus }

export const Divisions: CollectionConfig = {
  slug: 'divisions',
  admin: { group: 'Structure', useAsTitle: 'name', defaultColumns: ['name', 'status', 'enabled', 'order'] },
  access: { read: anyone, create: roles(), update: roles(), delete: roles() },
  hooks: audit,
  fields: [
    { name: 'key', type: 'select', required: true, unique: true, options: ['championship-team', 'testing', 'championship-organisation'] },
    { name: 'name', type: 'text', required: true },
    { name: 'pathwayLabel', type: 'text', admin: { description: 'Gateway pathway label, e.g. "Race with Karat".' } },
    { name: 'tagline', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'planned',
      options: [
        { label: 'Planned', value: 'planned' },
        { label: 'Enquiries open', value: 'enquiries-open' },
        { label: 'Launching soon', value: 'launching-soon' },
        { label: 'Operational', value: 'operational' },
      ],
    },
    { name: 'enabled', type: 'checkbox', defaultValue: true, admin: { description: 'Owner kill-switch: hide this business from the public site (CMS-20).' } },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'routingEmail', type: 'email', admin: { description: 'Enquiry notifications for this division. Overrides site defaults.' } },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}

export const Championships: CollectionConfig = {
  slug: 'championships',
  admin: { group: 'Racing', useAsTitle: 'name' },
  access: { read: anyone, create: roles('editor', 'raceData'), update: roles('editor', 'raceData'), delete: roles() },
  hooks: audit,
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'shortName', type: 'text' },
    { name: 'aliases', type: 'text', hasMany: true, admin: { description: 'Historic / alternative names for search (SEO-10), e.g. FRECA.' } },
    { name: 'officialUrl', type: 'text' },
    { name: 'organiser', type: 'text' },
    { name: 'geography', type: 'text' },
    { name: 'level', type: 'select', options: ['entry-single-seater', 'f4', 'national-f3', 'regional', 'fia-f3', 'fia-f2', 'formula-libre', 'other'] },
    { name: 'explainer', type: 'richText', admin: { description: 'Plain-language explanation for drivers and families (CHAMP-04).' } },
    substantiationFields,
  ],
}

export const ChampionshipSeasons: CollectionConfig = {
  slug: 'championship-seasons',
  admin: { group: 'Racing', useAsTitle: 'label', defaultColumns: ['label', 'championship', 'year'] },
  access: { read: anyone, create: roles('raceData', 'editor'), update: roles('raceData', 'editor'), delete: roles() },
  hooks: {
    ...audit,
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        const m = { ...originalDoc, ...data }
        if (m.championship && m.year) {
          const c = await req.payload.findByID({ collection: 'championships', id: typeof m.championship === 'object' ? m.championship.id : m.championship, depth: 0, req, overrideAccess: true })
          data.label = `${m.commercialName || c?.name} ${m.year}`
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'label', type: 'text', admin: { readOnly: true } },
    { name: 'championship', type: 'relationship', relationTo: 'championships', required: true },
    { name: 'year', type: 'number', required: true, min: 1990, max: 2100 },
    { name: 'commercialName', type: 'text', admin: { description: 'Season-specific title, e.g. "FIA Formula Regional European Championship" (not hard-coded).' } },
    {
      name: 'documents',
      type: 'array',
      admin: { description: 'Official regulations and notices (CHAMP-15).' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'publishedAt', type: 'date' },
      ],
    },
    {
      name: 'machinery',
      type: 'group',
      admin: { description: 'Verified per season (CHAMP-05/06). Leave blank if not verified.' },
      fields: [
        { type: 'row', fields: [{ name: 'chassis', type: 'text' }, { name: 'engine', type: 'text' }] },
        { type: 'row', fields: [{ name: 'gearbox', type: 'text' }, { name: 'tyres', type: 'text' }] },
        { name: 'safety', type: 'text' },
        { name: 'source', type: 'relationship', relationTo: 'sources' },
        { name: 'verifiedAt', type: 'date' },
      ],
    },
    {
      name: 'format',
      type: 'array',
      admin: { description: 'Weekend structure: practice, qualifying (groups), qualifying races, heats, races, finals (CHAMP-07).' },
      fields: [
        { name: 'element', type: 'text', required: true },
        { name: 'detail', type: 'text' },
      ],
    },
    {
      name: 'pointsSystem',
      type: 'group',
      fields: [
        { name: 'description', type: 'text' },
        { name: 'points', type: 'json', admin: { description: 'e.g. {"race":[30,26,22,...],"bestResults":16}' } },
        { name: 'source', type: 'relationship', relationTo: 'sources' },
      ],
    },
    { name: 'classes', type: 'text', hasMany: true, admin: { description: 'Official classifications, e.g. Rookie. Do not assume they exist (RES-04).' } },
    {
      name: 'eligibility',
      type: 'group',
      fields: [
        { name: 'summary', type: 'textarea' },
        { name: 'source', type: 'relationship', relationTo: 'sources' },
        { name: 'reviewedAt', type: 'date' },
      ],
    },
    { name: 'sourceVerifiedAt', type: 'date' },
  ],
}

export const Programmes: CollectionConfig = {
  slug: 'programmes',
  admin: { group: 'Racing', useAsTitle: 'title', defaultColumns: ['title', 'status', 'enabled', 'order'] },
  access: { read: approvedOrStaff(['editor', 'raceData', 'commercial'], 'enabled'), create: roles('editor'), update: roles('editor', 'commercial'), delete: roles() },
  hooks: { ...audit, afterChange: [auditAfterChange, slugRedirect((s) => `/championship-team/programmes/${s}`)] },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    { name: 'championship', type: 'relationship', relationTo: 'championships', required: true },
    { name: 'enabled', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Owner kill-switch (CMS-20).' } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'intended',
      options: PROGRAMME_STATUS,
      admin: { position: 'sidebar', description: '"Confirmed" requires an entry confirmation source (see Substantiation).' },
      validate: (v: unknown, { siblingData }: { siblingData: Record<string, any> }) => {
        if ((v === 'confirmed' || v === 'active') && !siblingData?.substantiation?.sources?.length)
          return 'Attach the entry-confirmation source before marking as Confirmed/Active.'
        return true
      },
    },
    {
      name: 'relationshipType',
      type: 'select',
      defaultValue: 'proposed-participant',
      options: [
        { label: 'Entrant', value: 'entrant' },
        { label: 'Technical operator', value: 'technical-operator' },
        { label: 'Driver-support provider', value: 'driver-support' },
        { label: 'Commercial partner', value: 'commercial-partner' },
        { label: 'Proposed participant', value: 'proposed-participant' },
        { label: 'Other approved relationship', value: 'other' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'shortDescription', type: 'textarea' },
    { name: 'overview', type: 'richText' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'comparison',
      type: 'group',
      admin: { description: 'Used by the programme comparison (PROG-03).' },
      fields: [
        { name: 'geography', type: 'text' },
        { name: 'developmentPurpose', type: 'text' },
        { name: 'support', type: 'text' },
      ],
    },
    { name: 'driverFit', type: 'textarea', admin: { description: 'Who the programme suits (PROG-07). Approved eligibility only.' } },
    { name: 'teamSupport', type: 'array', fields: [{ name: 'item', type: 'text', required: true }, { name: 'detail', type: 'text' }] },
    { name: 'inclusions', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    { name: 'exclusions', type: 'array', fields: [{ name: 'item', type: 'text', required: true }] },
    {
      name: 'seatAvailability',
      type: 'select',
      defaultValue: 'not-published',
      options: ['not-published', 'available', 'limited', 'full'],
    },
    {
      name: 'pricing',
      type: 'group',
      admin: { description: 'Default "Discuss your programme". Published prices need currency, tax basis and conditions (CHAMP-13).' },
      fields: [
        { name: 'mode', type: 'select', defaultValue: 'discuss', options: ['discuss', 'published'] },
        { name: 'amount', type: 'number' },
        { name: 'currency', type: 'select', options: ['GBP', 'EUR', 'INR', 'USD'] },
        { name: 'taxBasis', type: 'select', options: ['excl-vat', 'incl-vat', 'not-applicable'] },
        { name: 'conditions', type: 'textarea' },
      ],
      validate: (v: any) => (v?.mode === 'published' && (!v.amount || !v.currency || !v.taxBasis || !v.conditions) ? 'Published prices need amount, currency, tax basis and conditions.' : true),
    },
    linkArray('officialLinks', 'Official links (PROG-09)'),
    { name: 'brochure', type: 'upload', relationTo: 'media', admin: { description: 'Approved brochure (Enhancement).' } },
    substantiationFields,
    seoFields,
  ],
}

export const ProgrammeSeasons: CollectionConfig = {
  slug: 'programme-seasons',
  admin: { group: 'Racing', useAsTitle: 'label', defaultColumns: ['label', 'participationStatus', 'year'] },
  access: { read: anyone, create: roles('editor', 'raceData'), update: roles('editor', 'raceData', 'commercial'), delete: roles() },
  hooks: {
    ...audit,
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        const m = { ...originalDoc, ...data }
        if (m.programme && m.year) {
          const p = await req.payload.findByID({ collection: 'programmes', id: typeof m.programme === 'object' ? m.programme.id : m.programme, depth: 0, req, overrideAccess: true })
          data.label = `${p?.title} ${m.year}`
        }
        return data
      },
    ],
  },
  indexes: [{ fields: ['programme', 'year'], unique: true }],
  fields: [
    { name: 'label', type: 'text', admin: { readOnly: true } },
    { name: 'programme', type: 'relationship', relationTo: 'programmes', required: true },
    { name: 'year', type: 'number', required: true },
    { name: 'championshipSeason', type: 'relationship', relationTo: 'championship-seasons' },
    { name: 'participationStatus', type: 'select', defaultValue: 'intended', options: PROGRAMME_STATUS },
    { name: 'seatAvailability', type: 'select', defaultValue: 'not-published', options: ['not-published', 'available', 'limited', 'full'] },
    { name: 'relationshipType', type: 'text' },
    { name: 'notes', type: 'textarea' },
    demoField,
  ],
}

export const Circuits: CollectionConfig = {
  slug: 'circuits',
  admin: { group: 'Racing', useAsTitle: 'name' },
  access: { read: anyone, create: roles('raceData', 'editor'), update: roles('raceData', 'editor'), delete: roles() },
  hooks: audit,
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { type: 'row', fields: [{ name: 'country', type: 'text', required: true }, { name: 'locality', type: 'text' }] },
    {
      name: 'timeZone',
      type: 'text',
      required: true,
      admin: { description: 'IANA zone, e.g. Europe/Rome, Europe/London, Asia/Kolkata.' },
      validate: (v: unknown) => (isValidTimeZone(v as string) ? true : 'Enter a valid IANA time zone'),
    },
    { name: 'layouts', type: 'array', fields: [{ name: 'name', type: 'text', required: true }, { name: 'lengthKm', type: 'number' }, { name: 'diagram', type: 'upload', relationTo: 'media' }] },
    { name: 'description', type: 'textarea' },
    { name: 'officialUrl', type: 'text' },
    { name: 'source', type: 'relationship', relationTo: 'sources' },
  ],
}

const EVENT_STATUS = ['scheduled', 'provisional', 'postponed', 'cancelled', 'completed', 'revised']

export const Events: CollectionConfig = {
  slug: 'events',
  admin: { group: 'Racing', useAsTitle: 'title', defaultColumns: ['title', 'programme', 'startDate', 'status'] },
  access: { read: publishedOrStaff(['raceData', 'editor', 'commercial', 'media']), create: roles('raceData', 'editor'), update: roles('raceData', 'editor'), delete: roles() },
  versions: { drafts: true, maxPerDoc: 50 },
  hooks: {
    ...audit,
    afterChange: [auditAfterChange, slugRedirect((s) => `/championship-team/events/${s}`)],
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        const m = { ...originalDoc, ...data }
        if (!m.timeZone && m.circuit) {
          const c = await req.payload.findByID({ collection: 'circuits', id: typeof m.circuit === 'object' ? m.circuit.id : m.circuit, depth: 0, req, overrideAccess: true })
          data.timeZone = c?.timeZone
        }
        if (originalDoc && JSON.stringify(originalDoc.status) !== JSON.stringify(data.status ?? originalDoc.status)) data.revisedAt = new Date().toISOString()
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField('title'),
    {
      type: 'row',
      fields: [
        { name: 'type', type: 'select', defaultValue: 'race-weekend', options: ['race-weekend', 'official-test', 'launch', 'team-event'] },
        { name: 'status', type: 'select', defaultValue: 'scheduled', options: EVENT_STATUS, required: true, enumName: 'enum_events_event_status' },
      ],
    },
    { name: 'programme', type: 'relationship', relationTo: 'programmes' },
    { name: 'championshipSeason', type: 'relationship', relationTo: 'championship-seasons' },
    { name: 'season', type: 'number', required: true, index: true },
    { name: 'round', type: 'text' },
    { type: 'row', fields: [{ name: 'circuit', type: 'relationship', relationTo: 'circuits' }, { name: 'layout', type: 'text' }] },
    { type: 'row', fields: [{ name: 'startDate', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayOnly' } } }, { name: 'endDate', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } }] },
    { name: 'timeZone', type: 'text', admin: { description: 'Defaults to the circuit time zone.' }, validate: (v: unknown) => (!v || isValidTimeZone(v as string) ? true : 'Invalid IANA zone') },
    { name: 'changeNote', type: 'textarea', admin: { description: 'Explain postponements, venue changes or timetable revisions (CAL-09, EVENT-13).' } },
    { name: 'revisedAt', type: 'date', admin: { readOnly: true } },
    { name: 'summary', type: 'textarea' },
    { name: 'driversEntered', type: 'relationship', relationTo: 'drivers', hasMany: true },
    {
      name: 'officialLinks',
      type: 'group',
      fields: [
        { name: 'liveTiming', type: 'text' },
        { name: 'stream', type: 'text' },
        { name: 'results', type: 'text' },
        { name: 'noticeboard', type: 'text' },
        { name: 'tickets', type: 'text' },
      ],
    },
    { name: 'preview', type: 'relationship', relationTo: 'articles' },
    { name: 'report', type: 'relationship', relationTo: 'articles' },
    { name: 'gallery', type: 'relationship', relationTo: 'media-collections' },
    demoField,
  ],
}

export const Sessions: CollectionConfig = {
  slug: 'sessions',
  admin: { group: 'Racing', useAsTitle: 'name', defaultColumns: ['name', 'event', 'localStart', 'certainty', 'status'] },
  access: { read: anyone, create: roles('raceData'), update: roles('raceData'), delete: roles('raceData') },
  hooks: { ...audit, beforeChange: [(args) => import('../hooks/sessions').then((m) => m.computeSessionInstants(args))] },
  fields: [
    { name: 'event', type: 'relationship', relationTo: 'events', required: true, index: true },
    { name: 'name', type: 'text', required: true },
    { type: 'row', fields: [{ name: 'type', type: 'select', defaultValue: 'race', options: ['practice', 'test', 'qualifying', 'qualifying-race', 'heat', 'race', 'final', 'other'] }, { name: 'group', type: 'text' }] },
    {
      type: 'row',
      fields: [
        { name: 'localStart', type: 'text', admin: { description: 'Circuit-local time, YYYY-MM-DDTHH:mm' }, validate: (v: unknown) => (!v || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v as string) ? true : 'Use YYYY-MM-DDTHH:mm') },
        { name: 'localEnd', type: 'text', validate: (v: unknown) => (!v || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v as string) ? true : 'Use YYYY-MM-DDTHH:mm') },
      ],
    },
    { name: 'timeZone', type: 'text', admin: { readOnly: true } },
    { name: 'startsAt', type: 'date', index: true, admin: { readOnly: true, description: 'UTC (computed)' } },
    { name: 'endsAt', type: 'date', admin: { readOnly: true } },
    { type: 'row', fields: [{ name: 'certainty', type: 'select', defaultValue: 'provisional', options: ['confirmed', 'provisional', 'tbc'] }, { name: 'status', type: 'select', defaultValue: 'scheduled', options: ['scheduled', 'delayed', 'cancelled', 'completed'] }] },
    { name: 'replayUrl', type: 'text' },
    demoField,
  ],
}
