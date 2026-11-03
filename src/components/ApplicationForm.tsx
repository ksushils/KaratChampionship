'use client'
import { useActionState, useEffect, useRef } from 'react'
import { applicationAction, type ApplicationResult } from '@/app/(frontend)/actions'
import { track } from './analytics'
import { buttonClass } from './ui'

export function ApplicationForm({ vacancyId, initialKey, cvEnabled }: { vacancyId: number; initialKey: string; cvEnabled: boolean }) {
  const [state, action, pending] = useActionState<ApplicationResult | null, FormData>(applicationAction, null)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (state?.ok) track('careers_application_submitted', {})
    if (state) ref.current?.focus()
  }, [state])
  if (state?.ok)
    return (
      <div ref={ref} tabIndex={-1} role="status" className="rounded-card border border-success/50 bg-success/5 p-6">
        <h2 className="font-display text-2xl font-bold uppercase">Application received</h2>
        <p className="mt-2">
          Reference: <strong className="text-gold-200" data-testid="application-reference">{state.reference}</strong>
        </p>
        <p className="text-mist mt-2 text-sm">Your application has been stored securely. Only the recruitment team can see it.</p>
      </div>
    )
  const err = state && !state.ok ? state.errors : {}
  const F = ({ name, label, type = 'text', required, auto }: { name: string; label: string; type?: string; required?: boolean; auto?: string }) => (
    <div>
      <label htmlFor={`a-${name}`} className="label-k">
        {label}
        {required && <span aria-hidden="true" className="text-gold-300"> *</span>}
      </label>
      <input id={`a-${name}`} name={name} type={type} autoComplete={auto} aria-required={required} aria-invalid={Boolean(err[name])} aria-describedby={err[name] ? `a-${name}-e` : undefined} className="field-k" />
      {err[name] && <span id={`a-${name}-e`} className="error-k">✕ {err[name]}</span>}
    </div>
  )
  return (
    <form action={action} className="grid gap-5" noValidate>
      {state && !state.ok && (
        <div ref={ref} tabIndex={-1} role="alert" className="rounded-card border-2 border-danger/70 bg-danger/10 p-4">
          <p className="font-semibold">{state.message}</p>
          <ul className="mt-1 list-disc pl-5 text-sm">{Object.entries(err).map(([k, m]) => <li key={k}><a className="underline" href={`#a-${k}`}>{m}</a></li>)}</ul>
        </div>
      )}
      <input type="hidden" name="vacancy" value={vacancyId} />
      <input type="hidden" name="idempotencyKey" value={initialKey} />
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <F name="name" label="Full name" required auto="name" />
      <F name="email" label="Email" type="email" required auto="email" />
      <F name="phone" label="Telephone (optional)" type="tel" auto="tel" />
      <F name="country" label="Country of residence (optional)" auto="country-name" />
      <F name="profileLink" label="LinkedIn or portfolio link (optional)" type="url" />
      {cvEnabled && (
        <div>
          <label htmlFor="a-cv" className="label-k">CV (optional)</label>
          <span className="hint-k" id="a-cv-h">PDF or Word (.docx), up to 5 MB. Stored privately.</span>
          <input id="a-cv" name="cv" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-describedby="a-cv-h" aria-invalid={Boolean(err.cv)} className="field-k" />
          {err.cv && <span className="error-k">✕ {err.cv}</span>}
        </div>
      )}
      <div>
        <label htmlFor="a-coverNote" className="label-k">Why this role? (optional)</label>
        <textarea id="a-coverNote" name="coverNote" rows={5} maxLength={4000} className="field-k" />
      </div>
      <label className="flex min-h-11 items-start gap-3">
        <input id="a-privacyAcknowledged" type="checkbox" name="privacyAcknowledged" aria-invalid={Boolean(err.privacyAcknowledged)} className="mt-1 size-5 accent-[#dcb35c]" />
        <span>
          I have read the <a href="/privacy" className="text-royal-300 underline">privacy notice</a>. I understand my application will be kept for the stated retention period.
          <span aria-hidden="true" className="text-gold-300"> *</span>
        </span>
      </label>
      {err.privacyAcknowledged && <span className="error-k">✕ {err.privacyAcknowledged}</span>}
      <button className={buttonClass('gold', 'justify-self-start')} disabled={pending}>
        {pending ? 'Sending…' : 'Submit application'}
      </button>
    </form>
  )
}
