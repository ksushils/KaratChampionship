'use client'
import { useEffect, useState } from 'react'
import { readConsent, writeConsent } from './analytics'
import { buttonClass } from './ui'

/** Third-party embeds load only after media consent (RACE-07). A plain link is always available. */
export function ConsentEmbed({ url, title }: { url: string; title: string }) {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    setOk(Boolean(readConsent()?.media))
    const on = () => setOk(Boolean(readConsent()?.media))
    window.addEventListener('karat:consent', on)
    return () => window.removeEventListener('karat:consent', on)
  }, [])
  const embed = toEmbedUrl(url)
  if (!embed)
    return (
      <a className={buttonClass('outline')} href={url} target="_blank" rel="noopener noreferrer">
        Watch: {title} ↗
      </a>
    )
  if (!ok)
    return (
      <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-card border border-white/15 bg-ink-900 p-6 text-center">
        <p className="font-semibold">{title}</p>
        <p className="text-mist max-w-md text-sm">This video is hosted by a third party that may set cookies. Load it, or open it on the provider’s site.</p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            className={buttonClass('gold')}
            onClick={() => {
              const c = readConsent()
              writeConsent({ analytics: Boolean(c?.analytics), media: true })
            }}
          >
            Load video
          </button>
          <a className={buttonClass('outline')} href={url} target="_blank" rel="noopener noreferrer">
            Open on provider ↗
          </a>
        </div>
      </div>
    )
  return <iframe src={embed} title={title} className="aspect-video w-full rounded-card" allow="encrypted-media; picture-in-picture; fullscreen" loading="lazy" />
}

export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) return `https://www.youtube-nocookie.com/embed/${u.searchParams.get('v')}`
    if (u.hostname === 'youtu.be') return `https://www.youtube-nocookie.com/embed${u.pathname}`
    if (u.hostname.includes('vimeo.com')) return `https://player.vimeo.com/video${u.pathname}`
  } catch {}
  return null
}
