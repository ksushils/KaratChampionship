'use client'
import { useEffect, useState } from 'react'
import { remaining } from '@/lib/events'

/** Countdown to a verified session start. Clamped at zero; announces politely, not every second (RACE-04). */
export function Countdown({ target, label }: { target: string; label: string }) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const r = remaining(target, now ?? new Date(target))
  const parts = [
    ['days', r.days],
    ['hrs', r.hours],
    ['min', r.minutes],
    ['sec', r.seconds],
  ] as const
  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      <div className="flex gap-2" aria-hidden="true">
        {parts.map(([u, v]) => (
          <div key={u} className="min-w-16 rounded border border-gold-400/30 bg-night/60 px-3 py-2 text-center">
            <span className="block font-display text-3xl font-bold tabular-nums text-gold-200">{now ? String(v).padStart(2, '0') : '--'}</span>
            <span className="text-mist text-[0.65rem] uppercase tracking-widest">{u}</span>
          </div>
        ))}
      </div>
      <p className="sr-only">
        {label}: starts in {r.days} days, {r.hours} hours and {r.minutes} minutes.
      </p>
      {now && r.ms === 0 && <p className="mt-2 text-sm text-gold-200">Scheduled start time reached — follow official timing for the live status.</p>}
    </div>
  )
}
