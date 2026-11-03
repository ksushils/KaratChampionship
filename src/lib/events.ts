/** Pure event/race-centre logic (CAL-12, CAL-14, HOME-05, RACE-03, RACE-04). */

export type EventStatus = 'scheduled' | 'provisional' | 'postponed' | 'cancelled' | 'completed' | 'revised'
export type SessionCertainty = 'confirmed' | 'provisional' | 'tbc'

export interface EventLike {
  id: string | number
  status: EventStatus
  startDate?: string | null // calendar date (ISO, midnight UTC)
  endDate?: string | null
  timeZone?: string | null
  type?: string | null
}
export interface SessionLike {
  id: string | number
  name: string
  startsAt?: string | null // UTC instant
  endsAt?: string | null
  certainty?: SessionCertainty | null
  status?: 'scheduled' | 'delayed' | 'cancelled' | 'completed' | null
}

const DAY = 86_400_000
const endOfEvent = (e: EventLike) => {
  const end = e.endDate ?? e.startDate
  // End date is a calendar day; treat as finished at the end of that day (+14h margin for far-east zones).
  return end ? new Date(end).getTime() + DAY + 14 * 3_600_000 : NaN
}
const startOfEvent = (e: EventLike) => (e.startDate ? new Date(e.startDate).getTime() - 14 * 3_600_000 : NaN)

export const isSelectable = (e: EventLike) => e.status !== 'cancelled' && e.status !== 'postponed' && e.status !== 'completed'

/** The next (or current) valid event. Cancelled/postponed/completed and past events are never chosen. */
export function nextEvent<T extends EventLike>(events: T[], now = new Date()): T | null {
  const t = now.getTime()
  const candidates = events
    .filter((e) => isSelectable(e) && e.startDate && endOfEvent(e) > t)
    .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime())
  return candidates[0] ?? null
}

/** Events running "now" (race weekend in progress), possibly several across programmes. */
export function currentEvents<T extends EventLike>(events: T[], now = new Date()): T[] {
  const t = now.getTime()
  return events.filter((e) => isSelectable(e) && startOfEvent(e) <= t && endOfEvent(e) > t)
}

export type EventPhase = 'upcoming' | 'race-weekend' | 'completed' | 'postponed' | 'cancelled'
export function eventPhase(e: EventLike, now = new Date()): EventPhase {
  if (e.status === 'cancelled') return 'cancelled'
  if (e.status === 'postponed') return 'postponed'
  if (e.status === 'completed') return 'completed'
  const t = now.getTime()
  if (endOfEvent(e) <= t) return 'completed'
  if (startOfEvent(e) <= t) return 'race-weekend'
  return 'upcoming'
}

export type RaceCentreState = 'off-season' | 'pre-event' | 'live-session' | 'between-sessions' | 'completed'

/**
 * Race Centre state for one event. "live-session" requires a session with a confirmed
 * start whose window contains `now` — never inferred from the weekend alone (RACE acceptance).
 */
export function raceCentreState(e: EventLike | null, sessions: SessionLike[], now = new Date()): RaceCentreState {
  if (!e) return 'off-season'
  const phase = eventPhase(e, now)
  if (phase === 'completed' || phase === 'cancelled') return 'completed'
  if (phase === 'upcoming' || phase === 'postponed') return 'pre-event'
  const t = now.getTime()
  const live = sessions.some(
    (s) =>
      s.status !== 'cancelled' &&
      s.certainty === 'confirmed' &&
      s.startsAt &&
      s.endsAt &&
      new Date(s.startsAt).getTime() <= t &&
      new Date(s.endsAt).getTime() > t,
  )
  return live ? 'live-session' : 'between-sessions'
}

/** Next session with a verified (confirmed) start strictly in the future — the only valid countdown target. */
export function countdownTarget(sessions: SessionLike[], now = new Date()): SessionLike | null {
  const t = now.getTime()
  return (
    sessions
      .filter((s) => s.certainty === 'confirmed' && s.status !== 'cancelled' && s.startsAt && new Date(s.startsAt).getTime() > t)
      .sort((a, b) => new Date(a.startsAt!).getTime() - new Date(b.startsAt!).getTime())[0] ?? null
  )
}

/** Remaining time, clamped at zero — never negative (RACE-04). */
export function remaining(target: string | Date, now = new Date()) {
  const ms = Math.max(0, new Date(target).getTime() - now.getTime())
  return {
    ms,
    days: Math.floor(ms / DAY),
    hours: Math.floor((ms % DAY) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000),
  }
}

/** True when the season has no further selectable events (CAL-14). */
export const isSeasonComplete = (events: EventLike[], now = new Date()) => events.length > 0 && !nextEvent(events, now)

/** Group events whose date ranges overlap (CAL-13). */
export function overlapping<T extends EventLike>(events: T[]): T[][] {
  const sorted = events.filter((e) => e.startDate).sort((a, b) => +new Date(a.startDate!) - +new Date(b.startDate!))
  const groups: T[][] = []
  for (const e of sorted) {
    const g = groups[groups.length - 1]
    const last = g?.[g.length - 1]
    const lastEnd = last ? new Date(last.endDate ?? last.startDate!).getTime() : -Infinity
    if (g && new Date(e.startDate!).getTime() <= lastEnd) g.push(e)
    else groups.push([e])
  }
  return groups.filter((g) => g.length > 1)
}
