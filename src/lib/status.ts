/** Human-readable labels for statuses — text always accompanies colour (WCAG 1.4.1). */
export const PROGRAMME_STATUS_LABEL: Record<string, string> = {
  intended: 'Intended programme',
  'subject-to-approval': 'Subject to approval',
  confirmed: 'Confirmed entry',
  active: 'Active',
  completed: 'Season completed',
  archived: 'Archived',
  future: 'Future ambition',
}
export const DIVISION_STATUS_LABEL: Record<string, string> = {
  planned: 'Planned',
  'enquiries-open': 'Enquiries open',
  'launching-soon': 'Launching soon',
  operational: 'Operational',
}
export const EVENT_STATUS_LABEL: Record<string, string> = {
  scheduled: 'Scheduled',
  provisional: 'Provisional',
  postponed: 'Postponed',
  cancelled: 'Cancelled',
  completed: 'Completed',
  revised: 'Revised',
}
export const SEAT_LABEL: Record<string, string> = {
  'not-published': 'Discuss availability',
  available: 'Seats available',
  limited: 'Limited availability',
  full: 'Line-up complete',
}
export type Tone = 'gold' | 'blue' | 'neutral' | 'warn' | 'danger' | 'success'
export const statusTone = (s?: string | null): Tone => {
  switch (s) {
    case 'confirmed':
    case 'active':
    case 'operational':
    case 'available':
    case 'final':
      return 'success'
    case 'intended':
    case 'enquiries-open':
    case 'scheduled':
    case 'limited':
      return 'gold'
    case 'subject-to-approval':
    case 'launching-soon':
    case 'provisional':
    case 'future':
    case 'planned':
      return 'blue'
    case 'postponed':
    case 'revised':
      return 'warn'
    case 'cancelled':
    case 'full':
      return 'danger'
    default:
      return 'neutral'
  }
}
