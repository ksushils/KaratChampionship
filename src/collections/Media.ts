import type { CollectionConfig } from 'payload'
import { hasRole, roles } from '../access/roles'
import { publicMediaWhere } from '../lib/media-rights'

/** Public media with rights metadata (MEDIA-05/06/07, CMS-11). Expired rights are withdrawn by access control. */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Media', useAsTitle: 'alt', defaultColumns: ['filename', 'alt', 'credit', 'publicUseApproved', 'rightsExpiresAt'] },
  access: {
    read: ({ req }) => (req.user && hasRole(req.user as never, 'editor', 'media', 'commercial', 'raceData')) ? true : publicMediaWhere(),
    create: roles('editor', 'media', 'commercial'),
    update: roles('editor', 'media', 'commercial'),
    delete: roles('media'),
  },
  upload: {
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml', 'application/pdf'],
    focalPoint: true,
    crop: true,
    imageSizes: [
      { name: 'thumb', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920 },
    ],
    adminThumbnail: 'thumb',
  },
  fields: [
    { name: 'alt', type: 'text', required: true, admin: { description: 'Describe the image for screen-reader users. Use "" only for purely decorative images.' } },
    { name: 'caption', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'credit', type: 'text', admin: { description: 'Required credit line, e.g. "Photo: Jane Smith"' } },
        { name: 'copyrightOwner', type: 'text' },
      ],
    },
    {
      name: 'publicUseApproved',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Only approved assets are publicly accessible.' },
    },
    { name: 'usageScope', type: 'select', defaultValue: 'web', options: ['web', 'web-and-social', 'press', 'all-media', 'internal-only'] },
    { name: 'rightsExpiresAt', type: 'date', admin: { description: 'Asset is withdrawn from the public site after this date (MEDIA-07).' } },
    { name: 'downloadPermitted', type: 'checkbox', defaultValue: false, admin: { description: 'Allow download from the Press page.' } },
    { name: 'restrictions', type: 'textarea' },
    { name: 'tags', type: 'text', hasMany: true },
    { name: 'containsMinors', type: 'checkbox', defaultValue: false, admin: { description: 'Requires documented guardian photography permission (DRV-16).' } },
  ],
}
