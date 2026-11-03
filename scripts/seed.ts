/**
 * Reproducible seed.
 *   pnpm seed        — production-safe base content (divisions, championships, programmes, FAQs, sources)
 *   pnpm seed:demo   — ALSO adds clearly-labelled fictional fixtures (refuses when APP_ENV=production)
 */
import 'dotenv/config'
import { getPayload, type Payload } from 'payload'
import config from '../src/payload.config'
import { ACCESSED, CHAMPIONSHIPS, DIVISIONS, FAQS, PROGRAMMES, SEASONS_2026, SOURCES } from './seed-data'

const ctx = { seed: true }

async function upsert(payload: Payload, collection: any, where: any, data: any, opts: { draft?: boolean } = {}) {
  const found = await payload.find({ collection, where, limit: 1, overrideAccess: true, depth: 0, draft: true })
  if (found.docs[0]) return payload.update({ collection, id: found.docs[0].id, data, overrideAccess: true, context: ctx, draft: opts.draft })
  return payload.create({ collection, data, overrideAccess: true, context: ctx, draft: opts.draft })
}

export async function seedBase(payload: Payload) {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (email && password) {
    const u = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, overrideAccess: true })
    if (!u.docs[0]) await payload.create({ collection: 'users', data: { email, password, name: 'Administrator', roles: ['admin'], divisions: ['championship-team', 'testing', 'championship-organisation'] }, overrideAccess: true })
  }

  const src: Record<string, number> = {}
  for (const s of SOURCES) {
    const doc = await upsert(payload, 'sources', { url: { equals: s.url } }, { title: s.title, url: s.url, publisher: s.publisher, accessedAt: ACCESSED, kind: 'primary', notes: 'Recorded during initial research. Re-verify each season.' })
    src[s.key] = doc.id
  }
  for (const d of DIVISIONS) await upsert(payload, 'divisions', { key: { equals: d.key } }, { ...d, enabled: true })

  const champ: Record<string, number> = {}
  for (const c of CHAMPIONSHIPS) {
    const { source, aliases, ...rest } = c
    const doc = await upsert(payload, 'championships', { slug: { equals: c.slug } }, { ...rest, aliases: [...aliases], substantiation: { sources: [src[source]], status: 'evidence-supplied' } })
    champ[c.slug] = doc.id
  }
  for (const s of SEASONS_2026) {
    const m = s.machinery as { chassis?: string; source?: string }
    await upsert(
      payload,
      'championship-seasons',
      { and: [{ championship: { equals: champ[s.championship] } }, { year: { equals: s.year } }] },
      {
        championship: champ[s.championship],
        year: s.year,
        documents: s.documents.map((d) => ({ ...d })),
        format: s.format.map((f) => ({ ...f })),
        classes: 'classes' in s ? [...s.classes] : [],
        machinery: m.chassis ? { chassis: m.chassis, source: src[m.source!], verifiedAt: ACCESSED } : {},
        pointsSystem: 'points' in s ? { description: s.pointsDescription, points: s.points, source: src[s.pointsSource] } : {},
        sourceVerifiedAt: ACCESSED,
      },
    )
  }
  const prog: Record<string, number> = {}
  for (const p of PROGRAMMES) {
    const c = CHAMPIONSHIPS.find((x) => x.slug === p.championship)!
    const doc = await upsert(payload, 'programmes', { slug: { equals: p.slug } }, {
      ...p,
      championship: champ[p.championship],
      enabled: true,
      seatAvailability: 'not-published',
      pricing: { mode: 'discuss' },
      officialLinks: [{ label: `${c.shortName} official website`, url: c.officialUrl }],
    })
    prog[p.slug] = doc.id
  }
  for (const slug of ['italian-f4', 'gb4', 'indian-f4', 'formula-x-f2000']) {
    await upsert(payload, 'programme-seasons', { and: [{ programme: { equals: prog[slug] } }, { year: { equals: 2027 } }] }, { programme: prog[slug], year: 2027, participationStatus: 'intended', seatAvailability: 'not-published' })
  }
  for (const f of FAQS) await upsert(payload, 'faqs', { question: { equals: f.question } }, { ...f, published: true })

  await payload.updateGlobal({ slug: 'site-settings', data: { siteName: 'Karat Racing', privacyNoticeVersion: '0.1-draft' }, context: ctx })
  await payload.updateGlobal({
    slug: 'team-content',
    data: {
      workingMethods: [
        { title: 'Preparation', body: 'Cars are prepared to a written checklist before every test and event, and each job is signed off.' },
        { title: 'Data review', body: 'After each session, driver and engineer go through the data and on-board video together and agree clear, prioritised actions.' },
        { title: 'Driver communication', body: 'Each driver has one engineering contact, plus a planned briefing and debrief rhythm across the weekend.' },
        { title: 'Race-weekend support', body: 'A run plan, tyre and set-up records, and a post-event report go to the driver and their family or manager.' },
      ],
    },
    context: ctx,
  })
  return { src, champ, prog }
}

/** Fictional fixtures — every record has isDemo:true and a "[DEMO]" label. */
export async function seedDemo(payload: Payload, ids: { prog: Record<string, number> }) {
  if (process.env.APP_ENV === 'production') throw new Error('Refusing to seed demo fixtures into production (acceptance #35).')
  const D = { isDemo: true }
  const now = new Date()
  const dayStr = (offsetDays: number) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offsetDays))
    return d.toISOString().slice(0, 10)
  }
  const circuits = [
    { name: 'Autodromo Nazionale Monza', slug: 'demo-monza', country: 'Italy', locality: 'Monza', timeZone: 'Europe/Rome' },
    { name: 'Donington Park', slug: 'demo-donington', country: 'United Kingdom', locality: 'Leicestershire', timeZone: 'Europe/London' },
    { name: 'Madras International Circuit', slug: 'demo-madras', country: 'India', locality: 'Chennai', timeZone: 'Asia/Kolkata' },
  ]
  const circ: Record<string, number> = {}
  for (const c of circuits) circ[c.slug] = (await upsert(payload, 'circuits', { slug: { equals: c.slug } }, c)).id

  const drivers = [
    { slug: 'demo-driver-alpha', name: '[DEMO] Alex Example', nationality: 'Fictional', shortBio: 'Fictional development fixture used to demonstrate driver profiles. Not a real person.' },
    { slug: 'demo-driver-bravo', name: '[DEMO] Sam Placeholder', nationality: 'Fictional', shortBio: 'Fictional development fixture. Not a real person.' },
  ]
  const drv: Record<string, number> = {}
  for (const d of drivers)
    drv[d.slug] = (await upsert(payload, 'drivers', { slug: { equals: d.slug } }, { ...d, ...D, _status: 'published', careerTimeline: [{ year: 2025, category: 'Karting (fictional)', notes: 'Demo data' }] })).id
  // Engagements: same driver, different numbers across seasons (acceptance #14).
  await upsert(payload, 'driver-engagements', { and: [{ driver: { equals: drv['demo-driver-alpha'] } }, { season: { equals: 2026 } }] }, { driver: drv['demo-driver-alpha'], programme: ids.prog['italian-f4'], season: 2026, number: '77', ...D, _status: 'published' })
  await upsert(payload, 'driver-engagements', { and: [{ driver: { equals: drv['demo-driver-alpha'] } }, { season: { equals: 2027 } }] }, { driver: drv['demo-driver-alpha'], programme: ids.prog['gb4'], season: 2027, number: '15', ...D, _status: 'published' })
  await upsert(payload, 'driver-engagements', { and: [{ driver: { equals: drv['demo-driver-bravo'] } }, { season: { equals: 2027 } }] }, { driver: drv['demo-driver-bravo'], programme: ids.prog['italian-f4'], season: 2027, number: '15', ...D, _status: 'published' })

  const events = [
    { slug: 'demo-round-1-monza', title: '[DEMO] Italian F4 — Round 1, Monza', programme: 'italian-f4', circuit: 'demo-monza', start: -30, end: -28, status: 'completed', round: '1' },
    { slug: 'demo-round-2-donington', title: '[DEMO] GB4 — Round 2, Donington Park', programme: 'gb4', circuit: 'demo-donington', start: 9, end: 11, status: 'cancelled', round: '2' },
    { slug: 'demo-round-3-monza', title: '[DEMO] Italian F4 — Round 3, Monza', programme: 'italian-f4', circuit: 'demo-monza', start: 20, end: 22, status: 'scheduled', round: '3' },
    { slug: 'demo-round-3-madras', title: '[DEMO] Indian F4 — Round 3, Chennai', programme: 'indian-f4', circuit: 'demo-madras', start: 21, end: 22, status: 'provisional', round: '3' },
  ]
  const ev: Record<string, number> = {}
  for (const e of events) {
    const tz = circuits.find((c) => c.slug === e.circuit)!.timeZone
    ev[e.slug] = (
      await upsert(payload, 'events', { slug: { equals: e.slug } }, {
        title: e.title, slug: e.slug, type: 'race-weekend', status: e.status, programme: ids.prog[e.programme], season: 2026, round: e.round,
        circuit: circ[e.circuit], startDate: dayStr(e.start), endDate: dayStr(e.end), timeZone: tz,
        summary: 'Fictional event used to demonstrate calendar, event hub and Race Centre states.',
        changeNote: e.status === 'cancelled' ? 'Demo: event cancelled to demonstrate next-event logic.' : undefined,
        driversEntered: [drv['demo-driver-alpha']], officialLinks: { liveTiming: 'https://example.org/timing', results: 'https://example.org/results' }, ...D, _status: 'published',
      })
    ).id
    const sessions = [
      { name: 'Free Practice', type: 'practice', day: e.start, h: '09:30', len: 40, certainty: 'confirmed' },
      { name: 'Qualifying', type: 'qualifying', day: e.start + 1, h: '10:15', len: 30, certainty: 'confirmed' },
      { name: 'Race 1', type: 'race', day: e.start + 1, h: '15:05', len: 30, certainty: 'provisional' },
      { name: 'Race 2', type: 'race', day: e.end, h: '11:40', len: 30, certainty: 'tbc' },
    ]
    for (const s of sessions) {
      const [hh, mm] = s.h.split(':').map(Number)
      const endM = hh * 60 + mm + s.len
      const localStart = `${dayStr(s.day)}T${s.h}`
      const localEnd = `${dayStr(s.day)}T${String(Math.floor(endM / 60)).padStart(2, '0')}:${String(endM % 60).padStart(2, '0')}`
      await upsert(payload, 'sessions', { and: [{ event: { equals: ev[e.slug] } }, { name: { equals: s.name } }] }, { event: ev[e.slug], name: s.name, type: s.type, localStart, localEnd, certainty: s.certainty, status: e.status === 'completed' ? 'completed' : 'scheduled', ...D })
    }
  }
  const r1 = await payload.find({ collection: 'sessions', where: { and: [{ event: { equals: ev['demo-round-1-monza'] } }, { name: { equals: 'Race 1' } }] }, limit: 1, overrideAccess: true })
  await upsert(payload, 'result-sets', { label: { equals: '[DEMO] Monza Race 1 — Overall' } }, {
    label: '[DEMO] Monza Race 1 — Overall', event: ev['demo-round-1-monza'], session: r1.docs[0].id, season: 2026, programme: ids.prog['italian-f4'],
    classification: 'overall', state: 'final', verification: 'verified', attribution: 'karat', source: { url: 'https://example.org/demo-results' },
    penaltyNotes: 'Demo: car #23 received a 5-second time penalty (fictional).',
    entries: [
      { position: 1, driverName: '[DEMO] Rival One', carNumber: '4', entrant: 'Demo Team A', laps: 14, time: '25:41.233', gap: null, points: 30, status: 'classified' },
      { position: 2, driverName: '[DEMO] Alex Example', driver: drv['demo-driver-alpha'], carNumber: '77', entrant: 'Karat Racing', laps: 14, time: '25:42.871', gap: '+1.638', points: 26, status: 'classified', isKarat: true },
      { position: 3, driverName: '[DEMO] Rival Two', carNumber: '23', entrant: 'Demo Team B', laps: 14, time: '25:49.002', gap: '+7.769', points: null, status: 'classified' },
      { position: null, driverName: '[DEMO] Rival Three', carNumber: '9', entrant: 'Demo Team C', laps: 6, time: null, gap: null, points: null, status: 'DNF' },
    ],
    ...D, _status: 'published',
  })
  await upsert(payload, 'standings', { label: { equals: '[DEMO] Italian F4 2026 — Drivers' } }, {
    label: '[DEMO] Italian F4 2026 — Drivers', programme: ids.prog['italian-f4'], season: 2026, type: 'driver', classification: 'overall', afterEvent: ev['demo-round-1-monza'],
    state: 'provisional', verification: 'verified', attribution: 'karat', source: { url: 'https://example.org/demo-standings' },
    entries: [
      { position: 1, name: '[DEMO] Rival One', points: 30 },
      { position: 2, name: '[DEMO] Alex Example', driver: drv['demo-driver-alpha'], points: 26, isKarat: true },
      { position: 3, name: '[DEMO] Rival Two', points: null },
    ],
    ...D, _status: 'published',
  })
  const art = [
    { slug: 'demo-karat-preview-monza', title: '[DEMO] Preview: Italian F4 heads to Monza', type: 'preview', events: [ev['demo-round-3-monza']], days: -2 },
    { slug: 'demo-karat-report-round-1', title: '[DEMO] Report: podium in Monza Race 1', type: 'report', events: [ev['demo-round-1-monza']], days: -27 },
    { slug: 'demo-team-update', title: '[DEMO] Team update: workshop preparations', type: 'team-update', events: [], days: -40 },
  ]
  for (const a of art)
    await upsert(payload, 'articles', { slug: { equals: a.slug } }, {
      title: a.title, slug: a.slug, type: a.type, standfirst: 'Fictional article used to demonstrate the news system. Not real news.', author: 'Demo Editor',
      publishedAt: new Date(now.getTime() + a.days * 86_400_000).toISOString(), season: 2026, programmes: [ids.prog['italian-f4']], drivers: [drv['demo-driver-alpha']], events: a.events,
      body: lexical('This is a fictional development fixture. It shows article layout, related entities and sharing. It must never appear in production.'),
      editorialStatus: 'approved', ...D, _status: 'published',
    })
  const partner = await upsert(payload, 'partners', { slug: { equals: 'demo-partner' } }, { name: '[DEMO] Example Partner Ltd', slug: 'demo-partner', description: 'Fictional partner to demonstrate partner hierarchy and rights periods.', publicationApproved: true, ...D })
  await upsert(payload, 'partnerships', { partner: { equals: partner.id } }, { partner: partner.id, tier: 'official', scope: 'team', startDate: dayStr(-60), endDate: dayStr(300), publicationApproved: true, ...D })
  const expired = await upsert(payload, 'partners', { slug: { equals: 'demo-expired-partner' } }, { name: '[DEMO] Expired Partner Co', slug: 'demo-expired-partner', publicationApproved: true, ...D })
  await upsert(payload, 'partnerships', { partner: { equals: expired.id } }, { partner: expired.id, tier: 'supplier', scope: 'team', startDate: dayStr(-400), endDate: dayStr(-10), publicationApproved: true, ...D })
  await upsert(payload, 'vacancies', { slug: { equals: 'demo-race-mechanic' } }, {
    title: '[DEMO] Race Mechanic', slug: 'demo-race-mechanic', discipline: 'mechanical', location: 'Fictional location', contractType: 'seasonal', summary: 'Fictional vacancy to demonstrate the application flow.',
    responsibilities: [{ item: 'Prepare cars to checklist' }], requirements: [{ item: 'Demo requirement' }], closingDate: dayStr(45), applicationMode: 'form', ...D, _status: 'published',
  })
  await upsert(payload, 'vacancies', { slug: { equals: 'demo-closed-role' } }, { title: '[DEMO] Data Engineer (closed)', slug: 'demo-closed-role', discipline: 'engineering', location: 'Fictional', contractType: 'full-time', closingDate: dayStr(-5), applicationMode: 'form', ...D, _status: 'published' })
}

export function lexical(text: string) {
  return {
    root: {
      type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
      children: text.split('\n\n').map((p) => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, children: [{ type: 'text', text: p, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] })),
    },
  }
}

async function main() {
  const payload = await getPayload({ config })
  const ids = await seedBase(payload)
  console.log('Base content seeded.')
  if (process.env.SEED_DEMO === 'true') {
    await seedDemo(payload, ids)
    console.log('Demo fixtures seeded (isDemo=true).')
  }
  process.exit(0)
}

if (process.argv[1]?.endsWith('seed.ts')) main().catch((e) => {
  console.error(e)
  process.exit(1)
})
