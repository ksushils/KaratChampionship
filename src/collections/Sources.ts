import type { CollectionConfig } from 'payload'
import { authenticated, roles } from '../access/roles'

/** Source register (CMS-15): evidence behind factual claims. Internal only. */
export const Sources: CollectionConfig = {
  slug: 'sources',
  admin: { group: 'Governance', useAsTitle: 'title', defaultColumns: ['title', 'publisher', 'verifiedAt'] },
  access: { read: authenticated, create: roles('editor', 'raceData', 'commercial'), update: roles('editor', 'raceData', 'commercial'), delete: roles() },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'url', type: 'text' },
    { name: 'document', type: 'upload', relationTo: 'media' },
    { name: 'publisher', type: 'text' },
    { name: 'accessedAt', type: 'date' },
    { name: 'verifiedAt', type: 'date' },
    { name: 'approver', type: 'relationship', relationTo: 'users' },
    { name: 'kind', type: 'select', defaultValue: 'primary', options: ['primary', 'secondary', 'owner-statement'] },
    { name: 'notes', type: 'textarea' },
  ],
}
