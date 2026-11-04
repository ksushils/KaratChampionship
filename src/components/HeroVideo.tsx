'use client'
import { useEffect, useRef, useState } from 'react'

const KEY = 'karat-hero-video-paused'

/**
 * Decorative looping background video built from the Karat car photo (GW-08):
 * muted, inline, poster first, pause control, and no autoplay for reduced-motion users.
 */
export function HeroVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    let stored = false
    try {
      stored = localStorage.getItem(KEY) === '1'
    } catch {}
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || stored) {
      v.pause()
      setPaused(true)
    } else {
      v.play().then(() => setPaused(false)).catch(() => setPaused(true))
    }
    setReady(true)
  }, [])

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) {
      void v.play().then(() => setPaused(false))
      try {
        localStorage.removeItem(KEY)
      } catch {}
    } else {
      v.pause()
      setPaused(true)
      try {
        localStorage.setItem(KEY, '1')
      } catch {}
    }
  }

  return (
    <>
      <video
        ref={ref}
        className={className}
        poster="/brand/hero-car-poster.jpg"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
      >
        <source src="/brand/hero-car-1280.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/brand/hero-car.webm" type="video/webm" />
        <source src="/brand/hero-car.mp4" type="video/mp4" />
      </video>
      {ready && (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={paused}
          className="absolute bottom-4 right-4 z-10 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-white/25 bg-night/60 px-3 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur hover:border-gold-400"
        >
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            {paused ? <path d="M8 5v14l11-7z" /> : <path d="M6 5h4v14H6zM14 5h4v14h-4z" />}
          </svg>
          <span>{paused ? 'Play video' : 'Pause video'}</span>
        </button>
      )}
    </>
  )
}
