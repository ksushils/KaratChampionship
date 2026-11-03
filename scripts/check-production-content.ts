/**
 * Launch gate (acceptance #35): fails if any fictional fixture exists in the target database.
 *   pnpm tsx scripts/check-production-content.ts
 */
import 'dotenv/config'
import { getPayload, type Payload } from 'payload'

export const DEMO_COLLECTIONS = ['drivers', 'driver-engagements', 'events', 'sessions', 'result-sets', 'standings', 'articles', 'partners', 'partnerships', 'vacancies', 'people', 'media-collections', 'programme-seasons'] as const

export async function findDemoContent(payload: Payload) {
  const found: Record<string, number> = {}
  for (const c of DEMO_COLLECTIONS) {
    const r = await payload.count({ collection: c, where: { isDemo: { equals: true } }, overrideAccess: true })
    if (r.totalDocs) found[c] = r.totalDocs
  }
  const titled = await payload.count({ collection: 'drivers', where: { name: { like: '[DEMO]' } }, overrideAccess: true })
  if (titled.totalDocs) found['drivers(name)'] = titled.totalDocs
  return found
}

async function main() {
  const { default: config } = await import('../src/payload.config')
  const payload = await getPayload({ config })
  const found = await findDemoContent(payload)
  if (Object.keys(found).length) {
    console.error('Demo/fictional content present:', found)
    process.exit(1)
  }
  console.log('OK — no demo fixtures found.')
  process.exit(0)
}
if (process.argv[1]?.endsWith('check-production-content.ts')) main()
