'use client'
import Link from 'next/link'
import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import { enquiryAction } from '@/app/(frontend)/actions'
import type { SubmitResult } from '@/lib/enquiry-service'
import { track } from './analytics'
import { buttonClass, cx } from './ui'

export type FieldDef = {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'url' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'checkbox-group'
  required?: boolean
  hint?: string
  options?: { value: string; label: string }[]
  autoComplete?: string
  showIf?: (values: Record<string, string>) => boolean
}
export type StepDef = { title: string; description?: string; fields: FieldDef[] }

export const CONTACT_STEP: StepDef = {
  title: 'Your contact details',
  fields: [
    { name: 'name', label: 'Full name', type: 'text', required: true, autoComplete: 'name' },
    { name: 'email', label: 'Email address', type: 'email', required: true, autoComplete: 'email' },
    { name: 'country', label: 'Country', type: 'text', required: true, autoComplete: 'country-name' },
    { name: 'phone', label: 'Telephone (optional)', type: 'tel', autoComplete: 'tel', hint: 'Include the country code, e.g. +44' },
  ],
}

type Props = {
  category: string
  steps: StepDef[]
  defaults?: Record<string, string>
  initialKey: string
  analyticsStart?: string
  analyticsSubmit?: string
  submitLabel?: string
  successNextSteps?: string
}

export function EnquiryForm({ category, steps: rawSteps, defaults = {}, initialKey, analyticsStart, analyticsSubmit, submitLabel = 'Send enquiry', successNextSteps }: Props) {
  const steps = useMemo(() => [...rawSteps], [rawSteps])
  const [state, action, pending] = useActionState<SubmitResult | null, FormData>(enquiryAction, null)
  const [step, setStep] = useState(0)
  const [hydrated, setHydrated] = useState(false)
  const [values, setValues] = useState<Record<string, string>>(defaults)
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})
  const [renderedAt] = useState(() => Date.now())
  const [meta, setMeta] = useState({ sourcePage: '', campaign: '' })
  const started = useRef(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    setHydrated(true)
    const p = new URLSearchParams(location.search)
    const utm = ['utm_source', 'utm_medium', 'utm_campaign'].map((k) => (p.get(k) ? `${k}=${p.get(k)}` : '')).filter(Boolean).join('&')
    setMeta({ sourcePage: p.get('from') || document.referrer.replace(location.origin, '') || location.pathname, campaign: utm })
  }, [])

  const serverErrors = state && !state.ok ? state.errors : {}
  const errors = { ...serverErrors, ...clientErrors }

  useEffect(() => {
    if (!state) return
    if (state.ok) {
      if (analyticsSubmit) track(analyticsSubmit, { category, programme: values.programme ?? '' })
      successRef.current?.focus()
    } else {
      const firstBad = steps.findIndex((s) => s.fields.some((f) => state.errors[f.name]))
      if (firstBad >= 0) setStep(firstBad)
      setTimeout(() => summaryRef.current?.focus(), 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const visible = (f: FieldDef) => !f.showIf || f.showIf(values)
  const set = (name: string, v: string) => {
    if (!started.current && analyticsStart) {
      started.current = true
      track(analyticsStart, { category, programme: values.programme ?? defaults.programme ?? '' })
    }
    setValues((s) => ({ ...s, [name]: v }))
  }

  const validateStep = (i: number) => {
    const errs: Record<string, string> = {}
    for (const f of steps[i].fields) {
      if (!visible(f) || !f.required) continue
      const v = values[f.name]
      if (f.type === 'checkbox' ? v !== 'on' : !v || !String(v).trim()) errs[f.name] = `${f.label.replace(/\s*\(.*\)$/, '')} is required`
      else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errs[f.name] = 'Please enter a valid email address'
    }
    setClientErrors(errs)
    if (Object.keys(errs).length) setTimeout(() => summaryRef.current?.focus(), 0)
    return !Object.keys(errs).length
  }
  const go = (n: number) => {
    if (n > step && !validateStep(step)) return
    track('enquiry_step_completed', { category, step: step + 1 })
    setClientErrors({})
    setStep(n)
    setTimeout(() => stepHeadingRef.current?.focus(), 0)
  }

  if (state?.ok)
    return (
      <div className="rounded-card border border-success/50 bg-success/5 p-6 md:p-8" role="status">
        <h2 ref={successRef} tabIndex={-1} className="font-display text-3xl font-bold uppercase">
          Enquiry received
        </h2>
        <p className="mt-3">
          Your reference is <strong className="font-display text-2xl tracking-widest text-gold-200" data-testid="enquiry-reference">{state.reference}</strong>
        </p>
        <p className="text-mist mt-3">
          {successNextSteps ??
            'Your enquiry has been saved and passed to the right team. If you gave an email address we will send a confirmation there. Please quote your reference if you contact us again.'}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/championship-team" className={buttonClass('outline')}>
            Back to Championship Team
          </Link>
          <Link href="/championship-team/faqs" className={buttonClass('ghost')}>
            Read the FAQs
          </Link>
        </div>
      </div>
    )

  const errorList = Object.entries(errors).filter(([k]) => k !== 'form')
  const isLast = step === steps.length - 1

  return (
    <form action={action} noValidate className="grid gap-6" aria-describedby="form-required-note">
      <input type="hidden" name="category" value={category} />
      <input type="hidden" name="idempotencyKey" value={initialKey} />
      <input type="hidden" name="renderedAt" value={renderedAt} />
      <input type="hidden" name="sourcePage" value={meta.sourcePage} />
      <input type="hidden" name="campaign" value={meta.campaign} />
      {/* Honeypot (LEAD-15): hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {hydrated && steps.length > 1 && (
        <ol className="flex flex-wrap gap-2" aria-label="Form progress">
          {steps.map((s, i) => (
            <li key={s.title} aria-current={i === step ? 'step' : undefined} className={cx('flex items-center gap-2 rounded border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider', i === step ? 'border-gold-400 text-gold-200' : i < step ? 'border-success/50 text-success' : 'border-white/15 text-mist')}>
              <span aria-hidden="true">{i < step ? '✓' : i + 1}</span>
              <span>
                <span className="sr-only">Step {i + 1} of {steps.length}: </span>
                {s.title}
                {i < step && <span className="sr-only"> (completed)</span>}
              </span>
            </li>
          ))}
        </ol>
      )}

      {(errorList.length > 0 || (state && !state.ok)) && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-card border-2 border-danger/70 bg-danger/10 p-4">
          <p className="font-semibold">{state && !state.ok && !Object.keys(clientErrors).length ? state.message : 'Please correct the following:'}</p>
          {errorList.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-sm">
              {errorList.map(([k, m]) => (
                <li key={k}>
                  <a href={`#f-${k}`} className="underline">
                    {m}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p id="form-required-note" className="text-mist text-sm">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">required</span> are required.
      </p>

      {steps.map((s, i) => (
        <fieldset key={s.title} hidden={hydrated && i !== step} className="grid gap-5">
          <legend className="mb-2">
            <h2 ref={i === step ? stepHeadingRef : undefined} tabIndex={-1} className="font-display text-2xl font-bold uppercase focus:outline-none">
              {s.title}
            </h2>
            {s.description && <p className="text-mist mt-1 text-sm">{s.description}</p>}
          </legend>
          {s.fields.filter(visible).map((f) => (
            <Field key={f.name} f={f} value={values[f.name] ?? ''} error={errors[f.name]} onChange={(v) => set(f.name, v)} />
          ))}
          {i === steps.length - 1 && (
            <div className="grid gap-3 rounded-card border border-white/10 p-4">
              <Field
                f={{ name: 'privacyAcknowledged', type: 'checkbox', required: true, label: 'I have read the privacy notice and understand my enquiry will be stored and handled by Karat Racing to respond to me.' }}
                value={values.privacyAcknowledged ?? ''}
                error={errors.privacyAcknowledged}
                onChange={(v) => set('privacyAcknowledged', v)}
                extra={
                  <a href="/privacy" target="_blank" className="text-royal-300 underline">
                    Privacy notice<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                }
              />
              <Field
                f={{ name: 'marketingOptIn', type: 'checkbox', label: 'Optional: send me occasional Karat Racing news. This does not affect my enquiry and I can unsubscribe at any time.' }}
                value={values.marketingOptIn ?? ''}
                onChange={(v) => set('marketingOptIn', v)}
              />
            </div>
          )}
        </fieldset>
      ))}

      <div className="flex flex-wrap gap-3">
        {hydrated && step > 0 && (
          <button type="button" className={buttonClass('outline')} onClick={() => go(step - 1)}>
            ← Back
          </button>
        )}
        {hydrated && !isLast ? (
          <button type="button" className={buttonClass('gold')} onClick={() => go(step + 1)}>
            Continue →
          </button>
        ) : (
          <button
            type="submit"
            className={buttonClass('gold')}
            disabled={pending}
            aria-disabled={pending}
            onClick={(e) => {
              if (hydrated && !validateStep(step)) e.preventDefault()
            }}
          >
            {pending ? 'Sending…' : submitLabel}
          </button>
        )}
      </div>
      <p aria-live="polite" className="sr-only">
        {pending ? 'Sending your enquiry' : ''}
      </p>
    </form>
  )
}

function Field({ f, value, error, onChange, extra }: { f: FieldDef; value: string; error?: string; onChange: (v: string) => void; extra?: React.ReactNode }) {
  const id = `f-${f.name}`
  const hintId = f.hint ? `${id}-hint` : undefined
  const errId = error ? `${id}-err` : undefined
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined
  const req = f.required ? <span aria-hidden="true" className="text-gold-300"> *</span> : null
  if (f.type === 'checkbox')
    return (
      <div>
        <label htmlFor={id} className="flex min-h-11 items-start gap-3">
          <input id={id} name={f.name} type="checkbox" checked={value === 'on'} onChange={(e) => onChange(e.target.checked ? 'on' : '')} aria-invalid={Boolean(error)} aria-describedby={describedBy} aria-required={f.required} className="mt-1 size-5 shrink-0 accent-[#dcb35c]" />
          <span>
            {f.label}
            {req} {extra}
          </span>
        </label>
        {error && (
          <span id={errId} className="error-k">
            <span aria-hidden="true">✕ </span>
            {error}
          </span>
        )}
      </div>
    )
  if (f.type === 'radio' || f.type === 'checkbox-group')
    return (
      <fieldset aria-describedby={describedBy} id={id} tabIndex={-1}>
        <legend className="label-k">
          {f.label}
          {req}
        </legend>
        {f.hint && (
          <span id={hintId} className="hint-k">
            {f.hint}
          </span>
        )}
        <div className="grid gap-2 sm:grid-cols-2">
          {f.options?.map((o) => {
            const checked = f.type === 'radio' ? value === o.value : value.split('|').includes(o.value)
            return (
              <label key={o.value} className={cx('flex min-h-11 items-center gap-3 rounded border px-3 py-2', checked ? 'border-gold-400 bg-gold-400/5' : 'border-white/15')}>
                <input
                  type={f.type === 'radio' ? 'radio' : 'checkbox'}
                  name={f.type === 'radio' ? f.name : `${f.name}[]`}
                  value={o.value}
                  checked={checked}
                  aria-invalid={Boolean(error)}
                  onChange={(e) => {
                    if (f.type === 'radio') onChange(o.value)
                    else {
                      const set = new Set(value ? value.split('|') : [])
                      e.target.checked ? set.add(o.value) : set.delete(o.value)
                      onChange([...set].join('|'))
                    }
                  }}
                  className="size-5 accent-[#dcb35c]"
                />
                {o.label}
              </label>
            )
          })}
        </div>
        {error && (
          <span id={errId} className="error-k">
            <span aria-hidden="true">✕ </span>
            {error}
          </span>
        )}
      </fieldset>
    )
  const common = {
    id,
    name: f.name,
    value,
    'aria-invalid': Boolean(error),
    'aria-describedby': describedBy,
    'aria-required': f.required,
    autoComplete: f.autoComplete,
    className: 'field-k',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(e.target.value),
  }
  return (
    <div>
      <label htmlFor={id} className="label-k">
        {f.label}
        {req}
      </label>
      {f.hint && (
        <span id={hintId} className="hint-k">
          {f.hint}
        </span>
      )}
      {f.type === 'textarea' ? (
        <textarea {...common} rows={5} maxLength={3000} />
      ) : f.type === 'select' ? (
        <select {...common}>
          <option value="">Please choose…</option>
          {f.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...common} type={f.type} inputMode={f.type === 'tel' ? 'tel' : f.type === 'number' ? 'numeric' : undefined} />
      )}
      {error && (
        <span id={errId} className="error-k">
          <span aria-hidden="true">✕ </span>
          {error}
        </span>
      )}
    </div>
  )
}
