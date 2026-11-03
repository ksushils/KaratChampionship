/**
 * Production-safe base content. Contains NO drivers, results, partners, prices or testimonials.
 * Facts about championships are limited to items observed on official sources on 2026-11-03
 * (see DATA-SOURCES.md) and carry a SourceRecord.
 */
export const ACCESSED = '2026-11-03'

export const SOURCES = [
  { key: 'if4-site', title: 'Italian F4 Championship — official site', url: 'https://f4championship.com/', publisher: 'ACI Sport / WSK Promotion' },
  { key: 'if4-regs-2026', title: 'Italian F4 2026 Sporting Regulations', url: 'https://acisport.it/en/f4/regulations/2026', publisher: 'ACI Sport' },
  { key: 'gb4-site', title: 'GB4 Championship — official site', url: 'https://www.gb-4.net/', publisher: 'MotorSport Vision Racing' },
  { key: 'gb4-2026', title: "What's new in GB4 for 2026", url: 'https://www.gb-4.net/news/2026/apr/19/whats-new-in-gb4-2026', publisher: 'MotorSport Vision Racing' },
  { key: 'gb4-format', title: 'GB4 event format', url: 'https://www.gb-4.net/info/event-format', publisher: 'MotorSport Vision Racing' },
  { key: 'inf4-site', title: 'Indian F4 Championship — official site', url: 'https://fiaindianf4.com/about', publisher: 'Racing Promotions Pvt Ltd' },
  { key: 'fx-site', title: 'Formula X Italian Series — official site', url: 'https://www.formulaxitalianseries.it/', publisher: 'Formula X' },
  { key: 'frec-2026', title: 'FIA FREC 2026 Sporting Regulations (v5)', url: 'https://www.fia.com/system/files/documents/2026_fia_frec_sporting_regulations_v5_clean.pdf', publisher: 'FIA' },
  { key: 'f3-site', title: 'FIA Formula 3 — official site', url: 'https://www.fiaformula3.com/', publisher: 'Formula One Digital Media' },
  { key: 'f2-site', title: 'FIA Formula 2 — official site', url: 'https://www.fiaformula2.com/', publisher: 'Formula One Digital Media' },
  { key: 'kic-site', title: 'KIC Motorsport — official site', url: 'https://www.kicmotorsport.com/', publisher: 'KIC Motorsport' },
] as const

export const DIVISIONS = [
  {
    key: 'championship-team',
    name: 'Championship Team',
    pathwayLabel: 'Race with Karat',
    tagline: 'Single-seater race programmes built around driver development.',
    description:
      'Karat Racing’s team business prepares and operates cars for drivers in junior single-seater championships, with engineering, preparation and race-weekend support.',
    status: 'enquiries-open',
    order: 1,
  },
  {
    key: 'testing',
    name: 'Testing & Karat Academy',
    pathwayLabel: 'Develop your performance',
    tagline: 'Track time and structured development, separate from a race season.',
    description:
      'A proposed testing and driver-development business using Karat-operated and partner-provided single-seaters. Enquiries are open while the programme is finalised.',
    status: 'enquiries-open',
    order: 2,
  },
  {
    key: 'championship-organisation',
    name: 'Championship Series',
    pathwayLabel: 'Building racing in India',
    tagline: 'An ambition to develop and operate a new championship in India.',
    description:
      'Karat Racing intends to develop a championship in India. The project is at planning stage and is separate from the team’s own racing activity.',
    status: 'planned',
    order: 3,
  },
] as const

export const CHAMPIONSHIPS = [
  { slug: 'italian-f4', name: 'Italian F4 Championship', shortName: 'Italian F4', officialUrl: 'https://f4championship.com/', organiser: 'ACI Sport (promoted with WSK Promotion)', geography: 'Italy and European circuits', level: 'f4', aliases: ['Formula 4 Italian Championship', 'F4 Italia'], source: 'if4-site' },
  { slug: 'gb4', name: 'GB4 Championship', shortName: 'GB4', officialUrl: 'https://www.gb-4.net/', organiser: 'MotorSport Vision Racing', geography: 'United Kingdom', level: 'entry-single-seater', aliases: [], source: 'gb4-site' },
  { slug: 'indian-f4', name: 'Indian F4 Championship', shortName: 'Indian F4', officialUrl: 'https://fiaindianf4.com', organiser: 'Racing Promotions Pvt Ltd (RPPL)', geography: 'India', level: 'f4', aliases: ['FIA F4 Indian Championship', 'F4 Indian Championship'], source: 'inf4-site' },
  { slug: 'formula-x', name: 'Formula X Italian Series', shortName: 'Formula X', officialUrl: 'https://www.formulaxitalianseries.it/', organiser: 'Formula X', geography: 'Italy', level: 'formula-libre', aliases: ['TopJet F2000', 'F2000 Italian Formula Trophy'], source: 'fx-site' },
  { slug: 'fia-frec', name: 'FIA Formula Regional European Championship', shortName: 'FIA FREC', officialUrl: 'https://www.fia.com/events/fia-formula-regional-european-championship/season-2026/fia-formula-regional-european', organiser: 'FIA (promoter: ACI)', geography: 'Europe', level: 'regional', aliases: ['FRECA', 'Formula Regional European Championship by Alpine'], source: 'frec-2026' },
  { slug: 'fia-f3', name: 'FIA Formula 3 Championship', shortName: 'FIA F3', officialUrl: 'https://www.fiaformula3.com/', organiser: 'Formula One Digital Media', geography: 'International', level: 'fia-f3', aliases: [], source: 'f3-site' },
  { slug: 'fia-f2', name: 'FIA Formula 2 Championship', shortName: 'FIA F2', officialUrl: 'https://www.fiaformula2.com/', organiser: 'Formula One Digital Media', geography: 'International', level: 'fia-f2', aliases: [], source: 'f2-site' },
] as const

export const SEASONS_2026 = [
  {
    championship: 'italian-f4',
    year: 2026,
    documents: [{ label: '2026 Sporting Regulations (ACI Sport)', url: 'https://acisport.it/en/f4/regulations/2026' }],
    pointsDescription: 'Points to the top 15 in every race: 30-26-22-20-18-16-14-12-10-9-8-6-4-2-1 (2026 regulations).',
    points: { race: [30, 26, 22, 20, 18, 16, 14, 12, 10, 9, 8, 6, 4, 2, 1] },
    pointsSource: 'if4-regs-2026',
    format: [
      { element: 'Standard weekend', detail: 'Practice, qualifying and races as published per event' },
      { element: 'Over-capacity format', detail: 'Large entries split into qualifying groups, qualifying races and a Final (2026 regulations)' },
    ],
    machinery: {},
  },
  {
    championship: 'gb4',
    year: 2026,
    documents: [
      { label: 'GB4 event format', url: 'https://www.gb-4.net/info/event-format' },
      { label: "What's new for 2026", url: 'https://www.gb-4.net/news/2026/apr/19/whats-new-in-gb4-2026' },
    ],
    format: [{ element: 'Races', detail: '20-minute races in 2026 (up from 18 minutes)' }],
    classes: ['Rookie'],
    machinery: { chassis: 'Tatuus MSV GB4-025', source: 'gb4-site' },
  },
  {
    championship: 'indian-f4',
    year: 2026,
    documents: [{ label: 'Championship information (official site)', url: 'https://fiaindianf4.com/about' }],
    format: [],
    machinery: {},
  },
] as const

export const PROGRAMMES = [
  {
    slug: 'italian-f4',
    title: 'Italian F4',
    championship: 'italian-f4',
    order: 1,
    status: 'intended',
    relationshipType: 'proposed-participant',
    shortDescription: 'An FIA-certified Formula 4 championship in Italy and one of Europe’s most competitive grids for drivers leaving karting.',
    comparison: { geography: 'Italy and European circuits', developmentPurpose: 'First full single-seater season against a large international field', support: 'Engineering, preparation and race-weekend operation (scope to be confirmed per season)' },
    driverFit: 'Drivers moving up from international karting, or with an initial single-seater season, who want a large and competitive grid. Eligibility is set by the championship each season. Check the current regulations.',
  },
  {
    slug: 'gb4',
    title: 'GB4',
    championship: 'gb4',
    order: 2,
    status: 'intended',
    relationshipType: 'proposed-participant',
    shortDescription: 'A UK single-seater championship run by MotorSport Vision Racing. It is separate from British F4 and from GB3.',
    comparison: { geography: 'United Kingdom', developmentPurpose: 'Accessible step into single-seaters on UK circuits', support: 'Engineering, preparation and race-weekend operation (scope to be confirmed per season)' },
    driverFit: 'Drivers looking for a UK-based entry into car racing, including those changing from karting or other categories. Eligibility, car and testing rules are set each season. Check the official site.',
  },
  {
    slug: 'indian-f4',
    title: 'Indian F4',
    championship: 'indian-f4',
    order: 3,
    status: 'intended',
    relationshipType: 'other',
    shortDescription: 'The F4 championship promoted in India by Racing Promotions Pvt Ltd. Karat Racing’s relationship to this programme is still being defined.',
    comparison: { geography: 'India', developmentPurpose: 'Single-seater racing in India', support: 'To be confirmed once the participation model is agreed' },
    driverFit: 'Drivers wanting to race in India. The championship’s operating and entry model may differ from European F4. Karat will publish its role only once it is confirmed.',
  },
  {
    slug: 'formula-x-f2000',
    title: 'Formula X Italian / TopJet F2000',
    championship: 'formula-x',
    order: 4,
    status: 'intended',
    relationshipType: 'proposed-participant',
    shortDescription: 'Italian single-seater series for different generations of formula cars, useful for mileage and racing experience.',
    comparison: { geography: 'Italy', developmentPurpose: 'Racing mileage across single-seater generations', support: 'To be confirmed per season' },
    driverFit: 'Drivers who want extra racing mileage in Italy. Classes and eligibility depend on the series rules for each season.',
  },
  {
    slug: 'fia-f3',
    title: 'FIA F3',
    championship: 'fia-f3',
    order: 10,
    status: 'future',
    relationshipType: 'other',
    shortDescription: 'A long-term ambition. Karat Racing does not hold an FIA F3 entry.',
    comparison: { geography: 'International', developmentPurpose: 'Future ambition only', support: '—' },
    driverFit: '',
  },
  {
    slug: 'fia-f2',
    title: 'FIA F2',
    championship: 'fia-f2',
    order: 11,
    status: 'future',
    relationshipType: 'other',
    shortDescription: 'A long-term ambition. Karat Racing does not hold an FIA F2 entry.',
    comparison: { geography: 'International', developmentPurpose: 'Future ambition only', support: '—' },
    driverFit: '',
  },
] as const

export const FAQS = [
  { category: 'driver-enquiries', question: 'Who should make a race-programme enquiry?', answer: 'A driver, a parent or guardian, a manager or an academy representative can enquire. If the driver is under 18, a parent or guardian must be involved, and we will communicate with them.', order: 1 },
  { category: 'driver-enquiries', question: 'Do I need to send documents with my enquiry?', answer: 'No. Please do not send passports, medical records or licence scans with a first enquiry. We will explain what is needed, and how to share it securely, if a programme goes ahead.', order: 2 },
  { category: 'driver-enquiries', question: 'Do you publish programme prices?', answer: 'Not at the moment. Programme costs depend on the championship, the season, the testing plan and the support required, so we discuss them individually.', order: 3 },
  { category: 'programmes', question: 'What does “Intended programme” mean?', answer: 'It means Karat Racing plans to take part but the entry is not yet confirmed. We change the label to “Confirmed” only after the entry is confirmed and we hold supporting evidence.', order: 1 },
  { category: 'programmes', question: 'Is the Championship Series related to Indian F4?', answer: 'No. Karat’s plan to organise a championship in India is a separate project. It is not connected to the existing Indian F4 championship, and Karat does not own or operate that championship.', order: 2 },
  { category: 'sponsorship', question: 'What partnership opportunities exist?', answer: 'Opportunities include livery positions, team clothing, digital content, events and hospitality, technical collaboration and support for driver development. All are subject to availability, rights and a written agreement.', order: 1 },
  { category: 'logistics', question: 'Can you help international drivers with travel and visas?', answer: 'We can talk through the practical side of racing abroad. We cannot guarantee visas or immigration outcomes, which are decided by the relevant authorities.', order: 1 },
  { category: 'general', question: 'How quickly will you reply?', answer: 'Every enquiry is saved and passed to the relevant team. You will receive a reference number when you submit.', order: 1 },
  { category: 'testing', question: 'Can I book a test online?', answer: 'Not yet. Testing is handled by enquiry while the programme is finalised. We do not take online bookings or payments.', order: 1 },
  { category: 'championship-organisation', question: 'Has the championship been approved?', answer: 'No approvals are claimed. The project is at planning stage, and we will publish updates only when there is something confirmed to share.', order: 1 },
] as const
