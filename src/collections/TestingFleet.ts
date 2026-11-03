import type { CollectionConfig } from 'payload'
import { roles } from '../access/roles'
import { auditAfterChange } from '../hooks/audit'

/**
 * Reserved data model for the Testing & Karat Academy business (brief §25).
 * STAFF-ONLY: there is deliberately no public route, availability display, pricing or booking.
 * Publishing any of this requires a future, approved scope.
 */
export const TestCars: CollectionConfig = {
  slug: 'test-cars',
  labels: { singular: 'Test car (reserved)', plural: 'Test cars (reserved)' },
  admin: { group: 'Testing (reserved)', useAsTitle: 'name', description: 'Internal only — not shown on the website.' },
  access: { read: roles('editor', 'commercial'), create: roles('commercial'), update: roles('commercial'), delete: roles() },
  hooks: { afterChange: [auditAfterChange] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'ownership', type: 'select', required: true, options: [{ label: 'Owned by Karat', value: 'owned' }, { label: 'Operated by Karat', value: 'operated' }, { label: 'Partner-provided', value: 'partner' }] },
    { name: 'operator', type: 'text' },
    { name: 'category', type: 'text', admin: { description: 'e.g. F4, Formula Regional' } },
    { name: 'generation', type: 'text' },
    { name: 'specification', type: 'group', fields: [{ name: 'chassis', type: 'text' }, { name: 'engine', type: 'text' }, { name: 'gearbox', type: 'text' }, { name: 'tyres', type: 'text' }] },
    { name: 'baseLocation', type: 'text' },
    { name: 'circuits', type: 'relationship', relationTo: 'circuits', hasMany: true },
    {
      name: 'availability',
      type: 'array',
      admin: { description: 'Internal planning windows only — never published as live availability.' },
      fields: [{ name: 'from', type: 'date', required: true }, { name: 'to', type: 'date', required: true }, { name: 'note', type: 'text' }],
    },
    { name: 'services', type: 'text', hasMany: true },
    { name: 'restrictions', type: 'textarea', admin: { description: 'Eligibility, licence and circuit restrictions.' } },
  ],
}
