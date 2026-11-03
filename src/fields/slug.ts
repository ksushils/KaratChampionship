import type { Field } from 'payload'

export const slugify = (v: string) =>
  v
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: { position: 'sidebar', description: `URL segment. Generated from "${from}" if left blank. Changing it on a published item creates a redirect automatically.` },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const src = data?.[from]
        return typeof src === 'string' ? slugify(src) : value
      },
    ],
  },
})
