import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { randomUUID } from 'node:crypto'
import { getSettings, publicFindOne } from '@/lib/data'
import { ApplicationForm } from '@/components/ApplicationForm'
import { Breadcrumbs, ButtonLink, JsonLd, Notice, Section, StatusBadge } from '@/components/ui'
import type { Vacancy } from '@/payload-types'

type P = { params: Promise<{ vacancy: string }> }
const get = (slug: string) => publicFindOne<Vacancy>('vacancies', { slug: { equals: slug } }, 0)
const closedNow = (v: Vacancy) => Boolean(v.closed || (v.closingDate && new Date(v.closingDate).getTime() + 86_400_000 < Date.now()))

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const v = await get((await params).vacancy)
  return v ? { title: v.title, description: v.summary ?? undefined, alternates: { canonical: `/championship-team/careers/${v.slug}` } } : { title: 'Vacancy not found' }
}

export default async function VacancyPage({ params }: P) {
  const v = await get((await params).vacancy)
  if (!v) notFound()
  const { flags } = await getSettings()
  const closed = closedNow(v)
  const internshipBlocked = v.contractType === 'internship' && !v.internshipEligibility
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Careers', href: '/championship-team/careers' }, { label: v.title }]} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone={closed ? 'danger' : 'success'} label={closed ? 'Applications closed' : 'Open for applications'} />
              {v.isDemo && <StatusBadge tone="warn" label="Demo fixture" />}
            </div>
            <h1 className="mt-3 font-display text-[length:var(--text-display-lg)] font-bold uppercase">{v.title}</h1>
            <p className="text-mist mt-2 capitalize">{[v.discipline, v.location, v.contractType].filter(Boolean).join(' · ')}{v.closingDate && ` · closing ${new Date(v.closingDate).toLocaleDateString('en-GB')}`}</p>
            {v.summary && <p className="mt-6 text-lg">{v.summary}</p>}
            {v.responsibilities?.length ? (<><h2 className="mt-8 font-display text-xl font-bold uppercase">Responsibilities</h2><ul className="prose-k">{v.responsibilities.map((r) => <li key={r.id}>{r.item}</li>)}</ul></>) : null}
            {v.requirements?.length ? (<><h2 className="mt-8 font-display text-xl font-bold uppercase">Requirements</h2><ul className="prose-k">{v.requirements.map((r) => <li key={r.id}>{r.item}</li>)}</ul></>) : null}
            {v.internshipEligibility && <div className="mt-6"><Notice title="Eligibility">{v.internshipEligibility}</Notice></div>}
          </div>
          <div>
            {closed ? (
              <Notice tone="warn" title="This role is closed">We are no longer accepting applications for this vacancy.</Notice>
            ) : internshipBlocked ? (
              <Notice tone="warn">Applications will open once the eligibility criteria for this internship have been published.</Notice>
            ) : v.applicationMode === 'external' && v.externalUrl ? (
              <ButtonLink href={v.externalUrl}>Apply on our recruitment partner’s site</ButtonLink>
            ) : (
              <>
                <h2 className="mb-4 font-display text-2xl font-bold uppercase">Apply</h2>
                <ApplicationForm vacancyId={v.id} initialKey={randomUUID()} cvEnabled={Boolean(flags.cvUpload)} />
              </>
            )}
          </div>
        </div>
      </Section>
      {!closed && !v.isDemo && (
        <JsonLd data={{ '@context': 'https://schema.org', '@type': 'JobPosting', title: v.title, description: v.summary ?? v.title, datePosted: v.createdAt, validThrough: v.closingDate ?? undefined, employmentType: v.contractType?.toUpperCase().replace('-', '_'), hiringOrganization: { '@type': 'Organization', name: 'Karat Racing' }, jobLocation: v.location ? { '@type': 'Place', address: v.location } : undefined }} />
      )}
    </>
  )
}
