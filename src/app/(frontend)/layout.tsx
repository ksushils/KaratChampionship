import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { ConsentManager } from '@/components/ConsentManager'
import { getDivisions, getSettings } from '@/lib/data'
import { DIVISION_LINKS } from '@/lib/nav'
import { JsonLd } from '@/components/ui'

export const dynamic = 'force-dynamic'

const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const indexable = process.env.APP_ENV === 'production'

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: { default: 'Karat Racing', template: '%s | Karat Racing' },
  description: 'Karat Racing — a motorsport organisation with three businesses: Championship Team, Testing & Karat Academy, and a Championship Series in India.',
  openGraph: { type: 'website', siteName: 'Karat Racing', images: ['/brand/og-default.jpg'] },
  twitter: { card: 'summary_large_image' },
  robots: indexable ? undefined : { index: false, follow: false },
}

export const viewport: Viewport = { themeColor: '#04070f', width: 'device-width', initialScale: 1 }

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const [divisions, { site }] = await Promise.all([getDivisions(), getSettings()])
  const enabled = divisions.filter((d) => d.enabled !== false).map((d) => d.key)
  const enabledKeys = enabled.length ? enabled : DIVISION_LINKS.map((d) => d.key)
  const footerDivisions = DIVISION_LINKS.filter((d) => enabledKeys.includes(d.key)).map((d) => ({ key: d.key, name: d.label, href: d.href }))
  return (
    <html lang="en-GB">
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only z-[100] rounded bg-gold-400 px-4 py-3 font-semibold text-night focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to main content
        </a>
        <SiteHeader divisionsEnabled={enabledKeys} />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter site={site} divisions={footerDivisions} />
        <ConsentManager />
        <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Organization', name: 'Karat Racing', url: base, logo: `${base}/brand/karat-k.png` }} />
      </body>
    </html>
  )
}
