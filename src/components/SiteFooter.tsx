import Link from 'next/link'
import { Wordmark } from './Logo'
import { CookieSettingsButton } from './ConsentManager'
import type { SiteSetting } from '@/payload-types'

export function SiteFooter({ site, divisions }: { site: SiteSetting; divisions: { key: string; name: string; href: string }[] }) {
  return (
    <footer className="mt-auto border-t border-gold-400/20 bg-ink-900">
      <div className="container-k grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Wordmark />
          <p className="text-mist mt-4 text-sm">Performance / Precision / Karat</p>
          {site.legalEntityName && (
            <p className="text-mist mt-4 text-xs">
              {site.legalEntityName}
              {site.registeredAddress && (
                <>
                  <br />
                  {site.registeredAddress}
                </>
              )}
            </p>
          )}
        </div>
        <nav aria-label="Businesses">
          <p className="eyebrow mb-3">Businesses</p>
          <ul className="grid gap-2 text-sm">
            {divisions.map((d) => (
              <li key={d.key}>
                <Link href={d.href} className="hover:text-gold-300">
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Championship Team quick links">
          <p className="eyebrow mb-3">Championship Team</p>
          <ul className="grid gap-2 text-sm">
            {[
              ['Race with us', '/championship-team/race-with-us'],
              ['Partner with us', '/championship-team/partner-with-us'],
              ['Calendar', '/championship-team/calendar'],
              ['News', '/championship-team/news'],
              ['Press', '/championship-team/press'],
              ['Careers', '/championship-team/careers'],
              ['FAQs', '/championship-team/faqs'],
              ['Contact', '/championship-team/contact'],
            ].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="hover:text-gold-300">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Legal">
          <p className="eyebrow mb-3">Legal &amp; safeguarding</p>
          <ul className="grid gap-2 text-sm">
            {[
              ['Privacy', '/privacy'],
              ['Cookies', '/cookies'],
              ['Terms', '/terms'],
              ['Accessibility', '/accessibility'],
              ['Safeguarding', '/safeguarding'],
            ].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="hover:text-gold-300">
                  {l}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton className="min-h-6 text-left hover:text-gold-300" />
            </li>
          </ul>
          {site.social && site.social.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-3 text-sm" aria-label="Official social accounts">
              {site.social.map((s) => (
                <li key={s.id}>
                  <a href={s.url} rel="noopener noreferrer" target="_blank" className="capitalize hover:text-gold-300">
                    {s.platform}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>
      <div className="border-t border-white/5">
        <div className="container-k text-mist flex flex-wrap justify-between gap-2 py-5 text-xs">
          <p>© {new Date().getFullYear()} Karat Racing. Livery imagery shows design concepts.</p>
          <p>Championship names and marks belong to their respective owners.</p>
        </div>
      </div>
    </footer>
  )
}
