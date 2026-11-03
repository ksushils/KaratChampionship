import { getEvents, getSessionsFor, getSettings } from '@/lib/data'
import { buildIcs, type IcsEvent } from '@/lib/ics'
import type { Circuit } from '@/payload-types'

export const dynamic = 'force-dynamic'

/** CAL-11: subscription feed with stable UIDs (event/session IDs). */
export async function GET() {
  const { flags } = await getSettings()
  if (!flags.calendarFeed) return new Response('Not found', { status: 404 })
  const events = await getEvents()
  const sessions = await getSessionsFor(events.map((e) => e.id))
  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const host = new URL(base || 'http://localhost').hostname
  const out: IcsEvent[] = []
  for (const e of events) {
    const c = e.circuit as Circuit | null
    out.push({
      uid: `event-${e.id}@${host}`,
      title: e.title,
      start: new Date(e.startDate),
      end: e.endDate ? new Date(e.endDate) : null,
      allDay: true,
      location: c ? `${c.name}, ${c.country}` : undefined,
      url: `${base}/championship-team/events/${e.slug}`,
      status: e.status === 'cancelled' ? 'CANCELLED' : e.status === 'scheduled' ? 'CONFIRMED' : 'TENTATIVE',
      updated: new Date(e.updatedAt),
    })
  }
  for (const s of sessions.filter((s) => s.startsAt && s.certainty !== 'tbc')) {
    const e = events.find((x) => x.id === (typeof s.event === 'object' ? s.event.id : s.event))
    out.push({ uid: `session-${s.id}@${host}`, title: `${e?.title ?? ''}: ${s.name}`, start: new Date(s.startsAt!), end: s.endsAt ? new Date(s.endsAt) : null, status: s.status === 'cancelled' ? 'CANCELLED' : s.certainty === 'confirmed' ? 'CONFIRMED' : 'TENTATIVE', updated: new Date(s.updatedAt) })
  }
  return new Response(buildIcs(out, 'Karat Racing — Championship Team'), { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'public, max-age=900' } })
}
