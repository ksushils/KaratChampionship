import type { Metadata } from 'next'
import { getStandings } from '@/lib/data'
import { Breadcrumbs, EmptyState, PageHero, Section, StatusBadge, Val } from '@/components/ui'

export const metadata: Metadata = { title: 'Standings', description: 'Official championship standings involving Karat Racing drivers.', alternates: { canonical: '/championship-team/standings' } }

export default async function Standings() {
  const list = (await getStandings({ attribution: { equals: 'karat' } })).sort((a, b) => Number(a.calculated) - Number(b.calculated))
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Standings' }]} />
      <PageHero eyebrow="Race Centre" title="Standings" intro="Official driver and team standings. Where we have calculated a total ourselves, it is labelled. The official classification always takes precedence." />
      <Section className="!pt-8">
        {list.length === 0 && <EmptyState title="No standings published">Standings appear once official classifications have been verified.</EmptyState>}
        {list.map((s) => (
          <div key={s.id} className="mb-10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h2 id={`st-${s.id}`} className="font-display text-xl font-bold uppercase">{s.label}</h2>
              <StatusBadge tone={s.state === 'final' ? 'success' : 'warn'} label={s.state === 'final' ? 'Final' : 'Provisional'} />
              {s.calculated && <StatusBadge tone="neutral" label="Website calculation — not official" />}
              {s.isDemo && <StatusBadge tone="warn" label="Demo data" />}
            </div>
            <div className="overflow-x-auto rounded-card border border-white/10" role="region" aria-labelledby={`st-${s.id}`} tabIndex={0}>
              <table className="table-k">
                <caption className="sr-only">{s.label} — Karat Racing entries highlighted</caption>
                <thead>
                  <tr>
                    <th scope="col">Pos</th>
                    <th scope="col">{s.type === 'team' ? 'Team' : 'Driver'}</th>
                    <th scope="col">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {(s.entries ?? []).map((e) => (
                    <tr key={e.id} className={e.isKarat ? 'is-karat' : undefined}>
                      <td><Val v={e.position} /></td>
                      <th scope="row" className="!font-sans !text-[0.92rem] !normal-case !tracking-normal !text-white">
                        {e.name}
                        {e.isKarat && <span className="ml-2 rounded-sm bg-gold-400 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase text-night">Karat</span>}
                      </th>
                      <td><Val v={e.points} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-mist mt-2 text-xs">
              Source: {s.source?.url ? <a href={s.source.url} className="underline" target="_blank" rel="noopener noreferrer">official standings</a> : 'official standings'} · updated {new Date(s.updatedAt).toLocaleDateString('en-GB')}
            </p>
          </div>
        ))}
      </Section>
    </>
  )
}
