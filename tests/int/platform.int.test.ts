import { beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'
import sharp from 'sharp'
import { bootPayload, makeUser } from './setup'
import { seedBase } from '../../scripts/seed'
import { findDemoContent } from '../../scripts/check-production-content'
import { submitEnquiry } from '@/lib/enquiry-service'
import { processNotificationQueue } from '@/lib/notifications'
import { resetEmailAdapter } from '@/lib/email'
import { currentPartnershipWhere } from '@/lib/partners'
import { publicMediaWhere } from '@/lib/media-rights'
import { rolloverProgrammeSeason } from '@/lib/season-rollover'

let payload: Payload
let ids: Awaited<ReturnType<typeof seedBase>>
const users: Record<string, any> = {}
let n = 0
const key = () => `test-key-${Date.now()}-${n++}`
const race = (extra: Record<string, unknown> = {}) => ({
  category: 'race-programme', programme: 'gb4', season: '2027', role: 'parent-guardian', ageBand: '14-15', name: 'Pat Parent', email: 'pat@example.com', country: 'United Kingdom', privacyAcknowledged: true, idempotencyKey: key(), ...extra,
})
const asUser = (u: any) => ({ overrideAccess: false, user: u })

beforeAll(async () => {
  payload = await bootPayload()
  ids = await seedBase(payload)
  users.admin = await makeUser(payload, 'admin@test.local', ['admin'], ['championship-team', 'testing', 'championship-organisation'])
  users.editor = await makeUser(payload, 'editor@test.local', ['editor'])
  users.commercial = await makeUser(payload, 'commercial@test.local', ['commercial'])
  users.media = await makeUser(payload, 'media@test.local', ['media'])
  users.raceData = await makeUser(payload, 'race@test.local', ['raceData'])
  users.recruiter = await makeUser(payload, 'recruiter@test.local', ['recruiter'])
})

describe('programmes (acceptance #3, #4)', () => {
  it('seeded programmes are intended or future — never confirmed', async () => {
    const r = await payload.find({ collection: 'programmes', overrideAccess: false, limit: 50 })
    expect(r.docs.map((d) => d.slug)).toEqual(expect.arrayContaining(['italian-f4', 'gb4', 'indian-f4']))
    expect(r.docs.every((d) => ['intended', 'future'].includes(d.status))).toBe(true)
  })
  it('cannot mark a programme Confirmed without an entry-confirmation source', async () => {
    await expect(payload.update({ collection: 'programmes', id: ids.prog.gb4, data: { status: 'confirmed', substantiation: { sources: [] } }, overrideAccess: true })).rejects.toThrow()
  })
  it('owner kill-switch hides a programme from the public', async () => {
    await payload.update({ collection: 'programmes', id: ids.prog['formula-x-f2000'], data: { enabled: false }, overrideAccess: true })
    const r = await payload.find({ collection: 'programmes', where: { slug: { equals: 'formula-x-f2000' } }, overrideAccess: false })
    expect(r.docs).toHaveLength(0)
    await payload.update({ collection: 'programmes', id: ids.prog['formula-x-f2000'], data: { enabled: true }, overrideAccess: true })
  })
})

describe('enquiries (acceptance #6–#11, #24, #30)', () => {
  it('persists before success and survives an email-provider failure', async () => {
    process.env.EMAIL_ADAPTER = 'fail'
    resetEmailAdapter()
    process.env.ENQUIRY_FALLBACK_EMAIL = 'team@test.local'
    const res = await submitEnquiry(payload, race())
    expect(res.ok).toBe(true)
    const ref = (res as { reference: string }).reference
    const stored = await payload.find({ collection: 'enquiries', where: { reference: { equals: ref } }, overrideAccess: true })
    expect(stored.docs).toHaveLength(1)
    expect(stored.docs[0]).toMatchObject({ division: 'championship-team', category: 'race-programme', programme: 'gb4', involvesMinor: true, marketingOptIn: false })
    const notes = await payload.find({ collection: 'notifications', where: { enquiry: { equals: stored.docs[0].id } }, overrideAccess: true })
    expect(notes.docs.length).toBe(2)
    expect(notes.docs.every((x) => x.status === 'pending' && (x.attempts ?? 0) >= 1 && x.lastError)).toBe(true)
    // Provider recovers → queued notifications are delivered on retry.
    process.env.EMAIL_ADAPTER = 'log'
    resetEmailAdapter()
    await payload.update({ collection: 'notifications', where: { enquiry: { equals: stored.docs[0].id } }, data: { nextAttemptAt: new Date(0).toISOString() }, overrideAccess: true })
    await processNotificationQueue(payload)
    const after = await payload.find({ collection: 'notifications', where: { enquiry: { equals: stored.docs[0].id } }, overrideAccess: true })
    expect(after.docs.every((x) => x.status === 'sent')).toBe(true)
  })
  it('unconfigured email never reports delivery', async () => {
    process.env.EMAIL_ADAPTER = 'none'
    resetEmailAdapter()
    const res = await submitEnquiry(payload, race())
    expect(res.ok).toBe(true)
    const e = await payload.find({ collection: 'enquiries', where: { reference: { equals: (res as any).reference } }, overrideAccess: true })
    const notes = await payload.find({ collection: 'notifications', where: { enquiry: { equals: e.docs[0].id } }, overrideAccess: true })
    expect(notes.docs.every((x) => x.status === 'pending' && /not configured/.test(x.lastError ?? ''))).toBe(true)
  })
  it('duplicate submissions return the original reference and store once', async () => {
    const data = race()
    const a = await submitEnquiry(payload, data, { deferNotifications: true })
    const b = await submitEnquiry(payload, data, { deferNotifications: true })
    expect(a.ok && b.ok).toBe(true)
    expect((b as any).reference).toBe((a as any).reference)
    expect((b as any).duplicate).toBe(true)
    const c = await payload.count({ collection: 'enquiries', where: { idempotencyKey: { equals: data.idempotencyKey } }, overrideAccess: true })
    expect(c.totalDocs).toBe(1)
  })
  it('minor driver must include guardian; guardian path works', async () => {
    const bad = await submitEnquiry(payload, race({ role: 'driver' }), { deferNotifications: true })
    expect(bad.ok).toBe(false)
    const ok = await submitEnquiry(payload, race({ role: 'driver', guardianName: 'G', guardianEmail: 'g@example.com', guardianConsent: true }), { deferNotifications: true })
    expect(ok.ok).toBe(true)
  })
  it('marketing opt-in is stored separately and optional', async () => {
    const r = await submitEnquiry(payload, race({ marketingOptIn: true }), { deferNotifications: true })
    const e = await payload.find({ collection: 'enquiries', where: { reference: { equals: (r as any).reference } }, overrideAccess: true })
    expect(e.docs[0].marketingOptIn).toBe(true)
  })
  it('testing and organisation enquiries go to their own divisions', async () => {
    const t = await submitEnquiry(payload, { category: 'testing', name: 'Tess', email: 't@example.com', country: 'IT', message: 'I would like a pre-season test.', privacyAcknowledged: true, idempotencyKey: key() }, { deferNotifications: true })
    const o = await submitEnquiry(payload, { category: 'championship-organisation', name: 'Om', email: 'o@example.com', country: 'IN', message: 'We operate a circuit in India.', privacyAcknowledged: true, idempotencyKey: key() }, { deferNotifications: true })
    const docs = await payload.find({ collection: 'enquiries', where: { reference: { in: [(t as any).reference, (o as any).reference] } }, overrideAccess: true })
    expect(docs.docs.map((d) => `${d.category}:${d.division}`).sort()).toEqual(['championship-organisation:championship-organisation', 'testing:testing'])
  })
  it('enforces record-level access by role', async () => {
    await submitEnquiry(payload, { category: 'partnership', organisation: 'Acme', name: 'Sam', email: 's@example.com', country: 'UK', privacyAcknowledged: true, idempotencyKey: key() }, { deferNotifications: true })
    await submitEnquiry(payload, { category: 'media', name: 'Jo', email: 'j@example.com', country: 'UK', message: 'Interview request please', privacyAcknowledged: true, idempotencyKey: key() }, { deferNotifications: true })
    await submitEnquiry(payload, { category: 'safeguarding', name: 'Al', email: 'a@example.com', country: 'UK', message: 'A welfare concern to raise.', privacyAcknowledged: true, idempotencyKey: key() }, { deferNotifications: true })
    const cats = async (u?: any) => {
      try {
        return [...new Set((await payload.find({ collection: 'enquiries', limit: 200, overrideAccess: false, user: u })).docs.map((d) => d.category))].sort()
      } catch (e) {
        if ((e as Error).name === 'Forbidden') return [] // denied outright
        throw e
      }
    }
    expect(await cats(users.commercial)).toEqual(['partnership', 'race-programme'])
    expect(await cats(users.media)).toEqual(['media'])
    expect(await cats(users.raceData)).toEqual([])
    expect(await cats(users.recruiter)).toEqual([])
    expect(await cats(users.admin)).toEqual(expect.arrayContaining(['safeguarding', 'testing', 'championship-organisation']))
    await expect(payload.find({ collection: 'enquiries', overrideAccess: false })).rejects.toThrow()
  })
})

describe('careers (acceptance #34)', () => {
  it('race-data editor cannot read applications; recruiter can', async () => {
    const v = await payload.create({ collection: 'vacancies', data: { title: 'Test role', applicationMode: 'form', _status: 'published' }, overrideAccess: true })
    await payload.create({ collection: 'applications', data: { reference: 'KR-AP-TEST01', vacancy: v.id, name: 'App', email: 'app@example.com' }, overrideAccess: true })
    await expect(payload.find({ collection: 'applications', ...asUser(users.raceData) })).rejects.toThrow()
    await expect(payload.find({ collection: 'applications', overrideAccess: false })).rejects.toThrow()
    const r = await payload.find({ collection: 'applications', ...asUser(users.recruiter) })
    expect(r.docs.length).toBe(1)
    await expect(payload.find({ collection: 'cv-uploads', overrideAccess: false })).rejects.toThrow()
  })
})

describe('embargo & search (acceptance #12, #28)', () => {
  it('embargoed driver is absent from public reads and site search', async () => {
    const future = new Date(Date.now() + 7 * 86_400_000).toISOString()
    await payload.create({ collection: 'drivers', data: { name: 'Secret Signing', announceAt: future, _status: 'published' }, overrideAccess: true })
    await payload.create({ collection: 'drivers', data: { name: 'Draft Driver' }, overrideAccess: true, draft: true })
    await payload.create({ collection: 'drivers', data: { name: 'Public Driver', _status: 'published' }, overrideAccess: true })
    const pub = await payload.find({ collection: 'drivers', overrideAccess: false })
    expect(pub.docs.map((d) => d.name)).toEqual(['Public Driver'])
    const { siteSearch } = await import('@/lib/search')
    expect((await siteSearch('Secret')).length).toBe(0)
    expect((await siteSearch('Draft Driver')).length).toBe(0)
    expect((await siteSearch('Public Driver')).map((h) => h.title)).toContain('Public Driver')
    expect((await siteSearch('Pat Parent')).length).toBe(0) // enquiry data never searchable
  })
})

describe('seasons & engagements (acceptance #13, #14)', () => {
  it('rollover creates an intended season without copying confirmation', async () => {
    const prev = await payload.create({ collection: 'programme-seasons', data: { programme: ids.prog['italian-f4'], year: 2030, participationStatus: 'confirmed', seatAvailability: 'full' }, overrideAccess: true })
    const next = await payload.create({ collection: 'programme-seasons', data: rolloverProgrammeSeason({ ...prev, programme: ids.prog['italian-f4'] }) as any, overrideAccess: true })
    expect(next).toMatchObject({ year: 2031, participationStatus: 'intended', seatAvailability: 'not-published' })
  })
  it('one driver can carry different numbers across seasons', async () => {
    const d = await payload.create({ collection: 'drivers', data: { name: 'Number Changer', _status: 'published' }, overrideAccess: true })
    await payload.create({ collection: 'driver-engagements', data: { driver: d.id, programme: ids.prog.gb4, season: 2026, number: '7', _status: 'published' }, overrideAccess: true })
    await payload.create({ collection: 'driver-engagements', data: { driver: d.id, programme: ids.prog['italian-f4'], season: 2027, number: '15', _status: 'published' }, overrideAccess: true })
    const r = await payload.find({ collection: 'driver-engagements', where: { driver: { equals: d.id } }, sort: 'season', overrideAccess: false })
    expect(r.docs.map((e) => `${e.season}#${e.number}`)).toEqual(['2026#7', '2027#15'])
  })
})

describe('events, sessions and results (acceptance #15, #20, #21)', () => {
  it('session local time converts to UTC with the circuit zone', async () => {
    const c = await payload.create({ collection: 'circuits', data: { name: 'Test Ring', country: 'Italy', timeZone: 'Europe/Rome' }, overrideAccess: true })
    const e = await payload.create({ collection: 'events', data: { title: 'Test Round', season: 2026, startDate: '2026-03-28', endDate: '2026-03-29', circuit: c.id, _status: 'published' } as any, overrideAccess: true })
    expect(e.timeZone).toBe('Europe/Rome')
    const s = await payload.create({ collection: 'sessions', data: { event: e.id, name: 'Race', localStart: '2026-03-29T10:00', localEnd: '2026-03-29T10:30' }, overrideAccess: true })
    expect(s.startsAt).toBe('2026-03-29T08:00:00.000Z')
    await expect(payload.create({ collection: 'sessions', data: { event: e.id, name: 'Bad', localStart: '2026-03-29T10:00', localEnd: '2026-03-29T09:00' }, overrideAccess: true })).rejects.toThrow()
  })
  it('provisional → final keeps an audit trail; missing values stay null; invalid data rejected', async () => {
    const e = await payload.find({ collection: 'events', where: { title: { equals: 'Test Round' } }, overrideAccess: true })
    const s = await payload.find({ collection: 'sessions', where: { name: { equals: 'Race' } }, overrideAccess: true })
    const rs = await payload.create({
      collection: 'result-sets',
      data: { ...({} as any), label: 'Race — Overall', event: e.docs[0].id, session: s.docs[0].id, season: 2026, state: 'provisional', verification: 'verified', source: { url: 'https://example.org/r' }, entries: [{ position: 1, driverName: 'A', points: null }, { driverName: 'B', status: 'DNF' }], _status: 'published' },
      overrideAccess: false,
      user: users.raceData,
    })
    expect(rs.entries?.[0].points).toBeNull()
    await payload.update({ collection: 'result-sets', id: rs.id, data: { state: 'final', penaltyNotes: 'Revised after penalty', _status: 'published' }, overrideAccess: false, user: users.raceData })
    const versions = await payload.findVersions({ collection: 'result-sets', where: { parent: { equals: rs.id } }, overrideAccess: true })
    expect(versions.docs.map((v) => v.version.state)).toEqual(expect.arrayContaining(['provisional', 'final']))
    const audit = await payload.find({ collection: 'audit-logs', where: { and: [{ collectionSlug: { equals: 'result-sets' } }, { documentId: { equals: String(rs.id) } }] }, overrideAccess: true })
    expect(audit.docs.length).toBeGreaterThanOrEqual(2)
    expect(audit.docs.every((a) => a.userEmail === 'race@test.local')).toBe(true)
    await expect(payload.create({ collection: 'result-sets', data: { ...({} as any), label: 'Dup', event: e.docs[0].id, session: s.docs[0].id, season: 2026, entries: [{ position: 1, driverName: 'A' }, { position: 1, driverName: 'B' }] }, overrideAccess: true })).rejects.toThrow(/Duplicate position/)
  })
  it('unverified results are not public', async () => {
    const e = await payload.find({ collection: 'events', where: { title: { equals: 'Test Round' } }, overrideAccess: true })
    const s = await payload.find({ collection: 'sessions', where: { name: { equals: 'Race' } }, overrideAccess: true })
    await payload.create({ collection: 'result-sets', data: { ...({} as any), label: 'Unverified', event: e.docs[0].id, session: s.docs[0].id, season: 2026, verification: 'unverified', entries: [], _status: 'published' }, overrideAccess: true })
    const pub = await payload.find({ collection: 'result-sets', overrideAccess: false })
    expect(pub.docs.map((d) => d.label)).not.toContain('Unverified')
  })
})

describe('rights (acceptance #22, #23)', () => {
  it('expired partnerships are not current', async () => {
    const p = await payload.create({ collection: 'partners', data: { name: 'Old Sponsor', publicationApproved: true }, overrideAccess: true })
    await payload.create({ collection: 'partnerships', data: { partner: p.id, tier: 'official', startDate: '2024-01-01', endDate: '2025-01-01', publicationApproved: true }, overrideAccess: true })
    const cur = await payload.find({ collection: 'partnerships', where: currentPartnershipWhere(), overrideAccess: false })
    expect(cur.docs.length).toBe(0)
  })
  it('media with expired rights is withdrawn from public access', async () => {
    const png = await sharp({ create: { width: 4, height: 4, channels: 3, background: '#123456' } }).png().toBuffer()
    const file = { data: png, mimetype: 'image/png', name: 'x.png', size: png.length }
    await payload.create({ collection: 'media', data: { alt: 'expired', publicUseApproved: true, downloadPermitted: true, rightsExpiresAt: '2025-01-01' }, file, overrideAccess: true })
    await payload.create({ collection: 'media', data: { alt: 'valid', publicUseApproved: true }, file: { ...file, name: 'y.png' }, overrideAccess: true })
    await payload.create({ collection: 'media', data: { alt: 'unapproved' }, file: { ...file, name: 'z.png' }, overrideAccess: true })
    const pub = await payload.find({ collection: 'media', overrideAccess: false })
    expect(pub.docs.map((m) => m.alt)).toEqual(['valid'])
    expect(publicMediaWhere()).toBeTruthy()
  })
})

describe('editorial workflow (acceptance #33, CMS-04)', () => {
  it('editor cannot publish until an admin approves, then can publish', async () => {
    const draft = await payload.create({ collection: 'articles', data: { title: 'Launch news', type: 'announcement' }, draft: true, ...asUser(users.editor) })
    await expect(payload.update({ collection: 'articles', id: draft.id, data: { _status: 'published' }, ...asUser(users.editor) })).rejects.toThrow(/approved/)
    await payload.update({ collection: 'articles', id: draft.id, data: { editorialStatus: 'approved' }, draft: true, ...asUser(users.admin) })
    const pub = await payload.update({ collection: 'articles', id: draft.id, data: { _status: 'published' }, ...asUser(users.editor) })
    expect(pub._status).toBe('published')
    expect(pub.publishedAt).toBeTruthy()
    const visible = await payload.find({ collection: 'articles', where: { slug: { equals: 'launch-news' } }, overrideAccess: false })
    expect(visible.docs).toHaveLength(1)
  })
  it('changing a published slug creates a redirect', async () => {
    const a = await payload.find({ collection: 'articles', where: { slug: { equals: 'launch-news' } }, overrideAccess: true })
    await payload.update({ collection: 'articles', id: a.docs[0].id, data: { slug: 'launch-news-2027' }, overrideAccess: true })
    const r = await payload.find({ collection: 'redirects', where: { from: { equals: '/championship-team/news/launch-news' } }, overrideAccess: true })
    expect(r.docs[0]?.to).toBe('/championship-team/news/launch-news-2027')
  })
  it('a minor cannot be published without recorded consent', async () => {
    await expect(payload.create({ collection: 'drivers', data: { name: 'Young Driver', isMinor: true, _status: 'published' }, overrideAccess: true })).rejects.toThrow(/minor/)
  })
})

describe('testing division boundary (brief §25)', () => {
  it('reserved fleet data is never publicly readable', async () => {
    await payload.create({ collection: 'test-cars', data: { name: 'Internal car', ownership: 'partner' }, overrideAccess: true })
    await expect(payload.find({ collection: 'test-cars', overrideAccess: false })).rejects.toThrow()
    await expect(payload.find({ collection: 'test-cars', ...asUser(users.raceData) })).rejects.toThrow()
    expect((await payload.find({ collection: 'test-cars', ...asUser(users.commercial) })).docs).toHaveLength(1)
  })
})

describe('launch gate (acceptance #35)', () => {
  it('base seed contains no demo fixtures', async () => {
    expect(await findDemoContent(payload)).toEqual({})
  })
})
