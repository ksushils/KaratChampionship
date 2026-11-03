import type { ResultSet } from '@/payload-types'
import { StatusBadge, Val } from './ui'

/** Accessible classification table (RES-02..08). Scrolls inside its own labelled region on small screens. */
export function ResultsTable({ rs, captionId }: { rs: ResultSet; captionId?: string }) {
  const id = captionId ?? `rs-${rs.id}`
  const sourceUrl = rs.source?.url
  return (
    <div className="mb-10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 id={id} className="font-display text-xl font-bold uppercase">
          {rs.label}
        </h3>
        <StatusBadge status={rs.state} label={rs.state === 'final' ? 'Final' : 'Provisional'} tone={rs.state === 'final' ? 'success' : 'warn'} />
        {rs.classification !== 'overall' && <StatusBadge tone="blue" label={`${rs.classification} classification`} />}
        {rs.attribution === 'kic' && <StatusBadge tone="neutral" label="KIC Motorsport (historical)" />}
        {rs.isDemo && <StatusBadge tone="warn" label="Demo data" />}
      </div>
      <div role="region" aria-labelledby={id} tabIndex={0} className="overflow-x-auto rounded-card border border-white/10">
        <table className="table-k min-w-[42rem]">
          <caption className="sr-only">
            {rs.label}. {rs.state === 'final' ? 'Final' : 'Provisional'} classification. Karat Racing entries are highlighted and marked “Karat”.
          </caption>
          <thead>
            <tr>
              <th scope="col">Pos</th>
              <th scope="col">No.</th>
              <th scope="col">Driver</th>
              <th scope="col">Entrant</th>
              <th scope="col">Laps</th>
              <th scope="col">Time</th>
              <th scope="col">Gap</th>
              <th scope="col">Pts</th>
            </tr>
          </thead>
          <tbody>
            {(rs.entries ?? []).map((e) => (
              <tr key={e.id} className={e.isKarat ? 'is-karat' : undefined}>
                <td>{e.status && e.status !== 'classified' ? <abbr title={statusTitle(e.status)}>{e.status}</abbr> : <Val v={e.position} />}</td>
                <td>
                  <Val v={e.carNumber} />
                </td>
                <th scope="row" className="!font-sans !text-[0.92rem] !normal-case !tracking-normal !text-white font-semibold">
                  {e.driverName}
                  {e.isKarat && <span className="ml-2 rounded-sm bg-gold-400 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase text-night">Karat</span>}
                </th>
                <td>
                  <Val v={e.entrant} />
                </td>
                <td>
                  <Val v={e.laps} />
                </td>
                <td>
                  <Val v={e.time} />
                </td>
                <td>
                  <Val v={e.gap} />
                </td>
                <td>
                  <Val v={e.points} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rs.penaltyNotes && <p className="text-mist mt-2 text-sm">Notes: {rs.penaltyNotes}</p>}
      <p className="text-mist mt-2 text-xs">
        Source:{' '}
        {sourceUrl ? (
          <a href={sourceUrl} className="text-royal-300 underline" rel="noopener noreferrer" target="_blank">
            official classification
          </a>
        ) : (
          'official classification document'
        )}
        {rs.source?.publishedAt && ` · published ${new Date(rs.source.publishedAt).toLocaleDateString('en-GB', { timeZone: 'UTC' })}`} · last updated {new Date(rs.updatedAt).toLocaleString('en-GB', { timeZone: 'UTC' })} UTC
      </p>
    </div>
  )
}

const statusTitle = (s: string) => ({ DNS: 'Did not start', DNF: 'Did not finish', DSQ: 'Disqualified', NC: 'Not classified', DNQ: 'Did not qualify', EXC: 'Excluded' })[s] ?? s
