import { describe, expect, it } from 'vitest'
import { buildIcs, fold } from '@/lib/ics'
import { display, parseResultCsv, seasonSummary, validateResultEntries } from '@/lib/results'
import { isCurrentPartnership, sortByHierarchy } from '@/lib/partners'
import { canDownload, rightsValid } from '@/lib/media-rights'
import { rolloverProgrammeSeason } from '@/lib/season-rollover'
import { raceEnquirySchema, generalEnquirySchema, CATEGORY_DIVISION } from '@/lib/enquiry-schema'
import { rateLimit, resetRateLimits } from '@/lib/rate-limit'
import { makeReference } from '@/lib/reference'
import { sanitizeProps } from '@/components/analytics'

describe('ICS (CAL-10/11)', () => {
  it('produces valid VCALENDAR with stable UID, CRLF and folding', () => {
    const ics = buildIcs([{ uid: 'event-1@karat', title: 'Round 1, Monza; test', start: new Date('2026-06-01T00:00:00Z'), end: new Date('2026-06-02T00:00:00Z'), allDay: true, status: 'CANCELLED' }])
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true)
    expect(ics).toContain('UID:event-1@karat')
    expect(ics).toContain('DTSTART;VALUE=DATE:20260601')
    expect(ics).toContain('DTEND;VALUE=DATE:20260603')
    expect(ics).toContain('SUMMARY:Round 1\\, Monza\; test')
    expect(ics).toContain('STATUS:CANCELLED')
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true)
    const long = fold('DESCRIPTION:' + 'x'.repeat(200))
    expect(long.split('\r\n').every((l) => Buffer.byteLength(l) <= 75)).toBe(true)
  })
})

describe('results (RES-13/15/17/18, acceptance #21/#29)', () => {
  it('rejects duplicates and malformed values', () => {
    const issues = validateResultEntries([
      { position: 1, driverName: 'A', time: '25:41.233' },
      { position: 1, driverName: 'B', time: 'fast' },
      { position: null, driverName: 'A', status: 'classified' },
      { driverName: 'C', status: 'DNF', points: -1 },
    ])
    const msgs = issues.map((i) => `${i.row}:${i.field}`)
    expect(msgs).toEqual(expect.arrayContaining(['2:position', '2:time', '3:position', '3:driverName', '4:points']))
  })
  it('accepts a clean classification with DNF', () => {
    expect(validateResultEntries([{ position: 1, driverName: 'A', gap: null }, { position: 2, driverName: 'B', gap: '+1.638' }, { driverName: 'C', status: 'DNF' }])).toEqual([])
  })
  it('missing data is not zero', () => {
    expect(display(null)).toBeNull()
    expect(display(undefined)).toBeNull()
    expect(display(0)).toBe('0')
  })
  it('CSV import keeps blanks as null', () => {
    const rows = parseResultCsv('position,driver,number,points,status\n1,"Doe, J",7,25,classified\n,Roe,9,,DNF\n')
    expect(rows[0]).toMatchObject({ position: 1, driverName: 'Doe, J', points: 25 })
    expect(rows[1]).toMatchObject({ position: null, points: null, status: 'DNF' })
  })
  it('season summary never double-counts class podiums nor includes KIC records', () => {
    const s = seasonSummary([
      { sessionId: 1, classification: 'overall', state: 'final', attribution: 'karat', entries: [{ position: 2, isKarat: true }] },
      { sessionId: 1, classification: 'rookie', state: 'final', attribution: 'karat', entries: [{ position: 1, isKarat: true }] },
      { sessionId: 2, classification: 'overall', state: 'provisional', attribution: 'karat', entries: [{ position: 5, isKarat: true }] },
      { sessionId: 2, classification: 'overall', state: 'final', attribution: 'karat', entries: [{ position: 1, isKarat: true }] },
      { sessionId: 9, classification: 'overall', state: 'final', attribution: 'kic', entries: [{ position: 1, isKarat: true }] },
    ])
    expect(s).toEqual({ races: 2, starts: 2, wins: 1, podiums: 2 })
  })
})

describe('partners & media rights (acceptance #22/#23)', () => {
  const now = new Date('2026-06-01T00:00:00Z')
  it('expired or unapproved partnerships are not current', () => {
    expect(isCurrentPartnership({ publicationApproved: true, startDate: '2026-01-01', endDate: '2026-12-31' }, now)).toBe(true)
    expect(isCurrentPartnership({ publicationApproved: true, endDate: '2026-05-01' }, now)).toBe(false)
    expect(isCurrentPartnership({ publicationApproved: true, startDate: '2026-07-01' }, now)).toBe(false)
    expect(isCurrentPartnership({ publicationApproved: false }, now)).toBe(false)
  })
  it('orders by tier hierarchy', () => {
    expect(sortByHierarchy([{ tier: 'supplier' }, { tier: 'title' }, { tier: 'official', displayOrder: 2 }, { tier: 'official', displayOrder: 1 }]).map((x) => `${x.tier}${x.displayOrder ?? ''}`)).toEqual(['title', 'official1', 'official2', 'supplier'])
  })
  it('expired media cannot be downloaded', () => {
    expect(canDownload({ publicUseApproved: true, downloadPermitted: true, rightsExpiresAt: '2026-05-01' }, now)).toBe(false)
    expect(canDownload({ publicUseApproved: true, downloadPermitted: true }, now)).toBe(true)
    expect(rightsValid({ publicUseApproved: false }, now)).toBe(false)
  })
})

describe('season rollover (CMS-18, acceptance #13)', () => {
  it('never copies confirmation or seat status', () => {
    const next = rolloverProgrammeSeason({ programme: 1, year: 2026, participationStatus: 'confirmed', seatAvailability: 'full', relationshipType: 'entrant' })
    expect(next).toMatchObject({ year: 2027, participationStatus: 'intended', seatAvailability: 'not-published', relationshipType: 'entrant' })
    expect(() => rolloverProgrammeSeason({ programme: 1, year: 2026 }, 2025)).toThrow()
  })
})

describe('enquiry validation (LEAD-03..12)', () => {
  const base = { category: 'race-programme', programme: 'gb4', role: 'parent-guardian', ageBand: '14-15', name: 'Pat Parent', email: 'pat@example.com', country: 'UK', privacyAcknowledged: true, idempotencyKey: 'abcdefgh1234' }
  it('parent/guardian can enquire for a minor', () => expect(raceEnquirySchema.safeParse(base).success).toBe(true))
  it('minor driver enquiring alone must add guardian details', () => {
    const r = raceEnquirySchema.safeParse({ ...base, role: 'driver' })
    expect(r.success).toBe(false)
    expect(r.error!.issues.map((i) => i.path[0])).toEqual(expect.arrayContaining(['guardianName', 'guardianEmail', 'guardianConsent']))
  })
  it('marketing opt-in is optional', () => expect(raceEnquirySchema.parse(base).marketingOptIn).toBe(false))
  it('honeypot rejects bots', () => expect(raceEnquirySchema.safeParse({ ...base, website: 'spam' }).success).toBe(false))
  it('privacy acknowledgement required', () => expect(raceEnquirySchema.safeParse({ ...base, privacyAcknowledged: false }).success).toBe(false))
  it('general messages need content', () => expect(generalEnquirySchema.safeParse({ ...base, category: 'media', message: 'hi' }).success).toBe(false))
  it('testing & organisation route to their own divisions', () => {
    expect(CATEGORY_DIVISION.testing).toBe('testing')
    expect(CATEGORY_DIVISION['championship-organisation']).toBe('championship-organisation')
    expect(CATEGORY_DIVISION['race-programme']).toBe('championship-team')
  })
})

describe('misc', () => {
  it('rate limiter blocks after the limit', () => {
    resetRateLimits()
    const r = [1, 2, 3].map(() => rateLimit('k', 2, 1000, 0))
    expect(r.map((x) => x.ok)).toEqual([true, true, false])
    expect(rateLimit('k', 2, 1000, 2000).ok).toBe(true)
  })
  it('references are prefixed and non-sequential', () => {
    const a = makeReference('race-programme')
    expect(a).toMatch(/^KR-RP-[A-Z2-9]{6}$/)
    expect(makeReference('race-programme')).not.toBe(a)
  })
  it('analytics never carries PII', () => {
    expect(sanitizeProps({ email: 'a@b.c', name: 'X', programme: 'gb4', note: 'call +44 7700 900123', step: 2 })).toEqual({ programme: 'gb4', step: 2 })
  })
})
