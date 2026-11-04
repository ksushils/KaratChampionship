'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { DIVISION_LINKS, TEAM_NAV } from '@/lib/nav'
import { Wordmark } from './Logo'
import { SmartLink } from './SmartLink'
import { buttonClass, cx } from './ui'
import { track } from './analytics'

function useEscape(open: boolean, close: () => void, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        ref.current?.querySelector<HTMLElement>('[aria-expanded]')?.focus()
      }
    }
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open, close, ref])
}

function Disclosure({ label, children, id, current, chip }: { label: React.ReactNode; children: React.ReactNode; id: string; current?: boolean; chip?: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEscape(open, () => setOpen(false), ref)
  const pathname = usePathname()
  useEffect(() => setOpen(false), [pathname])
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={cx('inline-flex min-h-11 items-center gap-1 whitespace-nowrap px-2 font-display text-[0.9rem] font-semibold uppercase tracking-[0.1em] hover:text-gold-300', current && 'text-gold-300', chip && 'ml-2 min-h-9 rounded-full border border-gold-400/40 bg-gold-400/5 px-3.5 text-[0.78rem] text-gold-200')}
      >
        {label}
        <span aria-hidden="true" className={cx('text-xs transition-transform', open && 'rotate-180')}>
          ▾
        </span>
      </button>
      <div id={id} hidden={!open} className="absolute left-0 top-full z-50 mt-1 min-w-64 rounded-card border border-white/10 bg-ink-900/98 p-2 shadow-2xl backdrop-blur">
        {children}
      </div>
    </div>
  )
}

type Div = (typeof DIVISION_LINKS)[number]
function BusinessLinks({ divisions, activeKey, className, short }: { divisions: readonly Div[]; activeKey?: string; className?: string; short?: boolean }) {
  return (
    <nav aria-label="Karat Racing businesses" className={className}>
      {divisions.map((d) => {
        const current = activeKey === d.key
        return (
          <SmartLink
            key={d.key}
            href={d.href}
            aria-current={current ? 'page' : undefined}
            onClick={() => track('division_selected', { division: d.key, from: short ? 'business-strip' : 'business-menu' })}
            className={cx(
              'relative inline-flex min-h-11 shrink-0 items-center whitespace-nowrap px-3 font-display font-semibold uppercase tracking-[0.1em] transition-colors',
              short ? 'text-[0.78rem]' : 'text-[0.9rem]',
              current ? 'text-gold-300 after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:bg-gold-400' : 'text-white/85 hover:text-gold-300',
            )}
          >
            {short ? d.short : (
              <>
                <span className="xl:hidden">{d.short}</span>
                <span className="hidden xl:inline">{d.label}</span>
              </>
            )}
          </SmartLink>
        )
      })}
    </nav>
  )
}

export function SiteHeader({ divisionsEnabled }: { divisionsEnabled: string[] }) {
  const pathname = usePathname() || '/'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  const mobileRef = useRef<HTMLDivElement>(null)
  useEscape(mobileOpen, () => setMobileOpen(false), mobileRef)
  useEffect(() => setMobileOpen(false), [pathname])

  const active = DIVISION_LINKS.find((d) => pathname.startsWith(d.href))
  const inTeam = pathname.startsWith('/championship-team')
  const divisions = DIVISION_LINKS.filter((d) => divisionsEnabled.includes(d.key))

  return (
    <header data-hydrated={hydrated ? 'true' : undefined} className="sticky top-0 z-40 border-b border-white/10 bg-night/92 backdrop-blur supports-[backdrop-filter]:bg-night/80">
      <div className="container-k flex min-h-16 items-center gap-3">
        <Link href="/" className="inline-flex min-h-11 items-center">
          <Wordmark size="sm" />
          <span className="sr-only"> home</span>
        </Link>

        {/* Business menu (GW-04): all three businesses shown inline — no dropdown. */}
        <BusinessLinks divisions={divisions} activeKey={active?.key} className="ml-2 hidden items-center gap-1 md:flex lg:ml-6" />

        <div className="ml-auto flex items-center gap-1">
          <Link href="/search" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded hover:text-gold-300" aria-label="Search">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          <Link href="/championship-team/contact" className="hidden min-h-11 items-center px-3 font-display text-[0.9rem] font-semibold uppercase tracking-[0.1em] hover:text-gold-300 sm:inline-flex">
            Contact
          </Link>
          {inTeam && (
            <Link href="/championship-team/race-with-us" className={buttonClass('gold', 'hidden whitespace-nowrap px-4 lg:inline-flex')}>
              Race with us
            </Link>
          )}
          <div ref={mobileRef} className="xl:hidden">
            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-white/15"
            >
              <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
            <div id="mobile-menu" hidden={!mobileOpen} className="fixed inset-x-0 top-[6.75rem] bottom-0 md:top-16 z-50 overflow-y-auto border-t border-white/10 bg-night px-4 pb-10">
              <nav aria-label="Mobile">
                <p className="eyebrow mt-6 mb-2">Businesses</p>
                <ul className="grid gap-1">
                  {divisions.map((d) => (
                    <li key={d.key}>
                      <SmartLink href={d.href} aria-current={active?.key === d.key ? 'page' : undefined} className={cx('block min-h-11 rounded px-3 py-3 text-lg', active?.key === d.key ? 'bg-royal-500/15 text-gold-300' : 'hover:bg-white/5')}>
                        {d.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
                {inTeam &&
                  TEAM_NAV.map((g) => (
                    <div key={g.label}>
                      <p className="eyebrow mt-6 mb-2">{g.label}</p>
                      <ul className="grid gap-1">
                        {g.children?.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} aria-current={pathname === c.href ? 'page' : undefined} className="block min-h-11 rounded px-3 py-2.5 hover:bg-white/5">
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                <div className="mt-8 grid gap-3">
                  <Link href="/championship-team/race-with-us" className={buttonClass('gold')}>
                    Discuss your race programme
                  </Link>
                  <Link href="/championship-team/contact" className={buttonClass('outline')}>
                    Contact
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* Phones: the same three businesses as a compact horizontal strip. */}
      <BusinessLinks divisions={divisions} activeKey={active?.key} short className="flex items-stretch gap-1 overflow-x-auto border-t border-white/10 px-2 md:hidden [scrollbar-width:none]" />
      {inTeam && (
        <div className="hidden border-t border-white/5 bg-ink-900/60 xl:block">
          <nav aria-label="Championship Team" className="container-k flex min-h-12 items-center">
            {TEAM_NAV.map((g) => (
              <Disclosure key={g.label} id={`nav-${g.label.replace(/\W+/g, '-').toLowerCase()}`} label={g.label} current={pathname.startsWith(g.href)}>
                <ul>
                  {g.children?.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} aria-current={pathname === c.href ? 'page' : undefined} className="block rounded px-3 py-2.5 hover:bg-white/5">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Disclosure>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
