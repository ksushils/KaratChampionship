import type { GlobalConfig } from 'payload'
import { anyone, roles } from '../access/roles'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: roles() },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'Karat Racing' },
    { name: 'legalEntityName', type: 'text', admin: { description: 'Legal company name and number — never invent. Shown in footer only when set.' } },
    { name: 'registeredAddress', type: 'textarea' },
    { name: 'publicEmail', type: 'email' },
    { name: 'publicPhone', type: 'text' },
    { name: 'privacyNoticeVersion', type: 'text', defaultValue: '0.1-draft' },
    {
      name: 'routing',
      type: 'group',
      admin: { description: 'Internal recipients for enquiry notifications (UTIL-03). Test every route before launch.' },
      fields: [
        { name: 'racePrograms', type: 'email' },
        { name: 'partnerships', type: 'email' },
        { name: 'hospitality', type: 'email' },
        { name: 'media', type: 'email' },
        { name: 'careers', type: 'email' },
        { name: 'testing', type: 'email' },
        { name: 'organisation', type: 'email' },
        { name: 'safeguarding', type: 'email' },
        { name: 'general', type: 'email' },
      ],
    },
    {
      name: 'social',
      type: 'array',
      admin: { description: 'Approved official accounts only.' },
      fields: [
        { name: 'platform', type: 'select', options: ['instagram', 'x', 'youtube', 'linkedin', 'tiktok', 'facebook'] },
        { name: 'url', type: 'text', required: true },
      ],
    },
    { name: 'responseTimeStatement', type: 'text', admin: { description: 'Leave blank unless the business approves a response-time promise (LEAD-21).' } },
    { name: 'safeguardingLead', type: 'text', admin: { description: 'Name/role of the approved safeguarding contact.' } },
  ],
}

export const FeatureFlags: GlobalConfig = {
  slug: 'feature-flags',
  admin: { group: 'Settings', description: 'Optional modules (CMS-19). Off = route hidden and returns 404.' },
  access: { read: anyone, update: roles() },
  fields: [
    { name: 'newsletter', type: 'checkbox', defaultValue: false },
    { name: 'viewerLocalTime', type: 'checkbox', defaultValue: true },
    { name: 'calendarFeed', type: 'checkbox', defaultValue: true },
    { name: 'rss', type: 'checkbox', defaultValue: true },
    { name: 'liveText', type: 'checkbox', defaultValue: false },
    { name: 'hospitalityEnquiries', type: 'checkbox', defaultValue: true },
    { name: 'cvUpload', type: 'checkbox', defaultValue: true },
    { name: 'speculativeApplications', type: 'checkbox', defaultValue: false },
    { name: 'whatsapp', type: 'checkbox', defaultValue: false },
    { name: 'whatsappNumber', type: 'text', admin: { condition: (d) => Boolean(d?.whatsapp) } },
    { name: 'driverPortal', type: 'checkbox', defaultValue: false, admin: { description: 'Future scope — not implemented. Leave off.' } },
    { name: 'partnerPortal', type: 'checkbox', defaultValue: false, admin: { description: 'Future scope — not implemented. Leave off.' } },
    { name: 'shop', type: 'checkbox', defaultValue: false, admin: { description: 'Future scope — not implemented. Leave off.' } },
  ],
}

/** Approved team narrative. Each block has its own approval switch; unapproved copy falls back to neutral defaults. */
export const TeamContent: GlobalConfig = {
  slug: 'team-content',
  admin: { group: 'Settings', description: 'Owner-approved copy for Championship Team pages.' },
  access: { read: anyone, update: roles('editor') },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'About',
          fields: [
            { name: 'story', type: 'richText' },
            { name: 'storyApproved', type: 'checkbox' },
            { name: 'workingMethods', type: 'array', fields: [{ name: 'title', type: 'text', required: true }, { name: 'body', type: 'textarea', required: true }] },
            { name: 'values', type: 'array', fields: [{ name: 'title', type: 'text', required: true }, { name: 'body', type: 'textarea', required: true }] },
            { name: 'valuesApproved', type: 'checkbox' },
          ],
        },
        {
          label: 'Heritage',
          fields: [
            { name: 'acquisitionStatement', type: 'richText', admin: { description: 'KIC Motorsport takeover wording. Unpublished until approved (TEAM-03).' } },
            { name: 'acquisitionApproved', type: 'checkbox', defaultValue: false },
            { name: 'acquisitionApprovedBy', type: 'relationship', relationTo: 'users' },
            { name: 'heritageRightsNote', type: 'textarea', admin: { description: 'Rights to KIC archive/domain (SEO-08).' } },
          ],
        },
        {
          label: 'Development',
          fields: [
            { name: 'simulatorStatement', type: 'textarea', admin: { description: 'Only confirmed owned or partner-provided capability (DEV-06).' } },
            { name: 'coachingStatement', type: 'textarea' },
            { name: 'humanPerformanceStatement', type: 'textarea' },
          ],
        },
        {
          label: 'Commercial',
          fields: [
            {
              name: 'audienceMetrics',
              type: 'array',
              admin: { description: 'Only Karat figures, with source, period and scope (SPON-10/11).' },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'text', required: true },
                { name: 'period', type: 'text', required: true },
                { name: 'scope', type: 'text', required: true },
                { name: 'source', type: 'relationship', relationTo: 'sources', required: true },
              ],
            },
            { name: 'commercialDeck', type: 'upload', relationTo: 'media' },
            { name: 'commercialDeckVersion', type: 'text' },
            { name: 'teamProfilePdf', type: 'upload', relationTo: 'media' },
            { name: 'teamProfileVersion', type: 'text' },
          ],
        },
      ],
    },
  ],
}
