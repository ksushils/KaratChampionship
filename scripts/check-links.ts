/**
 * UTIL-10: crawl internal links from the running site and report broken ones.
 *   BASE_URL=http://localhost:3000 pnpm check:links
 */
const BASE = process.env.BASE_URL || 'http://localhost:3000'
const START = ['/', '/championship-team', '/testing-academy', '/championship-organisation', '/sitemap.xml']
const seen = new Set<string>()
const broken: { url: string; status: number; from: string }[] = []
const queue: { path: string; from: string }[] = START.map((p) => ({ path: p, from: '(start)' }))
const MAX = Number(process.env.MAX_PAGES || 400)

async function main() {
  while (queue.length && seen.size < MAX) {
    const { path, from } = queue.shift()!
    if (seen.has(path)) continue
    seen.add(path)
    let res: Response
    try {
      res = await fetch(BASE + path, { redirect: 'follow' })
    } catch {
      broken.push({ url: path, status: 0, from })
      continue
    }
    if (res.status >= 400) {
      broken.push({ url: path, status: res.status, from })
      continue
    }
    const type = res.headers.get('content-type') || ''
    if (!type.includes('html')) continue
    const html = await res.text()
    for (const m of html.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
      const p = m[1]
      if (p.startsWith('/_next') || p.startsWith('/api/media') || p.startsWith('/admin')) continue
      if (!seen.has(p)) queue.push({ path: p, from: path })
    }
  }
  console.log(`Checked ${seen.size} URLs.`)
  if (broken.length) {
    console.error('Broken links:')
    for (const b of broken) console.error(`  ${b.status}  ${b.url}  (linked from ${b.from})`)
    process.exit(1)
  }
  console.log('No broken internal links.')
}
main()
