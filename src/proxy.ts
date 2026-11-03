import { NextResponse, type NextRequest } from 'next/server'

/**
 * CMS-12 / SEO-07: editor-managed redirects. The map is fetched from the public
 * redirects endpoint and cached in memory for 60s to avoid a DB round-trip per request.
 */
let cache: { at: number; map: Map<string, { to: string; code: number }> } | null = null
const TTL = 60_000

async function load(origin: string) {
  if (cache && Date.now() - cache.at < TTL) return cache.map
  try {
    const res = await fetch(`${origin}/api/redirects?limit=2000&depth=0`, { headers: { 'x-internal': 'redirects' }, cache: 'no-store' })
    if (!res.ok) throw new Error(String(res.status))
    const json = (await res.json()) as { docs: { from: string; to: string; statusCode?: string }[] }
    cache = { at: Date.now(), map: new Map(json.docs.map((d) => [d.from.replace(/\/$/, '') || '/', { to: d.to, code: Number(d.statusCode || 301) }])) }
  } catch {
    cache = { at: Date.now(), map: cache?.map ?? new Map() }
  }
  return cache.map
}

export async function proxy(req: NextRequest) {
  if (req.method !== 'GET') return NextResponse.next()
  const path = req.nextUrl.pathname.replace(/\/$/, '') || '/'
  const internal = process.env.INTERNAL_ORIGIN || req.nextUrl.origin
  const map = await load(internal)
  const hit = map.get(path)
  if (hit && hit.to !== path) {
    const url = hit.to.startsWith('http') ? hit.to : new URL(hit.to, req.nextUrl.origin).toString()
    return NextResponse.redirect(url, hit.code)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|admin|_next|brand|favicon|icon|apple-icon|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|svg|webp|avif|ico|css|js|ics|xml)$).*)'],
}
