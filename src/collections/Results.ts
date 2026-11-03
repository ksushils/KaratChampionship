import { APIError, type Access, type CollectionConfig, type Where } from 'payload'
import { roles } from '../access/roles'
import { demoField } from '../fields/common'
import { auditAfterChange, auditAfterDelete } from '../hooks/audit'
import { RESULT_STATUSES, validateResultEntries } from '../lib/results'

const publicVerified: Access = ({ req }) => {
  if (req.user && (((req.user as { roles?: string[] }).roles) ?? []).some((r: string) => ['admin', 'raceData', 'editor'].includes(r))) return true
  // HOME-06 / RES-07: only published, verified data reaches the public.
  const w: Where = { and: [{ _status: { equals: 'published' } }, { verification: { equals: 'verified' } }] }
  return w
}

const validateEntries = ({ data }: { data: any }) => {
  const issues = validateResultEntries(data?.entries ?? [])
  if (issues.length) throw new APIError(`Result validation failed: ${issues.map((i) => `row ${i.row} ${i.field}: ${i.message}`).join('; ')}`, 400)
  return data
}

const attribution = {
  name: 'attribution',
  type: 'select' as const,
  required: true,
  defaultValue: 'karat',
  options: [
    { label: 'Karat Racing', value: 'karat' },
    { label: 'KIC Motorsport (predecessor — never aggregated into Karat totals)', value: 'kic' },
    { label: 'Other entity', value: 'other' },
  ],
  admin: { position: 'sidebar' as const },
}

export const ResultSets: CollectionConfig = {
  slug: 'result-sets',
  admin: { group: 'Racing', useAsTitle: 'label', defaultColumns: ['label', 'classification', 'state', 'verification', '_status'] },
  access: { read: publicVerified, create: roles('raceData'), update: roles('raceData'), delete: roles() },
  versions: { drafts: true, maxPerDoc: 100 }, // revision history = reproducible audit trail (RES-14)
  hooks: { beforeChange: [validateEntries], afterChange: [auditAfterChange], afterDelete: [auditAfterDelete] },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'event', type: 'relationship', relationTo: 'events', required: true, index: true },
    { name: 'session', type: 'relationship', relationTo: 'sessions', required: true, index: true },
    { name: 'season', type: 'number', required: true, index: true },
    { name: 'programme', type: 'relationship', relationTo: 'programmes' },
    {
      type: 'row',
      fields: [
        { name: 'classification', type: 'text', defaultValue: 'overall', required: true, admin: { description: 'overall, rookie, female, or an official class name' } },
        { name: 'state', type: 'select', defaultValue: 'provisional', options: ['provisional', 'final'], required: true },
        { name: 'verification', type: 'select', defaultValue: 'unverified', options: ['unverified', 'verified'], required: true },
      ],
    },
    attribution,
    {
      name: 'source',
      type: 'group',
      fields: [
        { name: 'url', type: 'text' },
        { name: 'document', type: 'upload', relationTo: 'media' },
        { name: 'publishedAt', type: 'date' },
        { name: 'record', type: 'relationship', relationTo: 'sources' },
      ],
      validate: (v: any, { siblingData }: any) => (siblingData?.verification === 'verified' && !v?.url && !v?.document && !v?.record ? 'Verified results need an official source (RES-07).' : true),
    },
    { name: 'penaltyNotes', type: 'textarea', admin: { description: 'Revisions, penalties and explanatory notes (RES-06).' } },
    {
      name: 'entries',
      type: 'array',
      admin: { description: 'Leave unknown values blank — they display as "Not published", never as zero (RES-15).' },
      fields: [
        { type: 'row', fields: [{ name: 'position', type: 'number' }, { name: 'carNumber', type: 'text' }, { name: 'status', type: 'select', defaultValue: 'classified', options: [...RESULT_STATUSES] }] },
        { type: 'row', fields: [{ name: 'driverName', type: 'text', required: true }, { name: 'driver', type: 'relationship', relationTo: 'drivers' }, { name: 'entrant', type: 'text' }] },
        { type: 'row', fields: [{ name: 'laps', type: 'number' }, { name: 'time', type: 'text' }, { name: 'gap', type: 'text' }, { name: 'points', type: 'number' }] },
        { name: 'isKarat', type: 'checkbox', defaultValue: false },
        { name: 'note', type: 'text' },
      ],
    },
    demoField,
  ],
}

export const Standings: CollectionConfig = {
  slug: 'standings',
  admin: { group: 'Racing', useAsTitle: 'label' },
  access: { read: publicVerified, create: roles('raceData'), update: roles('raceData'), delete: roles() },
  versions: { drafts: true, maxPerDoc: 50 },
  hooks: { afterChange: [auditAfterChange], afterDelete: [auditAfterDelete] },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'programme', type: 'relationship', relationTo: 'programmes' },
    { name: 'season', type: 'number', required: true, index: true },
    { type: 'row', fields: [{ name: 'type', type: 'select', defaultValue: 'driver', options: ['driver', 'team'] }, { name: 'classification', type: 'text', defaultValue: 'overall' }] },
    { name: 'afterEvent', type: 'relationship', relationTo: 'events' },
    { type: 'row', fields: [{ name: 'state', type: 'select', defaultValue: 'provisional', options: ['provisional', 'final'] }, { name: 'verification', type: 'select', defaultValue: 'unverified', options: ['unverified', 'verified'] }] },
    attribution,
    { name: 'source', type: 'group', fields: [{ name: 'url', type: 'text' }, { name: 'publishedAt', type: 'date' }, { name: 'record', type: 'relationship', relationTo: 'sources' }] },
    { name: 'calculated', type: 'checkbox', defaultValue: false, admin: { description: 'Website-calculated totals are labelled and official classifications take precedence (RES-11).' } },
    {
      name: 'entries',
      type: 'array',
      fields: [
        { type: 'row', fields: [{ name: 'position', type: 'number' }, { name: 'name', type: 'text', required: true }, { name: 'driver', type: 'relationship', relationTo: 'drivers' }] },
        { type: 'row', fields: [{ name: 'points', type: 'number' }, { name: 'isKarat', type: 'checkbox' }] },
      ],
    },
    demoField,
  ],
}
