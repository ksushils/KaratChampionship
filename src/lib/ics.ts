/** RFC 5545 iCalendar generation (CAL-10, CAL-11). Stable UIDs derive from record IDs. */

export interface IcsEvent {
  uid: string
  title: string
  start: Date
  end?: Date | null
  allDay?: boolean
  location?: string
  description?: string
  url?: string
  status?: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED'
  updated?: Date
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
const utc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const dateOnly = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '')

/** Fold lines longer than 75 octets per RFC 5545 §3.1. */
export function fold(line: string): string {
  const bytes = Buffer.from(line, 'utf8')
  if (bytes.length <= 75) return line
  const out: string[] = []
  let cur = ''
  let curLen = 0
  for (const ch of line) {
    const l = Buffer.byteLength(ch, 'utf8')
    const limit = out.length === 0 ? 75 : 74
    if (curLen + l > limit) {
      out.push(cur)
      cur = ''
      curLen = 0
    }
    cur += ch
    curLen += l
  }
  out.push(cur)
  return out.join('\r\n ')
}

export function buildIcs(events: IcsEvent[], calName = 'Karat Racing'): string {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Karat Racing//Website//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', `X-WR-CALNAME:${esc(calName)}`]
  const stamp = utc(new Date())
  for (const e of events) {
    lines.push('BEGIN:VEVENT', `UID:${e.uid}`, `DTSTAMP:${stamp}`)
    if (e.allDay) {
      const end = new Date((e.end ?? e.start).getTime() + 86_400_000)
      lines.push(`DTSTART;VALUE=DATE:${dateOnly(e.start)}`, `DTEND;VALUE=DATE:${dateOnly(end)}`)
    } else {
      lines.push(`DTSTART:${utc(e.start)}`)
      if (e.end) lines.push(`DTEND:${utc(e.end)}`)
    }
    lines.push(`SUMMARY:${esc(e.title)}`)
    if (e.location) lines.push(`LOCATION:${esc(e.location)}`)
    if (e.description) lines.push(`DESCRIPTION:${esc(e.description)}`)
    if (e.url) lines.push(`URL:${e.url}`)
    if (e.status) lines.push(`STATUS:${e.status}`)
    if (e.updated) lines.push(`LAST-MODIFIED:${utc(e.updated)}`)
    lines.push('END:VEVENT')
  }
  lines.push('END:VCALENDAR')
  return lines.map(fold).join('\r\n') + '\r\n'
}
