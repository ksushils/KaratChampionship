import type { Field } from 'payload'

/** Substantiation / claims approval (CMS-15, CMS-16). */
export const substantiationFields: Field = {
  name: 'substantiation',
  type: 'group',
  admin: { description: 'Evidence for factual claims. Required before publication of sensitive claims.' },
  fields: [
    { name: 'sources', type: 'relationship', relationTo: 'sources', hasMany: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'unverified',
      options: [
        { label: 'Unverified', value: 'unverified' },
        { label: 'Evidence supplied', value: 'evidence-supplied' },
        { label: 'Verified', value: 'verified' },
        { label: 'Owner approved', value: 'owner-approved' },
      ],
    },
    { name: 'verifiedAt', type: 'date' },
    { name: 'approvedBy', type: 'relationship', relationTo: 'users' },
    { name: 'notes', type: 'textarea' },
  ],
}

export const seoFields: Field = {
  name: 'seo',
  type: 'group',
  admin: { description: 'Search and social preview (SEO-01, NEWS-08). Falls back to the title and summary.' },
  fields: [
    { name: 'title', type: 'text', maxLength: 70 },
    { name: 'description', type: 'textarea', maxLength: 170 },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'noindex', type: 'checkbox', defaultValue: false },
    { name: 'canonical', type: 'text', admin: { description: 'Absolute URL. Leave blank for the default canonical.' } },
  ],
}

export const demoField: Field = {
  name: 'isDemo',
  type: 'checkbox',
  defaultValue: false,
  index: true,
  admin: {
    position: 'sidebar',
    readOnly: true,
    description: 'Fictional development fixture. Never present in production (see LAUNCH-CHECKLIST).',
  },
}

export const linkArray = (name: string, label?: string): Field => ({
  name,
  label,
  type: 'array',
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'url', type: 'text', required: true },
  ],
})

export const PROGRAMME_STATUS = [
  { label: 'Intended', value: 'intended' },
  { label: 'Subject to approval', value: 'subject-to-approval' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Archived', value: 'archived' },
  { label: 'Future ambition', value: 'future' },
]
