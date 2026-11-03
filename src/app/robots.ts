import type { MetadataRoute } from 'next'

/** SEO-04: staging and development are never indexed. */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  if (process.env.APP_ENV !== 'production') return { rules: [{ userAgent: '*', disallow: '/' }] }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/search', '/championship-team/portal', '/championship-team/partner-portal'] }],
    sitemap: `${base}/sitemap.xml`,
  }
}
