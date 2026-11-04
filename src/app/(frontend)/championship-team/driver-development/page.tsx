import type { Metadata } from 'next'
import { getSettings } from '@/lib/data'
import { TESTING_ENQUIRE_URL } from '@/lib/nav'
import { Breadcrumbs, ButtonLink, Card, Notice, PageHero, Section, SectionHeading } from '@/components/ui'

export const metadata: Metadata = { title: 'Driver development', description: 'How Karat Racing supports driver development: karting transition, engineering collaboration, data review and family information.', alternates: { canonical: '/championship-team/driver-development' } }

export default async function Development() {
  const { team } = await getSettings()
  const blocks = [
    { id: 'karting', t: 'From karting to cars', b: 'Single-seaters bring new demands: downforce, gearboxes, set-up changes and a different relationship with tyres and braking. We introduce these in a structured order and set each test day around a few clear objectives.' },
    { id: 'engineering', t: 'Working with engineers', b: 'Drivers learn to describe car behaviour precisely and to turn their feedback into changes they can test. Briefings and debriefs follow the same structure every time, so progress can be measured.' },
    { id: 'data', t: 'Learning through data', b: 'After each run we compare data and on-board video, explain what it shows and agree actions for next time. Detailed telemetry stays within the team and the driver’s camp.' },
    { id: 'progression', t: 'Progression', b: 'Junior single-seater careers can move between categories such as F4, GB4 and regional series. We talk through realistic options for each driver. Progression depends on results, funding and championship rules, and cannot be guaranteed.' },
  ]
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Driver development' }]} />
      <PageHero eyebrow="Development" title="Driver development" intro="What we focus on when helping a driver improve, written plainly. It describes how we work, not promised outcomes.">
        <ButtonLink href="/championship-team/race-with-us">Discuss your race programme</ButtonLink>
        <ButtonLink href={TESTING_ENQUIRE_URL} variant="outline" data-track="testing_handoff_clicked">
          Standalone testing enquiry
        </ButtonLink>
      </PageHero>
      <Section>
        <ul className="grid gap-5 md:grid-cols-2">
          {blocks.map((x) => (
            <li key={x.id}>
              <Card className="h-full">
                <h2 className="font-display text-2xl font-bold uppercase text-gold-200">{x.t}</h2>
                <p className="text-mist mt-3">{x.b}</p>
              </Card>
            </li>
          ))}
          {team.simulatorStatement && (
            <li>
              <Card className="h-full">
                <h2 className="font-display text-2xl font-bold uppercase text-gold-200">Simulator</h2>
                <p className="text-mist mt-3">{team.simulatorStatement}</p>
              </Card>
            </li>
          )}
          {team.coachingStatement && (
            <li>
              <Card className="h-full">
                <h2 className="font-display text-2xl font-bold uppercase text-gold-200">Coaching</h2>
                <p className="text-mist mt-3">{team.coachingStatement}</p>
              </Card>
            </li>
          )}
          {team.humanPerformanceStatement && (
            <li>
              <Card className="h-full">
                <h2 className="font-display text-2xl font-bold uppercase text-gold-200">Human performance</h2>
                <p className="text-mist mt-3">{team.humanPerformanceStatement}</p>
              </Card>
            </li>
          )}
        </ul>
      </Section>
      <Section paper labelledBy="families">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <SectionHeading id="families" eyebrow="For families" title="What to expect" />
            <ol className="grid gap-4">
              {[
                ['Conversation', 'A confidential discussion about the driver, their experience and your goals.'],
                ['Plan', 'A suggested route: testing, a championship, or both, with an honest view of the costs and commitments.'],
                ['Agreement', 'A written proposal setting out what is included and what is not.'],
                ['Season', 'Planned communication with the driver and family or manager throughout the year.'],
              ].map(([t, b], i) => (
                <li key={t} className="flex gap-4">
                  <span className="font-display text-3xl font-extrabold text-gold-500">{i + 1}</span>
                  <span>
                    <span className="block font-semibold">{t}</span>
                    <span className="text-mist">{b}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="grid content-start gap-4">
            <h2 className="font-display text-2xl font-bold uppercase">International drivers</h2>
            <p className="text-mist">We are happy to discuss the logistics of racing abroad, including travel planning. Visas and immigration decisions are made by the authorities, so we cannot guarantee them.</p>
            <Notice tone="warn" title="Safety">
              Motorsport is dangerous. We follow championship safety rules and our own procedures, but no form of racing or testing is risk-free.
            </Notice>
          </div>
        </div>
      </Section>
    </>
  )
}
