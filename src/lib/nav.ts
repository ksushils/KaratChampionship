/** Testing & Karat Academy runs as its own booking site (the Karat Racing app), not as pages on this site. */
export const TESTING_URL = process.env.NEXT_PUBLIC_TESTING_URL || 'https://testing.karatracing.com'
export const TESTING_ENQUIRE_URL = `${TESTING_URL}/request-a-quote`

export const DIVISION_LINKS = [
  { key: 'championship-team', label: 'Championship Team', short: 'Racing Team', href: '/championship-team' },
  { key: 'testing', label: 'Testing & Karat Academy', short: 'Testing', href: TESTING_URL },
  { key: 'championship-organisation', label: 'Championship Series', short: 'Series', href: '/championship-organisation' },
] as const

export type NavGroup = { label: string; href: string; children?: { label: string; href: string; description?: string }[] }

/** Championship Team navigation (5.3). */
export const TEAM_NAV: NavGroup[] = [
  {
    label: 'Team',
    href: '/championship-team/about',
    children: [
      { label: 'About Karat', href: '/championship-team/about' },
      { label: 'Heritage', href: '/championship-team/heritage' },
      { label: 'People', href: '/championship-team/people' },
      { label: 'Facilities', href: '/championship-team/facilities' },
      { label: 'Driver development', href: '/championship-team/driver-development' },
      { label: 'Careers', href: '/championship-team/careers' },
      { label: 'FAQs', href: '/championship-team/faqs' },
      { label: 'Contact', href: '/championship-team/contact' },
    ],
  },
  {
    label: 'Programmes',
    href: '/championship-team/programmes',
    children: [
      { label: 'All programmes', href: '/championship-team/programmes' },
      { label: 'Italian F4', href: '/championship-team/programmes/italian-f4' },
      { label: 'GB4', href: '/championship-team/programmes/gb4' },
      { label: 'Indian F4', href: '/championship-team/programmes/indian-f4' },
      { label: 'Formula X / F2000', href: '/championship-team/programmes/formula-x-f2000' },
    ],
  },
  { label: 'Drivers', href: '/championship-team/drivers', children: [{ label: 'Drivers', href: '/championship-team/drivers' }, { label: 'Alumni', href: '/championship-team/alumni' }] },
  {
    label: 'Race Centre',
    href: '/championship-team/race-centre',
    children: [
      { label: 'Race Centre', href: '/championship-team/race-centre' },
      { label: 'Calendar', href: '/championship-team/calendar' },
      { label: 'Results', href: '/championship-team/results' },
      { label: 'Standings', href: '/championship-team/standings' },
    ],
  },
  {
    label: 'News & Media',
    href: '/championship-team/news',
    children: [
      { label: 'News', href: '/championship-team/news' },
      { label: 'Media', href: '/championship-team/media' },
      { label: 'Press', href: '/championship-team/press' },
    ],
  },
  {
    label: 'Partners',
    href: '/championship-team/partners',
    children: [
      { label: 'Our partners', href: '/championship-team/partners' },
      { label: 'Partner with us', href: '/championship-team/partner-with-us' },
      { label: 'Hospitality', href: '/championship-team/hospitality' },
    ],
  },
]
