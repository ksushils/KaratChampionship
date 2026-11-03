import { getArticles, getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** NEWS-11: published articles only (public access rules apply). */
export async function GET() {
  const { flags } = await getSettings()
  if (!flags.rss) return new Response('Not found', { status: 404 })
  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const { docs } = await getArticles({ limit: 30 })
  const items = docs
    .map((a) => `<item><title>${esc(a.title)}</title><link>${base}/championship-team/news/${a.slug}</link><guid isPermaLink="false">article-${a.id}</guid>${a.publishedAt ? `<pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>` : ''}${a.standfirst ? `<description>${esc(a.standfirst)}</description>` : ''}</item>`)
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Karat Racing — News</title><link>${base}/championship-team/news</link><description>News from the Karat Racing Championship Team</description><language>en-gb</language>${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=600' } })
}
