'use client'
/**
 * Consent-aware analytics (section 37). Events are dropped unless the visitor has granted
 * analytics consent AND a provider is configured. PII keys are stripped defensively.
 */
import { PII_KEYS } from '@/lib/enquiry-schema'

export const CONSENT_COOKIE = 'karat_consent'
export type Consent = { v: number; analytics: boolean; media: boolean; at: string }

export function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`))
  if (!m) return null
  try {
    return JSON.parse(decodeURIComponent(m[1])) as Consent
  } catch {
    return null
  }
}

export function writeConsent(c: Omit<Consent, 'v' | 'at'>) {
  const value: Consent = { v: 1, at: new Date().toISOString(), ...c }
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=${60 * 60 * 24 * 180}; SameSite=Lax${secure}`
  window.dispatchEvent(new CustomEvent('karat:consent', { detail: value }))
  return value
}

declare global {
  interface Window {
    plausible?: (name: string, opts?: { props?: Record<string, string | number | boolean> }) => void
  }
}

export function sanitizeProps(props: Record<string, unknown> = {}) {
  const out: Record<string, string | number | boolean> = {}
  for (const [k, v] of Object.entries(props)) {
    if (PII_KEYS.includes(k)) continue
    if (typeof v === 'string' && /@|\+?\d[\d\s]{7,}/.test(v)) continue // looks like email/phone
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') out[k] = typeof v === 'string' ? v.slice(0, 80) : v
  }
  return out
}

export function track(name: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  if (!readConsent()?.analytics) return
  window.plausible?.(name, { props: sanitizeProps(props) })
}
