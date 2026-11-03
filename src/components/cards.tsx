import Image from 'next/image'
import Link from 'next/link'
import type { Article, Driver, Event, Media, Programme } from '@/payload-types'
import { EVENT_STATUS_LABEL, PROGRAMME_STATUS_LABEL } from '@/lib/status'
import { formatDateRange } from '@/lib/time'
import { Card, StatusBadge } from './ui'

export const mediaOf = (m: unknown): Media | null => (m && typeof m === 'object' && 'url' in (m as object) ? (m as Media) : null)
export const titleOf = (r: unknown, key = 'title'): string | null => (r && typeof r === 'object' ? ((r as Record<string, string>)[key] ?? null) : null)

const PROGRAMME_IMAGE: Record<string, string> = {
  'italian-f4': '/brand/car-front-light.jpg',
  gb4: '/brand/car-rear-light.jpg',
  'indian-f4': '/brand/car-top-light.jpg',
  'formula-x-f2000': '/brand/car-side-light.jpg',
}

export function ProgrammeCard({ p, headingLevel = 'h3' }: { p: Programme; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel
  const img = mediaOf(p.heroImage)?.url ?? PROGRAMME_IMAGE[p.slug ?? ''] ?? '/brand/car-side-dark.jpg'
  const champ = typeof p.championship === 'object' ? p.championship : null
  return (
    <Card as="article" className="group flex h-full flex-col p-0">
      <div className="relative aspect-[16/9] overflow-hidden bg-paper">
        <Image src={img} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <StatusBadge status={p.status} label={PROGRAMME_STATUS_LABEL[p.status] ?? p.status} className="self-start" />
        <H className="mt-3 font-display text-2xl font-bold uppercase">
          <Link href={`/championship-team/programmes/${p.slug}`} className="after:absolute after:inset-0 hover:text-gold-300">
            {p.title}
          </Link>
        </H>
        {champ?.organiser && <p className="text-mist mt-1 text-sm">{champ.organiser}</p>}
        {p.shortDescription && <p className="mt-3 text-[0.95rem]">{p.shortDescription}</p>}
        <span className="mt-auto pt-5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-gold-300" aria-hidden="true">
          Explore programme →
        </span>
      </div>
    </Card>
  )
}

export function EventRow({ e, showProgramme = true }: { e: Event; showProgramme?: boolean }) {
  const circuit = typeof e.circuit === 'object' ? e.circuit : null
  const programme = typeof e.programme === 'object' ? e.programme : null
  const struck = e.status === 'cancelled' || e.status === 'postponed'
  return (
    <li className="relative grid gap-3 border-b border-white/10 py-5 md:grid-cols-[11rem_1fr_auto] md:items-center">
      <div className="font-display text-lg font-semibold tracking-wide text-gold-200">
        <time dateTime={e.startDate}>{formatDateRange(e.startDate, e.endDate)}</time>
      </div>
      <div>
        <p className="font-display text-xl font-bold uppercase">
          <Link href={`/championship-team/events/${e.slug}`} className={`after:absolute after:inset-0 hover:text-gold-300 ${struck ? 'line-through decoration-2' : ''}`}>
            {e.title}
          </Link>
        </p>
        <p className="text-mist text-sm">
          {[showProgramme && programme?.title, e.round && `Round ${e.round}`, circuit && `${circuit.name}, ${circuit.country}`].filter(Boolean).join(' · ')}
        </p>
        {e.isDemo && <p className="mt-1 text-xs text-warn">Demonstration fixture — fictional</p>}
      </div>
      <StatusBadge status={e.status} label={EVENT_STATUS_LABEL[e.status] ?? e.status} className="justify-self-start md:justify-self-end" />
    </li>
  )
}

export function DriverCard({ d, number, programme }: { d: Driver; number?: string | null; programme?: string | null }) {
  const portrait = mediaOf(d.portrait)
  return (
    <Card as="article" className="group flex h-full flex-col p-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-navy-700">
        {portrait?.url ? (
          <Image src={portrait.url} alt={portrait.alt ?? ''} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
        ) : (
          <div aria-hidden="true" className="flex h-full items-center justify-center">
            <Image src="/brand/karat-k.png" alt="" width={120} height={114} className="opacity-25" />
          </div>
        )}
        {number && (
          <span className="absolute right-3 top-3 font-display text-4xl font-extrabold text-gold-metal" aria-label={`Car number ${number}`}>
            {number}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-bold uppercase">
          <Link href={`/championship-team/drivers/${d.slug}`} className="after:absolute after:inset-0 hover:text-gold-300">
            {d.name}
          </Link>
        </h3>
        <p className="text-mist text-sm">{[d.nationality, programme].filter(Boolean).join(' · ')}</p>
      </div>
    </Card>
  )
}

const TYPE_LABEL: Record<string, string> = { announcement: 'Announcement', preview: 'Preview', report: 'Race report', interview: 'Interview', feature: 'Feature', partnership: 'Partnership', 'team-update': 'Team update' }

export function ArticleCard({ a }: { a: Article }) {
  const hero = mediaOf(a.heroImage)
  const progs = (a.programmes ?? []).filter((p): p is Programme => typeof p === 'object')
  return (
    <Card as="article" className="group flex h-full flex-col p-0">
      <div className="relative aspect-[16/9] overflow-hidden bg-navy-700">
        <Image src={hero?.url ?? '/brand/car-aerial-dark.jpg'} alt={hero?.alt ?? ''} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="neutral" label={TYPE_LABEL[a.type] ?? a.type} />
          {progs.slice(0, 2).map((p) => (
            <StatusBadge key={p.id} tone="blue" label={p.title} />
          ))}
        </div>
        <h3 className="mt-3 font-display text-xl font-bold uppercase leading-tight">
          <Link href={`/championship-team/news/${a.slug}`} className="after:absolute after:inset-0 hover:text-gold-300">
            {a.title}
          </Link>
        </h3>
        {a.standfirst && <p className="text-mist mt-2 line-clamp-3 text-sm">{a.standfirst}</p>}
        {a.publishedAt && (
          <p className="text-mist mt-auto pt-4 text-xs">
            <time dateTime={a.publishedAt}>{new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(a.publishedAt))}</time>
          </p>
        )}
      </div>
    </Card>
  )
}
