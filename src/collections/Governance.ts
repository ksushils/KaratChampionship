import type { CollectionConfig } from 'payload'
import { adminOnly, anyone, nobody, roles } from '../access/roles'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: { group: 'Governance', useAsTitle: 'summary', defaultColumns: ['createdAt', 'userEmail', 'action', 'collectionSlug', 'documentId', 'summary'] },
  access: { read: adminOnly, create: nobody, update: nobody, delete: nobody },
  fields: [
    { name: 'action', type: 'text', index: true },
    { name: 'collectionSlug', type: 'text', index: true },
    { name: 'documentId', type: 'text', index: true },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'userEmail', type: 'text' },
    { name: 'summary', type: 'text' },
  ],
}

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: { group: 'Governance', useAsTitle: 'from', defaultColumns: ['from', 'to', 'statusCode', 'automatic'] },
  access: { read: anyone, create: roles('editor'), update: roles('editor'), delete: roles('editor') },
  fields: [
    { name: 'from', type: 'text', required: true, unique: true, index: true, validate: (v: unknown) => (typeof v === 'string' && v.startsWith('/') ? true : 'Must start with /') },
    { name: 'to', type: 'text', required: true },
    { name: 'statusCode', type: 'select', defaultValue: '301', options: ['301', '302', '308'] },
    { name: 'automatic', type: 'checkbox', defaultValue: false, admin: { readOnly: true } },
  ],
}

export const ConsentRecords: CollectionConfig = {
  slug: 'consent-records',
  admin: { group: 'Governance', defaultColumns: ['purpose', 'choice', 'policyVersion', 'createdAt'] },
  access: { read: adminOnly, create: nobody, update: nobody, delete: adminOnly },
  fields: [
    { name: 'subject', type: 'text', index: true, admin: { description: 'Anonymous consent ID or enquiry reference — never an email.' } },
    { name: 'purpose', type: 'select', required: true, options: ['analytics', 'media-embeds', 'marketing-email', 'enquiry-processing'] },
    { name: 'choice', type: 'select', required: true, options: ['granted', 'denied', 'withdrawn'] },
    { name: 'policyVersion', type: 'text' },
    { name: 'withdrawnAt', type: 'date' },
  ],
}

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: { group: 'Leads', useAsTitle: 'subject', defaultColumns: ['subject', 'to', 'status', 'attempts', 'nextAttemptAt'] },
  access: { read: adminOnly, create: nobody, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'enquiry', type: 'relationship', relationTo: 'enquiries' },
    { name: 'kind', type: 'select', options: ['team-alert', 'acknowledgement', 'application-alert'] },
    { name: 'to', type: 'text', required: true },
    { name: 'replyTo', type: 'text' },
    { name: 'subject', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    { name: 'status', type: 'select', defaultValue: 'pending', index: true, options: ['pending', 'sent', 'failed'] },
    { name: 'attempts', type: 'number', defaultValue: 0 },
    { name: 'nextAttemptAt', type: 'date', index: true },
    { name: 'sentAt', type: 'date' },
    { name: 'lastError', type: 'text' },
  ],
}
