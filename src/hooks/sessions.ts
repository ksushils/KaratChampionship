import { APIError, type CollectionBeforeChangeHook } from 'payload'
import { isValidTimeZone, localToUtc } from '../lib/time'

/** CAL-06: derive UTC instants from circuit-local wall-clock input + the event's IANA zone. */
export const computeSessionInstants: CollectionBeforeChangeHook = async ({ data, req, originalDoc }) => {
  const merged = { ...originalDoc, ...data }
  let tz: string | undefined = merged.timeZone
  if (!tz && merged.event) {
    const ev = await req.payload.findByID({
      collection: 'events',
      id: typeof merged.event === 'object' ? merged.event.id : merged.event,
      depth: 0,
      overrideAccess: true,
      req,
    })
    tz = ev?.timeZone ?? undefined
  }
  if (!tz || !isValidTimeZone(tz)) throw new APIError('Session needs a valid IANA time zone (set it on the event or the session).', 400)
  data.timeZone = tz
  data.startsAt = merged.localStart ? localToUtc(merged.localStart, tz).toISOString() : null
  data.endsAt = merged.localEnd ? localToUtc(merged.localEnd, tz).toISOString() : null
  if (data.startsAt && data.endsAt && data.endsAt <= data.startsAt) throw new APIError('Session end must be after its start.', 400)
  return data
}
