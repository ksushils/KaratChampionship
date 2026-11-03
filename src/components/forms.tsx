'use client'
/** Form configurations live client-side because they contain conditional-display functions. */
import { CONTACT_STEP, EnquiryForm, type StepDef } from './EnquiryForm'

type Opt = { value: string; label: string }
const minorBand = (v: Record<string, string>) => ['under-14', '14-15', '16-17'].includes(v.ageBand)

export function RaceEnquiryForm({ programmes, seasons, defaultProgramme, initialKey }: { programmes: Opt[]; seasons: Opt[]; defaultProgramme?: string; initialKey: string }) {
  const steps: StepDef[] = [
    {
      title: 'Programme',
      description: 'Tell us what you are interested in. Nothing here is a commitment.',
      fields: [
        { name: 'programme', label: 'Programme of interest', type: 'radio', required: true, options: [...programmes, { value: 'undecided', label: 'Undecided — advise me' }] },
        { name: 'season', label: 'Intended season', type: 'select', options: seasons },
      ],
    },
    {
      title: 'The driver',
      description: 'We only ask for an age band at this stage — no documents, please.',
      fields: [
        {
          name: 'role',
          label: 'Who is enquiring?',
          type: 'radio',
          required: true,
          options: [
            { value: 'driver', label: 'I am the driver' },
            { value: 'parent-guardian', label: 'Parent or guardian' },
            { value: 'manager', label: 'Driver manager' },
            { value: 'academy', label: 'Academy or programme' },
            { value: 'other-representative', label: 'Other representative' },
          ],
        },
        { name: 'driverName', label: 'Driver name', type: 'text', showIf: (v) => Boolean(v.role) && v.role !== 'driver' },
        {
          name: 'ageBand',
          label: 'Driver age band',
          type: 'select',
          required: true,
          options: [
            { value: 'under-14', label: 'Under 14' },
            { value: '14-15', label: '14–15' },
            { value: '16-17', label: '16–17' },
            { value: '18-plus', label: '18 or over' },
            { value: 'prefer-not', label: 'Prefer not to say yet' },
          ],
        },
        { name: 'guardianName', label: 'Parent or guardian name', type: 'text', required: true, showIf: (v) => v.role === 'driver' && minorBand(v), hint: 'Drivers under 18 need a parent or guardian involved. We will include them in our reply.' },
        { name: 'guardianEmail', label: 'Parent or guardian email', type: 'email', required: true, showIf: (v) => v.role === 'driver' && minorBand(v) },
        { name: 'guardianConsent', label: 'My parent or guardian knows I am making this enquiry', type: 'checkbox', required: true, showIf: (v) => v.role === 'driver' && minorBand(v) },
        { name: 'currentCategory', label: 'Current or most recent category', type: 'text', hint: 'e.g. OK-Junior karting, F4, GB4' },
        { name: 'experience', label: 'Racing background (optional)', type: 'textarea', hint: 'Briefly: years racing, key results, testing so far.' },
        { name: 'profileLink', label: 'Link to a racing CV or profile (optional)', type: 'url', hint: 'Must start with https://' },
      ],
    },
    {
      ...CONTACT_STEP,
      fields: [
        ...CONTACT_STEP.fields,
        {
          name: 'budget',
          label: 'Funding readiness (optional)',
          type: 'select',
          hint: 'This only helps us suggest realistic options. You can skip it.',
          options: [
            { value: 'not-yet', label: 'Not considered yet' },
            { value: 'exploring', label: 'Exploring funding options' },
            { value: 'partly-funded', label: 'Partly funded' },
            { value: 'funded', label: 'Funding in place' },
            { value: 'prefer-not', label: 'Prefer to discuss' },
          ],
        },
        { name: 'message', label: 'Anything else? (optional)', type: 'textarea' },
      ],
    },
  ]
  return (
    <EnquiryForm
      category="race-programme"
      steps={steps}
      defaults={defaultProgramme ? { programme: defaultProgramme } : {}}
      initialKey={initialKey}
      analyticsStart="race_enquiry_started"
      analyticsSubmit="race_enquiry_submitted"
      submitLabel="Send race enquiry"
    />
  )
}

export function PartnershipEnquiryForm({ initialKey, scope }: { initialKey: string; scope?: string }) {
  const steps: StepDef[] = [
    {
      title: 'Your organisation',
      fields: [
        { name: 'organisation', label: 'Organisation', type: 'text', required: true, autoComplete: 'organization' },
        { name: 'jobTitle', label: 'Your role', type: 'text', autoComplete: 'organization-title' },
        {
          name: 'objectives',
          label: 'What would you like a partnership to achieve?',
          type: 'checkbox-group',
          options: [
            { value: 'brand-visibility', label: 'Brand visibility' },
            { value: 'b2b-relationships', label: 'Business relationships' },
            { value: 'hospitality', label: 'Client hospitality' },
            { value: 'content', label: 'Content & storytelling' },
            { value: 'technical', label: 'Technical collaboration' },
            { value: 'talent', label: 'Supporting young talent' },
          ],
        },
        { name: 'markets', label: 'Key markets or regions', type: 'text', hint: 'e.g. UK, Italy, India' },
        {
          name: 'interestScope',
          label: 'Interest',
          type: 'select',
          options: [
            { value: 'team', label: 'Whole team' },
            { value: 'programme', label: 'A specific programme' },
            { value: 'driver', label: 'A driver' },
            { value: 'undecided', label: 'Not sure yet' },
          ],
        },
        { name: 'timing', label: 'Timing', type: 'select', options: [{ value: 'this-season', label: 'This season' }, { value: 'next-season', label: 'Next season' }, { value: 'exploring', label: 'Just exploring' }] },
        { name: 'budget', label: 'Indicative budget (optional)', type: 'text', hint: 'Optional — a range is fine.' },
      ],
    },
    { ...CONTACT_STEP, fields: [...CONTACT_STEP.fields, { name: 'message', label: 'Message (optional)', type: 'textarea' }] },
  ]
  return <EnquiryForm category="partnership" steps={steps} initialKey={initialKey} defaults={scope ? { interestScope: scope } : {}} analyticsSubmit="sponsor_enquiry_submitted" analyticsStart="sponsor_enquiry_started" submitLabel="Send partnership enquiry" />
}

export function HospitalityEnquiryForm({ initialKey, events, defaultEvent }: { initialKey: string; events: Opt[]; defaultEvent?: string }) {
  const steps: StepDef[] = [
    {
      title: 'Your requirements',
      description: 'This is an enquiry, not a booking. Passes and paddock access depend on championship organisers.',
      fields: [
        { name: 'organisation', label: 'Organisation (optional)', type: 'text' },
        { name: 'event', label: 'Event of interest', type: 'select', options: [...events, { value: 'flexible', label: 'Flexible / any event' }] },
        { name: 'partySize', label: 'Approximate party size', type: 'number' },
        { name: 'objectives', label: 'What would you like to achieve?', type: 'textarea' },
        { name: 'accessibilityNotes', label: 'Accessibility requirements (optional)', type: 'textarea', hint: 'Share only what you are comfortable sharing; we will discuss it privately.' },
      ],
    },
    CONTACT_STEP,
  ]
  return <EnquiryForm category="hospitality" steps={steps} initialKey={initialKey} defaults={defaultEvent ? { event: defaultEvent } : {}} submitLabel="Send hospitality enquiry" successNextSteps="Your enquiry has been saved. It is not a booking — we will come back to you to discuss what is possible at the event." />
}

export function GeneralEnquiryForm({
  initialKey,
  category,
  topics,
  defaults,
  showOrganisation,
  submitLabel,
  analyticsSubmit,
}: {
  initialKey: string
  category: 'media' | 'general' | 'safeguarding' | 'testing' | 'championship-organisation'
  topics?: Opt[]
  defaults?: Record<string, string>
  showOrganisation?: boolean
  submitLabel?: string
  analyticsSubmit?: string
}) {
  const fields: StepDef['fields'] = []
  if (topics?.length) fields.push({ name: 'topic', label: 'Topic', type: 'select', required: true, options: topics })
  if (showOrganisation) fields.push({ name: 'organisation', label: 'Organisation (optional)', type: 'text' })
  fields.push(...CONTACT_STEP.fields)
  fields.push({ name: 'message', label: 'Your message', type: 'textarea', required: true })
  if (defaults?.programme) fields.push({ name: 'programme', label: 'Related programme', type: 'text', hint: 'Pre-filled from the page you came from — you can change it.' })
  return <EnquiryForm category={category} steps={[{ title: 'Your message', fields }]} initialKey={initialKey} defaults={defaults} submitLabel={submitLabel} analyticsSubmit={analyticsSubmit} />
}
