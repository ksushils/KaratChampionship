import type { Metadata } from 'next'
import { publicFind } from '@/lib/data'
import { DriverCard } from '@/components/cards'
import { Breadcrumbs, EmptyState, PageHero, Section, SectionHeading } from '@/components/ui'
import type { Driver } from '@/payload-types'

export const metadata: Metadata = { title: 'Alumni', description: 'Former Karat Racing drivers, listed separately from drivers associated with the predecessor team.', alternates: { canonical: '/championship-team/alumni' } }

export default async function Alumni() {
  const drivers = (await publicFind<Driver>('drivers', { where: { alumni: { in: ['karat', 'kic'] } }, sort: 'name', depth: 1 })).docs
  const karat = drivers.filter((d) => d.alumni === 'karat')
  const kic = drivers.filter((d) => d.alumni === 'kic')
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Alumni' }]} />
      <PageHero eyebrow="Drivers" title="Alumni" intro="Former Karat Racing drivers. Drivers who raced for the predecessor team, KIC Motorsport, are listed separately and are not counted as Karat alumni." />
      <Section labelledBy="karat-alumni">
        <SectionHeading id="karat-alumni" title="Karat Racing alumni" />
        {karat.length ? (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">{karat.map((d) => <li key={d.id}><DriverCard d={d} /></li>)}</ul>
        ) : (
          <EmptyState title="No alumni yet">Former Karat Racing drivers will be listed here.</EmptyState>
        )}
      </Section>
      {kic.length > 0 && (
        <Section labelledBy="kic-alumni" className="!pt-0">
          <SectionHeading id="kic-alumni" title="KIC Motorsport associations" intro="Drivers who raced with KIC Motorsport. They are shown for heritage only, with approval." />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">{kic.map((d) => <li key={d.id}><DriverCard d={d} /></li>)}</ul>
        </Section>
      )}
    </>
  )
}
