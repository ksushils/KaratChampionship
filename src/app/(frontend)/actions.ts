'use server'
import { headers } from 'next/headers'
import { randomUUID } from 'node:crypto'
import { payloadClient } from '@/lib/payload'
import { rateLimit } from '@/lib/rate-limit'
import { formToObject, submitEnquiry, type SubmitResult } from '@/lib/enquiry-service'
import { makeReference } from '@/lib/reference'

async function clientKey(scope: string) {
  const h = await headers()
  const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || 'local'
  return `${scope}:${ip}`
}

export async function enquiryAction(_prev: SubmitResult | null, fd: FormData): Promise<SubmitResult> {
  const limit = Number(process.env.ENQUIRY_RATE_LIMIT || 8)
  if (!rateLimit(await clientKey('enquiry'), limit).ok)
    return { ok: false, errors: {}, message: 'Too many submissions from this connection. Please wait a few minutes and try again.' }
  const raw = formToObject(fd)
  // Time-trap: forms submitted < 2s after render are almost always bots.
  const renderedAt = Number(raw.renderedAt)
  if (renderedAt && Date.now() - renderedAt < 2000 && process.env.DISABLE_TIME_TRAP !== 'true')
    return { ok: false, errors: {}, message: 'That was very fast — please review your answers and submit again.' }
  const payload = await payloadClient()
  return submitEnquiry(payload, raw)
}

export async function recordConsent(choice: { analytics: boolean; media: boolean }) {
  if (!rateLimit(await clientKey('consent'), 30).ok) return
  const payload = await payloadClient()
  const subject = `anon-${randomUUID()}`
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  for (const [purpose, granted] of [
    ['analytics', choice.analytics],
    ['media-embeds', choice.media],
  ] as const) {
    await payload.create({
      collection: 'consent-records',
      overrideAccess: true,
      data: { subject, purpose, choice: granted ? 'granted' : 'denied', policyVersion: settings.privacyNoticeVersion ?? undefined },
    })
  }
}

export type ApplicationResult = { ok: true; reference: string } | { ok: false; message: string; errors: Record<string, string> }

const MAX_CV = 5 * 1024 * 1024
const CV_TYPES: Record<string, number[]> = {
  'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [0x50, 0x4b, 0x03, 0x04], // ZIP
}

/** JOB-04/05/06: working application flow with validated, private CV storage. */
export async function applicationAction(_prev: ApplicationResult | null, fd: FormData): Promise<ApplicationResult> {
  if (!rateLimit(await clientKey('apply'), 5).ok) return { ok: false, message: 'Too many submissions. Please try later.', errors: {} }
  const payload = await payloadClient()
  const errors: Record<string, string> = {}
  const get = (k: string) => String(fd.get(k) ?? '').trim()
  if (get('website')) return { ok: false, message: 'Spam check failed.', errors: {} }
  const vacancyId = get('vacancy')
  const vac = vacancyId ? await payload.find({ collection: 'vacancies', where: { id: { equals: vacancyId } }, overrideAccess: false, limit: 1, depth: 0 }) : null
  const vacancy = vac?.docs[0]
  if (!vacancy) return { ok: false, message: 'This vacancy is not available.', errors: {} }
  const closed = vacancy.closed || (vacancy.closingDate && new Date(vacancy.closingDate).getTime() + 86_400_000 < Date.now())
  if (closed || vacancy.applicationMode !== 'form') return { ok: false, message: 'Applications for this role are closed.', errors: {} }
  if (get('name').length < 2) errors.name = 'Please enter your name'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get('email'))) errors.email = 'Please enter a valid email address'
  if (get('privacyAcknowledged') !== 'on') errors.privacyAcknowledged = 'Please confirm you have read the privacy notice'
  const idem = get('idempotencyKey')
  if (idem) {
    const d = await payload.find({ collection: 'applications', where: { idempotencyKey: { equals: idem } }, overrideAccess: true, limit: 1 })
    if (d.docs[0]) return { ok: true, reference: d.docs[0].reference! }
  }
  const file = fd.get('cv')
  let cvId: number | undefined
  if (file instanceof File && file.size > 0) {
    const flags = await payload.findGlobal({ slug: 'feature-flags' })
    if (!flags.cvUpload) errors.cv = 'CV upload is not enabled — please include a profile link instead.'
    else if (file.size > MAX_CV) errors.cv = 'CV must be 5 MB or smaller'
    else {
      const buf = Buffer.from(await file.arrayBuffer())
      const magic = CV_TYPES[file.type]
      if (!magic || !magic.every((b, i) => buf[i] === b)) errors.cv = 'CV must be a PDF or Word (.docx) document'
      else if (!Object.keys(errors).length) {
        const cv = await payload.create({
          collection: 'cv-uploads',
          overrideAccess: true,
          data: { scanStatus: process.env.MALWARE_SCANNER_URL ? 'not-scanned' : 'scanner-unavailable' },
          file: { data: buf, mimetype: file.type, name: `cv-${randomUUID()}${file.type === 'application/pdf' ? '.pdf' : '.docx'}`, size: file.size },
        })
        cvId = cv.id
      }
    }
  }
  if (Object.keys(errors).length) return { ok: false, message: 'Please correct the highlighted fields.', errors }
  const reference = makeReference('application')
  const retention = new Date()
  retention.setMonth(retention.getMonth() + 6)
  await payload.create({
    collection: 'applications',
    overrideAccess: true,
    data: {
      reference,
      vacancy: vacancy.id,
      name: get('name'),
      email: get('email'),
      phone: get('phone') || undefined,
      country: get('country') || undefined,
      coverNote: get('coverNote').slice(0, 4000) || undefined,
      profileLink: /^https?:\/\//.test(get('profileLink')) ? get('profileLink') : undefined,
      cv: cvId,
      retentionUntil: retention.toISOString(),
      idempotencyKey: idem || undefined,
    },
  })
  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const to = settings.routing?.careers || process.env.ENQUIRY_FALLBACK_EMAIL
  if (to)
    await payload.create({
      collection: 'notifications',
      overrideAccess: true,
      data: { kind: 'application-alert', to, subject: `[${reference}] Application: ${vacancy.title}`, body: `New application ${reference} for ${vacancy.title}. Review in the CMS.`, status: 'pending', nextAttemptAt: new Date().toISOString() },
    })
  return { ok: true, reference }
}
