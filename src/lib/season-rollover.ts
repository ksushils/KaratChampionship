/**
 * Season rollover (CMS-18, acceptance #13). Produces the data for a new programme-season
 * record. Confirmation status, drivers, seat availability and sponsor rights are NEVER copied.
 */
export interface ProgrammeSeasonLike {
  programme: string | number
  year: number
  participationStatus?: string | null
  seatAvailability?: string | null
  relationshipType?: string | null
  notes?: string | null
}

export function rolloverProgrammeSeason(prev: ProgrammeSeasonLike, newYear?: number) {
  const year = newYear ?? prev.year + 1
  if (year <= prev.year) throw new Error('Rollover year must be later than the source season')
  return {
    programme: prev.programme,
    year,
    // Re-assessed every season — never inherited.
    participationStatus: 'intended' as const,
    seatAvailability: 'not-published' as const,
    relationshipType: prev.relationshipType ?? null,
    notes: `Created by season rollover from ${prev.year}. Participation status reset to "Intended" pending confirmation.`,
  }
}
