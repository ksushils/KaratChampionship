import Image from 'next/image'
import type { Metadata } from 'next'
import { publicFind } from '@/lib/data'
import { mediaOf } from '@/components/cards'
import { Breadcrumbs, ButtonLink, EmptyState, PageHero, Section, SectionHeading } from '@/components/ui'
import type { Person } from '@/payload-types'

export const metadata: Metadata = { title: 'People', description: 'The leadership and technical team at Karat Racing.', alternates: { canonical: '/championship-team/people' } }

const DEPTS = [
  ['leadership', 'Leadership'],
  ['engineering', 'Engineering'],
  ['mechanics', 'Mechanics'],
  ['coaching', 'Coaching'],
  ['operations', 'Operations'],
  ['commercial', 'Commercial'],
] as const

export default async function People() {
  const people = (await publicFind<Person>('people', { sort: 'order', depth: 1 })).docs
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'People' }]} />
      <PageHero eyebrow="Team" title="People" intro="The people behind Karat Racing. We publish profiles only with each person’s approval." />
      {people.length === 0 ? (
        <Section>
          <EmptyState title="Team profiles coming soon" action={<ButtonLink href="/championship-team/careers" variant="outline">Work with us</ButtonLink>}>
            Profiles will appear here once team members have approved them.
          </EmptyState>
        </Section>
      ) : (
        DEPTS.map(([key, label]) => {
          const list = people.filter((p) => p.department === key)
          if (!list.length) return null
          return (
            <Section key={key} labelledBy={`d-${key}`} className="!py-10">
              <SectionHeading id={`d-${key}`} title={label} />
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {list.map((p) => {
                  const img = mediaOf(p.portrait)
                  return (
                    <li key={p.id} className="clip-angle edge-glow bg-navy-800/70">
                      <div className="relative aspect-[4/5] bg-navy-700">{img?.url && <Image src={img.url} alt={img.alt ?? p.name} fill sizes="25vw" className="object-cover" />}</div>
                      <div className="p-5">
                        <h3 className="font-display text-xl font-bold uppercase">{p.name}</h3>
                        <p className="text-gold-300 text-sm">{p.role}</p>
                        {p.bio && <p className="text-mist mt-2 text-sm">{p.bio}</p>}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Section>
          )
        })
      )}
    </>
  )
}
