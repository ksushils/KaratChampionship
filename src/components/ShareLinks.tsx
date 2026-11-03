'use client'
import { useState } from 'react'

export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const enc = encodeURIComponent
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-mist">Share:</span>
      <button
        type="button"
        className="min-h-11 rounded border border-white/20 px-3 hover:border-gold-400"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
          } catch {}
        }}
      >
        {copied ? 'Link copied' : 'Copy link'}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
      <a className="inline-flex min-h-11 items-center rounded border border-white/20 px-3 hover:border-gold-400" href={`https://wa.me/?text=${enc(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer">
        WhatsApp<span className="sr-only"> (opens in a new tab)</span>
      </a>
      <a className="inline-flex min-h-11 items-center rounded border border-white/20 px-3 hover:border-gold-400" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer">
        LinkedIn<span className="sr-only"> (opens in a new tab)</span>
      </a>
      <a className="inline-flex min-h-11 items-center rounded border border-white/20 px-3 hover:border-gold-400" href={`https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}`} target="_blank" rel="noopener noreferrer">
        X<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  )
}
