'use client'
import { useEffect, useRef, useState } from 'react'

const KEY = 'karat-hero-video-paused'

export type HeroVideoSources = { poster: string; webm: string; mp4: string; mobileMp4?: string }
const HOME: HeroVideoSources = { poster: '/brand/hero-car-poster.jpg', webm: '/brand/hero-car.webm', mp4: '/brand/hero-car.mp4', mobileMp4: '/brand/hero-car-1280.mp4' }
export const TEAM_TRACK: HeroVideoSources = { poster: '/brand/team-track-poster.jpg', webm: '/brand/team-track.webm', mp4: '/brand/team-track.mp4', mobileMp4: '/brand/team-track-1280.mp4' }

/**
 * Decorative looping background video built from the Karat car photo (GW-08):
 * muted, inline, poster first, pause control, and no autoplay for reduced-motion users.
 */
export function HeroVideo({ className, sources = HOME, controlClassName = 'bottom-4 right-4' }: { className?: string; sources?: HeroVideoSources; controlClassName?: string }) {
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
        poster={sources.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
      >
        {sources.mobileMp4 && <source src={sources.mobileMp4} type="video/mp4" media="(max-width: 767px)" />}
        <source src={sources.webm} type="video/webm" />
        <source src={sources.mp4} type="video/mp4" />
      </video>
      {ready && (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={paused}
          className={`absolute z-10 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-white/25 bg-night/60 px-3 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur hover:border-gold-400 ${controlClassName}`}
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
