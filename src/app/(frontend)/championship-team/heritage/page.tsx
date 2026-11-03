import type { Metadata } from 'next'
import { getSettings, publicFind } from '@/lib/data'
import { RichText } from '@/components/RichText'
import { Breadcrumbs, EmptyState, PageHero, Section, SectionHeading, StatusBadge } from '@/components/ui'
import type { HeritageMilestone, Source } from '@/payload-types'

export const metadata: Metadata = { title: 'Heritage', description: 'The Karat Racing heritage timeline, with each milestone attributed to the entity that achieved it.', alternates: { canonical: '/championship-team/heritage' } }

const ENTITY = { karat: 'Karat Racing', kic: 'KIC Motorsport', other: 'Other entity' } as const

export default async function Heritage() {
  const [{ team }, milestones] = await Promise.all([getSettings(), publicFind<HeritageMilestone>('heritage-milestones', { sort: 'year', depth: 2 })])
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Heritage' }]} />
      <PageHero eyebrow="Team" title="Heritage" intro="Every milestone below is credited to the entity that achieved it. Results won by a predecessor organisation are never counted as Karat Racing results." />
      {team.acquisitionApproved && team.acquisitionStatement && (
        <Section labelledBy="acq">
          <SectionHeading id="acq" eyebrow="KIC Motorsport" title="From KIC Motorsport to Karat Racing" />
          <RichText data={team.acquisitionStatement} />
        </Section>
      )}
      <Section labelledBy="timeline" className={team.acquisitionApproved ? '!pt-0' : ''}>
        <SectionHeading id="timeline" eyebrow="Timeline" title="Milestones" />
        {milestones.docs.length ? (
          <ol className="relative grid gap-6 border-l-2 border-gold-500/50 pl-6">
            {milestones.docs.map((m) => (
              <li key={m.id} className="relative">
                <span aria-hidden="true" className="absolute -left-[33px] top-1.5 size-4 rounded-full border-2 border-gold-400 bg-night" />
                <p className="font-display text-2xl font-bold text-gold-200">{m.season ?? m.year}</p>
                <h3 className="font-display text-xl font-bold uppercase">{m.title}</h3>
                <StatusBadge tone={m.entity === 'karat' ? 'gold' : 'neutral'} label={`Achieved by: ${m.entity === 'other' ? m.entityName : ENTITY[m.entity]}`} className="mt-1" />
                {m.description && <p className="text-mist mt-2 max-w-2xl">{m.description}</p>}
                {(m.substantiation?.sources ?? []).filter((s): s is Source => typeof s === 'object').map((s) => (
                  <p key={s.id} className="text-mist mt-1 text-xs">
                    Source: {s.url ? <a className="underline" href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a> : s.title}
                  </p>
                ))}
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState title="Heritage timeline in preparation">We will publish the timeline after the owner has approved each milestone and its supporting evidence.</EmptyState>
        )}
      </Section>
    </>
  )
}
