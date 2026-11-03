import { describe, expect, it } from 'vitest'
import { countdownTarget, currentEvents, eventPhase, isSeasonComplete, nextEvent, overlapping, raceCentreState, remaining, type EventLike } from '@/lib/events'

const ev = (id: number, start: string, end: string, status: EventLike['status'] = 'scheduled'): EventLike => ({ id, startDate: `${start}T00:00:00.000Z`, endDate: `${end}T00:00:00.000Z`, status })
const now = new Date('2026-06-01T12:00:00Z')

describe('next-event logic (CAL-12, acceptance #17/#18/#19)', () => {
  it('skips cancelled and postponed events', () => {
    const list = [ev(1, '2026-06-05', '2026-06-07', 'cancelled'), ev(2, '2026-06-10', '2026-06-12', 'postponed'), ev(3, '2026-06-20', '2026-06-21')]
    expect(nextEvent(list, now)?.id).toBe(3)
  })
  it('ignores past and completed events', () => {
    expect(nextEvent([ev(1, '2026-05-01', '2026-05-02'), ev(2, '2026-07-01', '2026-07-02', 'completed')], now)).toBeNull()
  })
  it('season complete replaces countdown when nothing selectable remains', () => {
    expect(isSeasonComplete([ev(1, '2026-05-01', '2026-05-02', 'completed')], now)).toBe(true)
    expect(isSeasonComplete([ev(1, '2026-07-01', '2026-07-02')], now)).toBe(false)
    expect(isSeasonComplete([], now)).toBe(false)
  })
  it('returns all simultaneous race weekends', () => {
    const list = [ev(1, '2026-05-31', '2026-06-01'), ev(2, '2026-06-01', '2026-06-02'), ev(3, '2026-06-20', '2026-06-21')]
    expect(currentEvents(list, now).map((e) => e.id)).toEqual([1, 2])
    expect(overlapping(list).map((g) => g.map((e) => e.id))).toEqual([[1, 2]])
  })
  it('phases', () => {
    expect(eventPhase(ev(1, '2026-06-01', '2026-06-02'), now)).toBe('race-weekend')
    expect(eventPhase(ev(1, '2026-07-01', '2026-07-02'), now)).toBe('upcoming')
    expect(eventPhase(ev(1, '2026-07-01', '2026-07-02', 'cancelled'), now)).toBe('cancelled')
  })
})

describe('race centre (RACE-03/04/12)', () => {
  const e = ev(1, '2026-06-01', '2026-06-02')
  it('is "live" only during a confirmed session window', () => {
    const s = [{ id: 1, name: 'Race 1', startsAt: '2026-06-01T11:30:00Z', endsAt: '2026-06-01T12:10:00Z', certainty: 'confirmed' as const }]
    expect(raceCentreState(e, s, now)).toBe('live-session')
    expect(raceCentreState(e, [{ ...s[0], certainty: 'provisional' }], now)).toBe('between-sessions')
    expect(raceCentreState(e, [], now)).toBe('between-sessions')
    expect(raceCentreState(null, [], now)).toBe('off-season')
  })
  it('counts down only to confirmed future sessions and never goes negative', () => {
    const s = [
      { id: 1, name: 'Past', startsAt: '2026-06-01T10:00:00Z', certainty: 'confirmed' as const },
      { id: 2, name: 'TBC', startsAt: '2026-06-01T13:00:00Z', certainty: 'tbc' as const },
      { id: 3, name: 'Race 2', startsAt: '2026-06-01T14:00:00Z', certainty: 'confirmed' as const },
    ]
    expect(countdownTarget(s, now)?.name).toBe('Race 2')
    expect(remaining('2026-06-01T11:00:00Z', now).ms).toBe(0)
    expect(remaining('2026-06-02T13:01:01Z', now)).toMatchObject({ days: 1, hours: 1, minutes: 1, seconds: 1 })
  })
})
