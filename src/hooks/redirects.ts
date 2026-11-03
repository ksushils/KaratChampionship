import type { CollectionAfterChangeHook } from 'payload'

/** CMS-12 / NEWS-10: when a published slug changes, keep the old URL working. */
export const slugRedirect =
  (pathFor: (slug: string, doc: Record<string, unknown>) => string): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req, operation }) => {
    if (operation !== 'update' || !previousDoc?.slug || previousDoc.slug === doc.slug) return doc
    if (previousDoc._status && previousDoc._status !== 'published') return doc
    const from = pathFor(previousDoc.slug, previousDoc)
    const to = pathFor(doc.slug, doc)
    try {
      // Re-point chains: any redirect targeting the old path now targets the new one.
      const chained = await req.payload.find({ collection: 'redirects', where: { to: { equals: from } }, overrideAccess: true, req, limit: 100 })
      for (const r of chained.docs) await req.payload.update({ collection: 'redirects', id: r.id, data: { to }, overrideAccess: true, req })
      const existing = await req.payload.find({ collection: 'redirects', where: { from: { equals: from } }, overrideAccess: true, req, limit: 1 })
      if (existing.docs[0]) await req.payload.update({ collection: 'redirects', id: existing.docs[0].id, data: { to }, overrideAccess: true, req })
      else await req.payload.create({ collection: 'redirects', data: { from, to, statusCode: '301', automatic: true }, overrideAccess: true, req })
    } catch (err) {
      req.payload.logger.error({ msg: 'redirect creation failed', err })
    }
    return doc
  }
