'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { formatInZone } from '@/lib/time'

const Ctx = createContext<{ mode: 'circuit' | 'viewer'; viewerTz: string | null }>({ mode: 'circuit', viewerTz: null })

/** CAL-06/07: circuit-local by default; optional switch to the viewer's own zone. */
export function TimeModeProvider({ children, allowViewer }: { children: ReactNode; allowViewer: boolean }) {
  const [mode, setMode] = useState<'circuit' | 'viewer'>('circuit')
  const [viewerTz, setViewerTz] = useState<string | null>(null)
  useEffect(() => setViewerTz(Intl.DateTimeFormat().resolvedOptions().timeZone), [])
  return (
    <Ctx.Provider value={{ mode, viewerTz }}>
      {allowViewer && viewerTz && (
        <fieldset className="mb-4 inline-flex flex-wrap items-center gap-3 rounded border border-white/15 px-3 py-2 text-sm">
          <legend className="sr-only">Show session times in</legend>
          <span aria-hidden="true" className="text-mist">
            Show times in:
          </span>
          {(['circuit', 'viewer'] as const).map((m) => (
            <label key={m} className="inline-flex min-h-11 items-center gap-2">
              <input type="radio" name="timemode" value={m} checked={mode === m} onChange={() => setMode(m)} className="accent-[#dcb35c]" />
              {m === 'circuit' ? 'Circuit local time' : `My time (${viewerTz})`}
            </label>
          ))}
        </fieldset>
      )}
      {children}
    </Ctx.Provider>
  )
}

export function SessionTime({ iso, circuitTz, certainty }: { iso?: string | null; circuitTz: string; certainty?: string | null }) {
  const { mode, viewerTz } = useContext(Ctx)
  if (!iso || certainty === 'tbc') return <span>Time TBC</span>
  const tz = mode === 'viewer' && viewerTz ? viewerTz : circuitTz
  return (
    <time dateTime={iso}>
      {formatInZone(iso, tz, 'datetime')} <span className="text-mist text-xs">{formatInZone(iso, tz, 'tzname')}</span>
      {certainty === 'provisional' && <span className="ml-1 text-xs text-warn">(provisional)</span>}
    </time>
  )
}
