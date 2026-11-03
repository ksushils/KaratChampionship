'use client'
import { useEffect, useRef, useState } from 'react'
import { recordConsent } from '@/app/(frontend)/actions'
import { readConsent, track, writeConsent, type Consent } from './analytics'
import { buttonClass } from './ui'

const SRC = process.env.NEXT_PUBLIC_ANALYTICS_SRC
const DOMAIN = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN

function loadAnalytics() {
  if (!SRC || document.getElementById('karat-analytics')) return
  const s = document.createElement('script')
  s.id = 'karat-analytics'
  s.defer = true
  s.src = SRC
  if (DOMAIN) s.setAttribute('data-domain', DOMAIN)
  document.head.appendChild(s)
}

/** Cookie banner + preferences dialog. Optional technologies load only after an explicit choice (section 35). */
export function ConsentManager() {
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined)
  const [prefsOpen, setPrefsOpen] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [media, setMedia] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const c = readConsent()
    setConsent(c)
    if (c?.analytics) loadAnalytics()
    const open = () => {
      const cur = readConsent()
      setAnalytics(Boolean(cur?.analytics))
      setMedia(Boolean(cur?.media))
      setPrefsOpen(true)
    }
    window.addEventListener('karat:open-consent', open)
    // Declarative click tracking: <a data-track="event_name"> (consent-gated inside track()).
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]')
      if (el?.dataset.track) track(el.dataset.track, { path: location.pathname })
    }
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('karat:open-consent', open)
      document.removeEventListener('click', onClick)
    }
  }, [])

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (prefsOpen && !d.open) d.showModal()
    if (!prefsOpen && d.open) d.close()
  }, [prefsOpen])

  const save = (a: boolean, m: boolean) => {
    const c = writeConsent({ analytics: a, media: m })
    setConsent(c)
    setPrefsOpen(false)
    if (a) loadAnalytics()
    void recordConsent({ analytics: a, media: m }).catch(() => {})
  }

  return (
    <>
      {consent === null && !prefsOpen && (
        <div role="region" aria-label="Cookie choices" className="fixed inset-x-0 bottom-0 z-50 border-t border-gold-400/40 bg-ink-900/98 p-4 shadow-2xl backdrop-blur">
          <div className="container-k flex flex-col gap-4 md:flex-row md:items-center">
            <p className="text-sm md:flex-1">
              We use essential cookies to run this site. With your permission we would also use privacy-friendly analytics and load video embeds from third parties.{' '}
              <a href="/cookies" className="text-royal-300 underline">
                Cookie policy
              </a>
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={buttonClass('outline')} onClick={() => save(false, false)}>
                Reject optional
              </button>
              <button type="button" className={buttonClass('outline')} onClick={() => setPrefsOpen(true)}>
                Preferences
              </button>
              <button type="button" className={buttonClass('gold')} onClick={() => save(true, true)}>
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}
      <dialog
        ref={dialogRef}
        aria-labelledby="consent-title"
        onClose={() => setPrefsOpen(false)}
        className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-card border border-white/15 bg-ink-900 p-6 text-white backdrop:bg-black/70"
      >
        <h2 id="consent-title" className="font-display text-2xl font-bold uppercase">
          Cookie preferences
        </h2>
        <form
          className="mt-4 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            save(analytics, media)
          }}
        >
          <div className="rounded border border-white/10 p-3">
            <p className="font-semibold">Essential</p>
            <p className="text-mist text-sm">Security, form protection and remembering this choice. Always on.</p>
          </div>
          <label className="flex min-h-11 items-start gap-3 rounded border border-white/10 p-3">
            <input type="checkbox" className="mt-1 size-5 accent-[#dcb35c]" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
            <span>
              <span className="block font-semibold">Analytics</span>
              <span className="text-mist block text-sm">Anonymous, aggregated measurement of page visits and enquiry steps. No names, emails or messages are ever sent.</span>
            </span>
          </label>
          <label className="flex min-h-11 items-start gap-3 rounded border border-white/10 p-3">
            <input type="checkbox" className="mt-1 size-5 accent-[#dcb35c]" checked={media} onChange={(e) => setMedia(e.target.checked)} />
            <span>
              <span className="block font-semibold">Media embeds</span>
              <span className="text-mist block text-sm">Load videos and streams from providers such as YouTube, which may set their own cookies.</span>
            </span>
          </label>
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" className={buttonClass('ghost')} onClick={() => setPrefsOpen(false)}>
              Cancel
            </button>
            <button type="submit" className={buttonClass('gold')}>
              Save choices
            </button>
          </div>
        </form>
      </dialog>
    </>
  )
}

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event('karat:open-consent'))}>
      Cookie settings
    </button>
  )
}
