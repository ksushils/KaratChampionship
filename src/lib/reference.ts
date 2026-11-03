import { randomBytes } from 'node:crypto'
const PREFIX: Record<string, string> = {
  'race-programme': 'RP',
  partnership: 'PT',
  hospitality: 'HS',
  media: 'MD',
  testing: 'TS',
  'championship-organisation': 'CO',
  safeguarding: 'SG',
  general: 'GN',
  application: 'AP',
}
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
/** Human-friendly, non-sequential reference, e.g. KR-RP-7H3K9Q (LEAD-22). */
export function makeReference(category: string): string {
  const bytes = randomBytes(6)
  let s = ''
  for (const b of bytes) s += ALPHABET[b % ALPHABET.length]
  return `KR-${PREFIX[category] ?? 'GN'}-${s}`
}
