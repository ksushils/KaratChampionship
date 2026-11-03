import { describe, expect, it } from 'vitest'
import { formatInZone, isValidTimeZone, localToUtc } from '@/lib/time'

describe('time zones (CAL-06, acceptance #15/#16)', () => {
  it('validates IANA zones', () => {
    expect(isValidTimeZone('Europe/Rome')).toBe(true)
    expect(isValidTimeZone('Asia/Kolkata')).toBe(true)
    expect(isValidTimeZone('Mars/Olympus')).toBe(false)
    expect(isValidTimeZone('')).toBe(false)
  })
  it('converts circuit-local time to UTC in summer and winter', () => {
    expect(localToUtc('2026-07-12T14:00', 'Europe/London').toISOString()).toBe('2026-07-12T13:00:00.000Z')
    expect(localToUtc('2026-01-12T14:00', 'Europe/London').toISOString()).toBe('2026-01-12T14:00:00.000Z')
    expect(localToUtc('2026-07-12T14:00', 'Europe/Rome').toISOString()).toBe('2026-07-12T12:00:00.000Z')
    expect(localToUtc('2026-09-12T10:30', 'Asia/Kolkata').toISOString()).toBe('2026-09-12T05:00:00.000Z')
  })
  it('handles the spring-forward gap (Europe/Rome, 29 Mar 2026 02:30 does not exist)', () => {
    const d = localToUtc('2026-03-29T02:30', 'Europe/Rome')
    // Clocks jump 02:00 → 03:00 CEST; the time is moved forward, never backwards.
    expect(d.toISOString()).toBe('2026-03-29T01:30:00.000Z')
    expect(formatInZone(d, 'Europe/Rome', 'iso-local')).toBe('2026-03-29T03:30')
  })
  it('handles the ambiguous autumn hour by choosing the first occurrence', () => {
    // 01:30 happens twice in London on 25 Oct 2026 (BST then GMT).
    expect(localToUtc('2026-10-25T01:30', 'Europe/London').toISOString()).toBe('2026-10-25T00:30:00.000Z')
    expect(localToUtc('2026-10-25T02:30', 'Europe/London').toISOString()).toBe('2026-10-25T02:30:00.000Z')
  })
  it('session either side of a DST change keeps correct wall-clock times', () => {
    const sat = localToUtc('2026-03-28T10:00', 'Europe/Rome')
    const sun = localToUtc('2026-03-29T10:00', 'Europe/Rome')
    expect(sun.getTime() - sat.getTime()).toBe(23 * 3_600_000)
    expect(formatInZone(sun, 'Europe/Rome', 'time')).toBe('10:00')
  })
  it('round-trips and renders in another viewer zone', () => {
    const d = localToUtc('2026-05-03T15:05', 'Europe/Rome')
    expect(formatInZone(d, 'Europe/Rome', 'iso-local')).toBe('2026-05-03T15:05')
    expect(formatInZone(d, 'Asia/Kolkata', 'iso-local')).toBe('2026-05-03T18:35')
  })
  it('rejects malformed input', () => {
    expect(() => localToUtc('2026-05-03 15:05', 'Europe/Rome')).toThrow()
    expect(() => localToUtc('2026-05-03T15:05', 'Nowhere/City')).toThrow()
  })
})
