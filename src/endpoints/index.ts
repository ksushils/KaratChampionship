import type { Endpoint } from 'payload'
import { hasRole } from '../access/roles'
import { processNotificationQueue } from '../lib/notifications'
import { parseResultCsv, validateResultEntries } from '../lib/results'
import { rolloverProgrammeSeason } from '../lib/season-rollover'

/** GET /api/health — liveness + DB check (no secrets, no personal data). */
export const healthEndpoint: Endpoint = {
  path: '/health',
  method: 'get',
  handler: async (req) => {
    const started = Date.now()
    try {
      await req.payload.count({ collection: 'divisions', overrideAccess: true })
      return Response.json({ status: 'ok', db: 'ok', ms: Date.now() - started })
    } catch {
      return Response.json({ status: 'degraded', db: 'error' }, { status: 503 })
    }
  },
}

/** POST /api/cron/notifications — process the email outbox. Requires CRON_SECRET bearer or an admin session. */
export const notificationsCronEndpoint: Endpoint = {
  path: '/cron/notifications',
  method: 'post',
  handler: async (req) => {
    const auth = req.headers.get('authorization')
    const secret = process.env.CRON_SECRET
    const ok = (secret && auth === `Bearer ${secret}`) || hasRole(req.user as never)
    if (!ok) return Response.json({ error: 'Unauthorised' }, { status: 401 })
    const result = await processNotificationQueue(req.payload)
    return Response.json(result)
  },
}

/** POST /api/season-rollover { programmeSeasonId, year? } — CMS-18. */
export const seasonRolloverEndpoint: Endpoint = {
  path: '/season-rollover',
  method: 'post',
  handler: async (req) => {
    if (!hasRole(req.user as never, 'editor', 'raceData')) return Response.json({ error: 'Forbidden' }, { status: 403 })
    const body = (await req.json?.()) as { programmeSeasonId?: number | string; year?: number }
    if (!body?.programmeSeasonId) return Response.json({ error: 'programmeSeasonId required' }, { status: 400 })
    const prev = await req.payload.findByID({ collection: 'programme-seasons', id: body.programmeSeasonId, depth: 0, overrideAccess: true })
    const next = rolloverProgrammeSeason({ ...prev, programme: prev.programme as number }, body.year)
    const created = await req.payload.create({ collection: 'programme-seasons', data: next as never, req, overrideAccess: false, user: req.user })
    return Response.json({ created })
  },
}

/** POST /api/results-import/preview (text/csv body) — validate without saving (RES-12/13). */
export const resultsImportPreviewEndpoint: Endpoint = {
  path: '/results-import/preview',
  method: 'post',
  handler: async (req) => {
    if (!hasRole(req.user as never, 'raceData')) return Response.json({ error: 'Forbidden' }, { status: 403 })
    const text = (await req.text?.()) ?? ''
    if (text.length > 200_000) return Response.json({ error: 'File too large' }, { status: 413 })
    const entries = parseResultCsv(text)
    const issues = validateResultEntries(entries)
    return Response.json({ entries, issues, valid: issues.length === 0 })
  },
}
