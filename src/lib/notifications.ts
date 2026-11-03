import type { Payload } from 'payload'
import { getEmailAdapter } from './email'

/** Exponential backoff: 1, 2, 4, 8, 16 … minutes, capped at 6 hours. */
export const backoffMs = (attempts: number) => Math.min(6 * 3_600_000, 60_000 * 2 ** Math.max(0, attempts - 1))
export const MAX_ATTEMPTS = 8

/**
 * Process the notification outbox. Each record is attempted independently; failure never
 * touches the enquiry itself (acceptance #7).
 */
export async function processNotificationQueue(payload: Payload, limit = 25, now = new Date()) {
  const adapter = await getEmailAdapter()
  const due = await payload.find({
    collection: 'notifications',
    where: { and: [{ status: { equals: 'pending' } }, { nextAttemptAt: { less_than_equal: now.toISOString() } }] },
    limit,
    sort: 'nextAttemptAt',
    overrideAccess: true,
    depth: 0,
  })
  let sent = 0
  let failed = 0
  for (const n of due.docs) {
    const attempts = (n.attempts ?? 0) + 1
    try {
      await adapter.send({ to: n.to, subject: n.subject, text: n.body, replyTo: n.replyTo ?? undefined })
      await payload.update({
        collection: 'notifications',
        id: n.id,
        data: { status: 'sent', attempts, sentAt: new Date().toISOString(), lastError: null },
        overrideAccess: true,
      })
      sent++
    } catch (err) {
      failed++
      const giveUp = adapter.configured && attempts >= MAX_ATTEMPTS
      await payload.update({
        collection: 'notifications',
        id: n.id,
        data: {
          status: giveUp ? 'failed' : 'pending',
          attempts,
          lastError: String((err as Error).message).slice(0, 500),
          nextAttemptAt: new Date(now.getTime() + backoffMs(attempts)).toISOString(),
        },
        overrideAccess: true,
      })
      payload.logger.warn({ msg: 'notification delivery failed', id: n.id, attempts, adapter: adapter.name })
    }
  }
  return { processed: due.docs.length, sent, failed, adapter: adapter.name, configured: adapter.configured }
}
