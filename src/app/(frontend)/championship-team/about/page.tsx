import Image from 'next/image'
import type { Metadata } from 'next'
import { getSettings } from '@/lib/data'
import { RichText } from '@/components/RichText'
import { Breadcrumbs, ButtonLink, Card, PageHero, Section, SectionHeading } from '@/components/ui'

export const metadata: Metadata = { title: 'About the team', description: 'About Karat Racing’s Championship Team: purpose, operating approach and values.', alternates: { canonical: '/championship-team/about' } }

export default async function About() {
  const { team } = await getSettings()
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'About' }]} />
      <PageHero eyebrow="Team" title="About Karat Racing" intro="Karat Racing runs single-seater race programmes for drivers developing their careers. The aim is simple: careful preparation, clear engineering and honest communication with drivers and families." />
      <Section labelledBy="story">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div>
            <SectionHeading id="story" eyebrow="Our story" title="Purpose and ambition" />
            {team.storyApproved && team.story ? (
              <RichText data={team.story} />
            ) : (
              <div className="prose-k text-mist">
                <p>Karat Racing is building a team for junior single-seater racing. It sits alongside a separate testing and academy business, and a project to develop a championship in India.</p>
                <p>On the team side, we plan to race in Italian F4, GB4, Indian F4 and Formula X / F2000. Each programme shows its participation status on its own page, and we publish only confirmed entries as confirmed.</p>
              </div>
            )}
          </div>
          <figure>
            <Image src="/brand/car-aerial-dark.jpg" alt="Karat Racing livery concept seen from above" width={940} height={300} className="h-auto w-full rounded-card" />
            <figcaption className="text-mist mt-2 text-xs">Livery concept, aerial view.</figcaption>
          </figure>
        </div>
      </Section>
      {(team.workingMethods?.length ?? 0) > 0 && (
        <Section paper labelledBy="methods">
          <SectionHeading id="methods" eyebrow="Working methods" title="How a Karat weekend works" />
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {team.workingMethods!.map((w, i) => (
              <li key={w.id} className="rounded-card border border-navy-800/15 bg-white/70 p-5">
                <span className="font-display text-4xl font-extrabold text-gold-500">0{i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-bold uppercase">{w.title}</h3>
                <p className="text-mist mt-1 text-sm">{w.body}</p>
              </li>
            ))}
          </ol>
        </Section>
      )}
      {team.valuesApproved && (team.values?.length ?? 0) > 0 && (
        <Section labelledBy="values">
          <SectionHeading id="values" eyebrow="Values" title="What we stand for" />
          <ul className="grid gap-5 md:grid-cols-2">
            {team.values!.map((v) => (
              <li key={v.id}>
                <Card>
                  <h3 className="font-display text-xl font-bold uppercase text-gold-200">{v.title}</h3>
                  <p className="text-mist mt-2">{v.body}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      )}
      <Section>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/championship-team/people">Meet the people</ButtonLink>
          <ButtonLink href="/championship-team/facilities" variant="outline">
            Facilities
          </ButtonLink>
          <ButtonLink href="/championship-team/heritage" variant="outline">
            Heritage
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
