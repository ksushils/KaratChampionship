/** Result validation and presentation rules (RES-02..RES-18). Unknown values stay null — never zero. */

export const RESULT_STATUSES = ['classified', 'DNS', 'DNF', 'DSQ', 'NC', 'DNQ', 'EXC', 'other'] as const
export type ResultStatus = (typeof RESULT_STATUSES)[number]

export interface ResultEntryInput {
  position?: number | null
  driverName?: string | null
  driver?: string | number | null
  carNumber?: string | null
  entrant?: string | null
  laps?: number | null
  time?: string | null
  gap?: string | null
  points?: number | null
  status?: ResultStatus | null
  isKarat?: boolean | null
}

const TIME_RE = /^(\d+:)?\d{1,2}:\d{2}\.\d{1,4}$|^\d{1,3}\.\d{1,4}$/
const GAP_RE = /^\+?\s?(\d+:)?\d{1,3}(\.\d{1,4})?s?$|^\+?\d+\s+laps?$/i

export interface ValidationIssue {
  row: number
  field: string
  message: string
}

export function validateResultEntries(entries: ResultEntryInput[]): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const positions = new Map<number, number>()
  const drivers = new Map<string, number>()
  entries.forEach((e, i) => {
    const row = i + 1
    if (!e.driverName && !e.driver) issues.push({ row, field: 'driverName', message: 'Driver or entrant name is required' })
    const status = e.status ?? 'classified'
    if (!RESULT_STATUSES.includes(status)) issues.push({ row, field: 'status', message: `Unknown status "${status}"` })
    if (status === 'classified') {
      if (e.position == null) issues.push({ row, field: 'position', message: 'Classified entries need a position' })
    }
    if (e.position != null) {
      if (!Number.isInteger(e.position) || e.position < 1) issues.push({ row, field: 'position', message: 'Position must be a positive whole number' })
      else if (positions.has(e.position))
        issues.push({ row, field: 'position', message: `Duplicate position ${e.position} (also row ${positions.get(e.position)})` })
      else positions.set(e.position, row)
    }
    const key = e.driver != null ? `id:${e.driver}` : e.driverName ? `n:${e.driverName.trim().toLowerCase()}` : null
    if (key) {
      if (drivers.has(key)) issues.push({ row, field: 'driverName', message: `Duplicate driver (also row ${drivers.get(key)})` })
      else drivers.set(key, row)
    }
    if (e.laps != null && (!Number.isInteger(e.laps) || e.laps < 0)) issues.push({ row, field: 'laps', message: 'Laps must be a non-negative whole number' })
    if (e.points != null && (typeof e.points !== 'number' || Number.isNaN(e.points) || e.points < 0))
      issues.push({ row, field: 'points', message: 'Points must be a non-negative number' })
    if (e.time && !TIME_RE.test(e.time.trim())) issues.push({ row, field: 'time', message: `Malformed time "${e.time}"` })
    if (e.gap && !GAP_RE.test(e.gap.trim())) issues.push({ row, field: 'gap', message: `Malformed gap "${e.gap}"` })
  })
  return issues
}

/** Display a possibly-missing value. Missing is "—" with an accessible "Not published" label; zero stays "0". */
export const display = (v: string | number | null | undefined) => (v === null || v === undefined || v === '' ? null : String(v))

/** Parse a CSV result import (header row required). Values are treated strictly as data. */
export function parseResultCsv(csv: string): ResultEntryInput[] {
  const rows = csv
    .trim()
    .split(/\r?\n/)
    .map((l) => splitCsvLine(l))
  const [header, ...body] = rows
  if (!header) return []
  const idx = (n: string) => header.findIndex((h) => h.trim().toLowerCase() === n)
  const num = (v?: string) => (v == null || v.trim() === '' ? null : Number(v))
  const str = (v?: string) => (v == null || v.trim() === '' ? null : v.trim())
  return body
    .filter((r) => r.some((c) => c.trim()))
    .map((r) => ({
      position: num(r[idx('position')]),
      driverName: str(r[idx('driver')]),
      carNumber: str(r[idx('number')]),
      entrant: str(r[idx('entrant')]),
      laps: num(r[idx('laps')]),
      time: str(r[idx('time')]),
      gap: str(r[idx('gap')]),
      points: num(r[idx('points')]),
      status: (str(r[idx('status')]) as ResultStatus) ?? 'classified',
    }))
}

function splitCsvLine(line: string): string[] {
  const out: string[] = []
  let cur = ''
  let q = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (q) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"'
        i++
      } else if (c === '"') q = false
      else cur += c
    } else if (c === '"') q = true
    else if (c === ',') {
      out.push(cur)
      cur = ''
    } else cur += c
  }
  out.push(cur)
  return out
}

export interface SummaryResultSet {
  sessionId: string | number
  classification: string // 'overall' | 'rookie' | ...
  state: 'provisional' | 'final'
  attribution: 'karat' | 'kic' | 'other'
  entries: { position?: number | null; status?: string | null; isKarat?: boolean | null; driver?: string | number | null }[]
}

/**
 * Season summary for Karat entries: counts wins/podiums from OVERALL classifications only,
 * so a class podium in the same race is never double-counted (RES-17), and never includes
 * predecessor (KIC) records (RES-18 / TEAM-05).
 */
export function seasonSummary(sets: SummaryResultSet[]) {
  const overall = sets.filter((s) => s.classification === 'overall' && s.attribution === 'karat')
  // If both provisional and final exist for a session, final wins.
  const bySession = new Map<string | number, SummaryResultSet>()
  for (const s of overall) {
    const prev = bySession.get(s.sessionId)
    if (!prev || (prev.state === 'provisional' && s.state === 'final')) bySession.set(s.sessionId, s)
  }
  let wins = 0
  let podiums = 0
  let starts = 0
  for (const s of bySession.values()) {
    for (const e of s.entries) {
      if (!e.isKarat) continue
      if (e.status !== 'DNS') starts++
      if ((e.status ?? 'classified') === 'classified' && e.position != null) {
        if (e.position === 1) wins++
        if (e.position <= 3) podiums++
      }
    }
  }
  return { races: bySession.size, starts, wins, podiums }
}
