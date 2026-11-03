/**
 * Time-zone utilities built on the platform Intl API (no external tz database).
 * Session times are entered as circuit-local wall-clock strings ("YYYY-MM-DDTHH:mm")
 * plus an IANA time zone, and converted to UTC instants for storage and comparison.
 */

export function isValidTimeZone(tz: string | null | undefined): tz is string {
  if (!tz) return false
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone: tz })
    return true
  } catch {
    return false
  }
}

/** Offset (ms) of `tz` relative to UTC at the given instant. */
export function tzOffsetMs(instant: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const parts = Object.fromEntries(dtf.formatToParts(instant).map((p) => [p.type, p.value]))
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second)
  return asUtc - Math.floor(instant.getTime() / 1000) * 1000
}

const LOCAL_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/

/**
 * Convert a wall-clock local time in `tz` to a UTC Date.
 * Handles DST: for times in a spring-forward gap the result is shifted forward (as clocks do);
 * for ambiguous autumn times the earlier (daylight) instant is chosen.
 */
export function localToUtc(local: string, tz: string): Date {
  const m = LOCAL_RE.exec(local)
  if (!m) throw new Error(`Invalid local date-time "${local}" (expected YYYY-MM-DDTHH:mm)`)
  if (!isValidTimeZone(tz)) throw new Error(`Invalid IANA time zone "${tz}"`)
  const [, y, mo, d, h, mi, s] = m
  const naive = Date.UTC(+y, +mo - 1, +d, +h, +mi, s ? +s : 0)
  // Two-pass: guess using the offset at the naive instant, then correct.
  const off1 = tzOffsetMs(new Date(naive), tz)
  let utc = naive - off1
  const off2 = tzOffsetMs(new Date(utc), tz)
  if (off2 !== off1) {
    const alt = naive - off2
    // Prefer the candidate that round-trips to the same wall-clock time; if neither does (gap), take the later.
    const rt = (t: number) => formatInZone(new Date(t), tz, 'iso-local') === local.slice(0, 16)
    if (rt(alt) && !rt(utc)) utc = alt
    else if (rt(alt) && rt(utc)) utc = Math.min(alt, utc)
    else if (!rt(alt) && !rt(utc)) utc = Math.max(alt, utc)
  }
  return new Date(utc)
}

export type ZoneFormat = 'time' | 'date' | 'datetime' | 'iso-local' | 'day' | 'tzname'

export function formatInZone(date: Date | string, tz: string, fmt: ZoneFormat = 'datetime', locale = 'en-GB'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (fmt === 'iso-local') {
    const p = Object.fromEntries(
      new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
        .formatToParts(d)
        .map((x) => [x.type, x.value]),
    )
    return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`
  }
  if (fmt === 'tzname') {
    const p = new Intl.DateTimeFormat(locale, { timeZone: tz, timeZoneName: 'short' }).formatToParts(d)
    return p.find((x) => x.type === 'timeZoneName')?.value ?? tz
  }
  const opts: Intl.DateTimeFormatOptions =
    fmt === 'time'
      ? { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }
      : fmt === 'date'
        ? { day: 'numeric', month: 'short', year: 'numeric' }
        : fmt === 'day'
          ? { weekday: 'short', day: 'numeric', month: 'short' }
          : { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }
  return new Intl.DateTimeFormat(locale, { ...opts, timeZone: tz }).format(d)
}

/** Format a date-only range like "12–14 Apr 2026" (dates are calendar dates, rendered in UTC). */
export function formatDateRange(start?: string | null, end?: string | null): string {
  if (!start) return 'Date TBC'
  const s = new Date(start)
  const e = end ? new Date(end) : s
  const f = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { ...o, timeZone: 'UTC' }).format(d)
  if (s.toISOString().slice(0, 10) === e.toISOString().slice(0, 10)) return f(s, { day: 'numeric', month: 'short', year: 'numeric' })
  if (s.getUTCFullYear() === e.getUTCFullYear() && s.getUTCMonth() === e.getUTCMonth())
    return `${s.getUTCDate()}–${f(e, { day: 'numeric', month: 'short', year: 'numeric' })}`
  return `${f(s, { day: 'numeric', month: 'short' })} – ${f(e, { day: 'numeric', month: 'short', year: 'numeric' })}`
}
