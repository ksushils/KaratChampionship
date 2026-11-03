import { getEvent, getSessionsFor } from '@/lib/data'
import { buildIcs, type IcsEvent } from '@/lib/ics'
import type { Circuit } from '@/payload-types'

export const dynamic = 'force-dynamic'

/** CAL-10: valid single-event ICS download (all-day event + timed confirmed/provisional sessions). */
export async function GET(_req: Request, { params }: { params: Promise<{ event: string }> }) {
  const e = await getEvent((await params).event)
  if (!e) return new Response('Not found', { status: 404 })
  const sessions = await getSessionsFor([e.id])
  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const host = new URL(base || 'http://localhost').hostname
  const c = e.circuit as Circuit | null
  const items: IcsEvent[] = [
    { uid: `event-${e.id}@${host}`, title: e.title, start: new Date(e.startDate), end: e.endDate ? new Date(e.endDate) : null, allDay: true, location: c ? `${c.name}, ${c.country}` : undefined, url: `${base}/championship-team/events/${e.slug}`, status: e.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED', updated: new Date(e.updatedAt) },
    ...sessions
      .filter((s) => s.startsAt && s.certainty !== 'tbc')
      .map((s) => ({ uid: `session-${s.id}@${host}`, title: `${e.title}: ${s.name}`, start: new Date(s.startsAt!), end: s.endsAt ? new Date(s.endsAt) : null, location: c?.name, status: (s.status === 'cancelled' ? 'CANCELLED' : s.certainty === 'confirmed' ? 'CONFIRMED' : 'TENTATIVE') as IcsEvent['status'] })),
  ]
  return new Response(buildIcs(items, e.title), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="${e.slug}.ics"` },
  })
}
