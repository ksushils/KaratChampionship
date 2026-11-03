import Link from 'next/link'
import type { Metadata } from 'next'
import { publicFind } from '@/lib/data'
import { Breadcrumbs, Card, EmptyState, PageHero, Section, StatusBadge, buttonClass } from '@/components/ui'
import type { Vacancy } from '@/payload-types'

export const metadata: Metadata = { title: 'Careers', description: 'Work with Karat Racing: open roles in engineering, mechanics, operations, commercial and media.', alternates: { canonical: '/championship-team/careers' } }

const isClosed = (v: Vacancy) => Boolean(v.closed || (v.closingDate && new Date(v.closingDate).getTime() + 86_400_000 < Date.now()))

export default async function Careers({ searchParams }: { searchParams: Promise<{ discipline?: string; location?: string }> }) {
  const sp = await searchParams
  const all = (await publicFind<Vacancy>('vacancies', { sort: 'closingDate', depth: 0 })).docs
  const locations = [...new Set(all.map((v) => v.location).filter(Boolean))] as string[]
  const list = all.filter((v) => (!sp.discipline || v.discipline === sp.discipline) && (!sp.location || v.location === sp.location))
  const open = list.filter((v) => !isClosed(v))
  const closed = list.filter(isClosed)
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Careers' }]} />
      <PageHero eyebrow="Team" title="Careers" intro="We are looking for people who care about preparation, communication and doing the job properly. Open roles are listed below." />
      <Section className="!pt-8">
        <form method="get" className="mb-8 flex flex-wrap items-end gap-3" aria-label="Filter vacancies">
          <label className="grid gap-1 text-sm">
            Discipline
            <select name="discipline" defaultValue={sp.discipline ?? ''} className="field-k">
              <option value="">All</option>
              {['engineering', 'mechanical', 'operations', 'commercial', 'media', 'coaching', 'other'].map((d) => <option key={d} value={d} className="capitalize">{d}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Location
            <select name="location" defaultValue={sp.location ?? ''} className="field-k">
              <option value="">All</option>
              {locations.map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
          <button className={buttonClass('outline')}>Apply</button>
        </form>
        {open.length ? (
          <ul className="grid gap-4">
            {open.map((v) => (
              <li key={v.id}>
                <Card className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-bold uppercase">
                      <Link href={`/championship-team/careers/${v.slug}`} className="after:absolute after:inset-0 hover:text-gold-300">{v.title}</Link>
                    </h2>
                    <p className="text-mist text-sm capitalize">{[v.discipline, v.location, v.contractType].filter(Boolean).join(' · ')}</p>
                  </div>
                  {v.closingDate && <StatusBadge tone="gold" label={`Closes ${new Date(v.closingDate).toLocaleDateString('en-GB')}`} />}
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No open roles right now">There are no vacancies at the moment. Please check back later.</EmptyState>
        )}
        {closed.length > 0 && (
          <div className="mt-10">
            <h2 className="eyebrow mb-3">Recently closed</h2>
            <ul className="text-mist grid gap-1 text-sm">{closed.map((v) => <li key={v.id}><Link className="underline" href={`/championship-team/careers/${v.slug}`}>{v.title}</Link> — closed</li>)}</ul>
          </div>
        )}
      </Section>
    </>
  )
}
