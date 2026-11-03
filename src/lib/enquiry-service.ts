import 'server-only'
import type { Payload } from 'payload'
import { after } from 'next/server'
import { CATEGORY_DIVISION, fieldErrors, schemaFor, type EnquiryCategory } from './enquiry-schema'
import { makeReference } from './reference'
import { processNotificationQueue } from './notifications'

export type SubmitResult =
  | { ok: true; reference: string; duplicate?: boolean }
  | { ok: false; errors: Record<string, string>; message: string }

const ROUTING_KEY: Record<EnquiryCategory, string> = {
  'race-programme': 'racePrograms',
  partnership: 'partnerships',
  hospitality: 'hospitality',
  media: 'media',
  testing: 'testing',
  'championship-organisation': 'organisation',
  safeguarding: 'safeguarding',
  general: 'general',
}
const CATEGORY_LABEL: Record<EnquiryCategory, string> = {
  'race-programme': 'Race programme enquiry',
  partnership: 'Partnership enquiry',
  hospitality: 'Hospitality enquiry',
  media: 'Media enquiry',
  testing: 'Testing enquiry',
  'championship-organisation': 'Championship organisation enquiry',
  safeguarding: 'Safeguarding contact',
  general: 'General enquiry',
}

/** Normalise FormData (supports repeated keys for arrays and checkbox "on"). */
export function formToObject(fd: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of fd.entries()) {
    if (k.startsWith('$ACTION')) continue
    const val = typeof v === 'string' ? v : ''
    if (k.endsWith('[]')) {
      const key = k.slice(0, -2)
      ;(out[key] as string[] | undefined) ? (out[key] as string[]).push(val) : (out[key] = [val])
    } else out[k] = val
  }
  for (const k of ['marketingOptIn', 'guardianConsent', 'privacyAcknowledged']) {
    if (k in out) out[k] = out[k] === 'on' || out[k] === 'true' || out[k] === true
  }
  if (out.partySize === '') delete out.partySize
  for (const k of Object.keys(out)) if (out[k] === '' && ['budget', 'ageBand', 'role'].includes(k)) delete out[k]
  return out
}

/**
 * Persist first, then notify (LEAD-16/17/18). Success is reported only after the
 * database write. Email delivery is queued and retried independently.
 */
export async function submitEnquiry(payload: Payload, raw: Record<string, unknown>, opts: { now?: Date; deferNotifications?: boolean } = {}): Promise<SubmitResult> {
  const category = String(raw.category ?? '') as EnquiryCategory
  if (!(category in CATEGORY_DIVISION)) return { ok: false, errors: { category: 'Unknown enquiry type' }, message: 'Please choose an enquiry type.' }
  const parsed = schemaFor(category).safeParse(raw)
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), message: 'Please correct the highlighted fields.' }
  const v = parsed.data as Record<string, any>

  // Duplicate submission (double-click / retry) returns the original reference (acceptance #8).
  const dup = await payload.find({ collection: 'enquiries', where: { idempotencyKey: { equals: v.idempotencyKey } }, limit: 1, overrideAccess: true, depth: 0 })
  if (dup.docs[0]) return { ok: true, reference: dup.docs[0].reference, duplicate: true }

  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const division = CATEGORY_DIVISION[category]
  const minor = ['under-14', '14-15', '16-17'].includes(v.ageBand)
  const { name, email, phone, country, organisation, message, marketingOptIn, idempotencyKey, sourcePage, campaign, programme, season, role, ageBand, website: _hp, privacyAcknowledged: _pa, category: _c, ...rest } = v
  const reference = makeReference(category)
  const retention = new Date(opts.now ?? Date.now())
  retention.setMonth(retention.getMonth() + 24)

  let doc
  try {
    doc = await payload.create({
      collection: 'enquiries',
      overrideAccess: true,
      data: {
        reference,
        division,
        category,
        status: 'new',
        name,
        email,
        phone,
        country,
        organisation,
        role,
        programme,
        season,
        ageBand,
        involvesMinor: minor,
        message,
        details: rest,
        sourcePage,
        campaign,
        marketingOptIn: Boolean(marketingOptIn),
        privacyNoticeVersion: settings.privacyNoticeVersion ?? undefined,
        retentionUntil: retention.toISOString(),
        idempotencyKey,
      },
    })
  } catch (err) {
    // Unique-key race with a concurrent duplicate.
    const again = await payload.find({ collection: 'enquiries', where: { idempotencyKey: { equals: idempotencyKey } }, limit: 1, overrideAccess: true, depth: 0 })
    if (again.docs[0]) return { ok: true, reference: again.docs[0].reference, duplicate: true }
    payload.logger.error({ msg: 'enquiry persistence failed', err })
    return { ok: false, errors: {}, message: 'Sorry — we could not save your enquiry. Nothing was sent. Please try again in a moment.' }
  }

  // Queue notifications (never block or fail the enquiry).
  try {
    const divDoc = await payload.find({ collection: 'divisions', where: { key: { equals: division } }, limit: 1, depth: 0, overrideAccess: true })
    const routing = (settings.routing ?? {}) as Record<string, string | null | undefined>
    const to = (category === 'safeguarding' ? routing.safeguarding : routing[ROUTING_KEY[category]]) || divDoc.docs[0]?.routingEmail || routing.general || process.env.ENQUIRY_FALLBACK_EMAIL
    const nowIso = new Date(opts.now ?? Date.now()).toISOString()
    if (to) {
      await payload.create({
        collection: 'notifications',
        overrideAccess: true,
        data: {
          enquiry: doc.id,
          kind: 'team-alert',
          to,
          subject: `[${reference}] ${CATEGORY_LABEL[category]}${programme ? ` — ${programme}` : ''}${minor ? ' (involves a minor)' : ''}`,
          // Internal alert carries a link, not the personal data, to keep PII inside the CMS.
          body: `A new ${CATEGORY_LABEL[category].toLowerCase()} was received.\n\nReference: ${reference}\nDivision: ${division}\nCategory: ${category}\n\nOpen it in the CMS: ${process.env.NEXT_PUBLIC_SERVER_URL || ''}/admin/collections/enquiries/${doc.id}`,
          status: 'pending',
          nextAttemptAt: nowIso,
        },
      })
    } else {
      payload.logger.warn({ msg: 'No routing address configured for enquiry category', category, reference })
    }
    await payload.create({
      collection: 'notifications',
      overrideAccess: true,
      data: {
        enquiry: doc.id,
        kind: 'acknowledgement',
        to: email,
        subject: `We have received your enquiry (${reference})`,
        body: `Hello ${name},\n\nThank you for contacting Karat Racing. Your enquiry reference is ${reference}.\n\nA member of the relevant team will review it${settings.responseTimeStatement ? ` — ${settings.responseTimeStatement}` : ''}. Please quote your reference if you contact us again.\n\nKarat Racing`,
        status: 'pending',
        nextAttemptAt: nowIso,
      },
    })
  } catch (err) {
    payload.logger.error({ msg: 'notification queueing failed (enquiry is saved)', reference, err })
  }

  if (!opts.deferNotifications) {
    try {
      after(() => processNotificationQueue(payload).catch((err) => payload.logger.error({ msg: 'queue processing failed', err })))
    } catch {
      // Outside a request scope (tests/scripts): process inline but never fail the enquiry.
      await processNotificationQueue(payload).catch(() => {})
    }
  }
  return { ok: true, reference }
}
