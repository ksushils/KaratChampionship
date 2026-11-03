import { z } from 'zod'

/** Shared enquiry validation (LEAD-14). Used by the client for hints and by the server as the authority. */

export const DIVISIONS = ['championship-team', 'testing', 'championship-organisation'] as const
export const CATEGORIES = [
  'race-programme',
  'partnership',
  'hospitality',
  'media',
  'testing',
  'championship-organisation',
  'safeguarding',
  'general',
] as const
export type EnquiryCategory = (typeof CATEGORIES)[number]

/** Which business division owns each category (GW-07, UTIL-03). */
export const CATEGORY_DIVISION: Record<EnquiryCategory, (typeof DIVISIONS)[number]> = {
  'race-programme': 'championship-team',
  partnership: 'championship-team',
  hospitality: 'championship-team',
  media: 'championship-team',
  safeguarding: 'championship-team',
  general: 'championship-team',
  testing: 'testing',
  'championship-organisation': 'championship-organisation',
}

export const ENQUIRER_ROLES = ['driver', 'parent-guardian', 'manager', 'academy', 'other-representative'] as const
export const AGE_BANDS = ['under-14', '14-15', '16-17', '18-plus', 'prefer-not'] as const
export const BUDGET_BANDS = ['not-yet', 'exploring', 'partly-funded', 'funded', 'prefer-not'] as const

const optStr = (max = 200) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined))

const contact = {
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z.string().trim().email('Please enter a valid email address').max(200),
  country: z.string().trim().min(2, 'Please tell us your country').max(80),
  phone: optStr(40).refine((v) => !v || /^[+()\d\s.-]{6,40}$/.test(v), 'Please enter a valid telephone number'),
  message: optStr(3000),
  marketingOptIn: z.coerce.boolean().optional().default(false),
  privacyAcknowledged: z.literal(true, { errorMap: () => ({ message: 'Please confirm you have read the privacy notice' }) }),
}

const meta = {
  idempotencyKey: z.string().trim().min(8).max(80),
  sourcePage: optStr(300),
  campaign: optStr(300),
  // Spam controls (LEAD-15): honeypot must stay empty.
  website: z.string().max(0, 'Spam check failed').optional().default(''),
}

export const raceEnquirySchema = z
  .object({
    category: z.literal('race-programme'),
    programme: z.string().trim().min(1, 'Please choose a programme or "Undecided"').max(80),
    season: optStr(20),
    role: z.enum(ENQUIRER_ROLES, { errorMap: () => ({ message: 'Please tell us who is enquiring' }) }),
    driverName: optStr(120),
    ageBand: z.enum(AGE_BANDS, { errorMap: () => ({ message: 'Please choose an age band' }) }),
    guardianName: optStr(120),
    guardianEmail: optStr(200).refine((v) => !v || z.string().email().safeParse(v).success, 'Please enter a valid guardian email'),
    guardianConsent: z.coerce.boolean().optional().default(false),
    experience: optStr(1500),
    currentCategory: optStr(120),
    budget: z.enum(BUDGET_BANDS).optional(),
    profileLink: optStr(300).refine((v) => !v || /^https?:\/\//.test(v), 'Links must start with http:// or https://'),
    ...contact,
    ...meta,
  })
  .superRefine((v, ctx) => {
    const minor = v.ageBand === 'under-14' || v.ageBand === '14-15' || v.ageBand === '16-17'
    // LEAD-09: a minor driver enquiring directly must involve a parent/guardian.
    if (minor && v.role === 'driver') {
      if (!v.guardianName) ctx.addIssue({ code: 'custom', path: ['guardianName'], message: 'Please add a parent or guardian name' })
      if (!v.guardianEmail) ctx.addIssue({ code: 'custom', path: ['guardianEmail'], message: 'Please add a parent or guardian email' })
      if (!v.guardianConsent)
        ctx.addIssue({ code: 'custom', path: ['guardianConsent'], message: 'A parent or guardian must be aware of this enquiry' })
    }
  })

export const partnershipEnquirySchema = z.object({
  category: z.literal('partnership'),
  organisation: z.string().trim().min(2, 'Please enter your organisation').max(160),
  jobTitle: optStr(120),
  objectives: z.array(z.string().max(60)).max(12).optional().default([]),
  markets: optStr(300),
  timing: optStr(80),
  budget: optStr(80),
  interestScope: optStr(80),
  ...contact,
  ...meta,
})

export const hospitalityEnquirySchema = z.object({
  category: z.literal('hospitality'),
  organisation: optStr(160),
  event: optStr(80),
  partySize: z.coerce.number().int().min(1, 'Party size must be at least 1').max(500).optional(),
  objectives: optStr(1000),
  accessibilityNotes: optStr(1000),
  ...contact,
  ...meta,
})

export const generalEnquirySchema = z.object({
  category: z.enum(['media', 'general', 'safeguarding', 'testing', 'championship-organisation']),
  topic: optStr(80),
  organisation: optStr(160),
  programme: optStr(80),
  ...contact,
  message: z.string().trim().min(10, 'Please tell us a little more (at least 10 characters)').max(3000),
  ...meta,
})

export const enquirySchema = z.union([raceEnquirySchema, partnershipEnquirySchema, hospitalityEnquirySchema, generalEnquirySchema])
export type EnquiryInput = z.infer<typeof enquirySchema>

export function schemaFor(category: string) {
  if (category === 'race-programme') return raceEnquirySchema
  if (category === 'partnership') return partnershipEnquirySchema
  if (category === 'hospitality') return hospitalityEnquirySchema
  return generalEnquirySchema
}

/** Flatten zod errors into { field: message } for accessible error summaries. */
export function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const i of err.issues) {
    const k = i.path.join('.') || 'form'
    if (!out[k]) out[k] = i.message
  }
  return out
}

/** Keys that must never leave the server in analytics payloads (privacy). */
export const PII_KEYS = ['name', 'email', 'phone', 'message', 'driverName', 'guardianName', 'guardianEmail', 'experience', 'cv', 'coverNote', 'objectives', 'accessibilityNotes']
