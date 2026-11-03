import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/** CMS-17 / RES-14: record who changed what. Personal data is not copied into the log. */
export const auditAfterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req, operation, collection }) => {
  if (collection.slug === 'audit-logs' || req.context?.skipAudit) return doc
  try {
    const changed =
      operation === 'update' && previousDoc
        ? Object.keys(doc).filter(
            (k) => !['updatedAt', 'createdAt'].includes(k) && JSON.stringify(doc[k]) !== JSON.stringify(previousDoc[k]),
          )
        : []
    const statusChange = previousDoc?._status !== doc._status && doc._status ? ` (${previousDoc?._status ?? 'new'} → ${doc._status})` : ''
    await req.payload.create({
      collection: 'audit-logs',
      data: {
        action: operation,
        collectionSlug: collection.slug,
        documentId: String(doc.id),
        user: req.user && req.user.collection === 'users' ? req.user.id : undefined,
        userEmail: req.user?.email ?? 'system',
        summary: `${operation}${statusChange}${changed.length ? `: ${changed.slice(0, 12).join(', ')}` : ''}`.slice(0, 500),
      },
      overrideAccess: true,
      req,
      context: { skipAudit: true },
    })
  } catch (err) {
    req.payload.logger.error({ msg: 'audit log write failed', err })
  }
  return doc
}

export const auditAfterDelete: CollectionAfterDeleteHook = async ({ doc, req, collection }) => {
  if (collection.slug === 'audit-logs') return doc
  try {
    await req.payload.create({
      collection: 'audit-logs',
      data: {
        action: 'delete',
        collectionSlug: collection.slug,
        documentId: String(doc.id),
        user: req.user && req.user.collection === 'users' ? req.user.id : undefined,
        userEmail: req.user?.email ?? 'system',
        summary: 'delete',
      },
      overrideAccess: true,
      req,
      context: { skipAudit: true },
    })
  } catch (err) {
    req.payload.logger.error({ msg: 'audit log write failed', err })
  }
  return doc
}
