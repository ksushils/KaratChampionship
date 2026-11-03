import pg from 'pg'
import { getPayload, type Payload } from 'payload'

let instance: Payload | null = null

/** Fresh schema in the dedicated test database, then boot Payload (schema push). */
export async function bootPayload(): Promise<Payload> {
  if (instance) return instance
  const url = process.env.DATABASE_URL!
  if (!/_test\b/.test(url)) throw new Error(`Refusing to reset non-test database: ${url}`)
  const client = new pg.Client({ connectionString: url })
  await client.connect()
  await client.query('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;')
  await client.end()
  const { default: config } = await import('@/payload.config')
  instance = await getPayload({ config })
  return instance
}

export async function makeUser(payload: Payload, email: string, roles: string[], divisions: string[] = ['championship-team']) {
  return payload.create({ collection: 'users', data: { email, password: 'Password-123!', roles: roles as never, divisions: divisions as never }, overrideAccess: true })
}
