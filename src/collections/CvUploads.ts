import type { CollectionConfig } from 'payload'
import { roles } from '../access/roles'

/** Private CV storage (JOB-05, JOB-08). Never publicly readable; served only to recruiters/admins. */
export const CvUploads: CollectionConfig = {
  slug: 'cv-uploads',
  admin: { group: 'People & Careers', hidden: ({ user }) => !user },
  access: { read: roles('recruiter'), create: roles('recruiter'), update: roles('recruiter'), delete: roles('recruiter') },
  upload: {
    staticDir: process.env.PRIVATE_UPLOAD_DIR || 'private-uploads',
    mimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    disableLocalStorage: false,
  },
  fields: [{ name: 'scanStatus', type: 'select', defaultValue: 'not-scanned', options: ['not-scanned', 'clean', 'infected', 'scanner-unavailable'] }],
}
