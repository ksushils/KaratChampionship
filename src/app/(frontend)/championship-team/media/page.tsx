import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Where } from 'payload'
import { getProgrammes, publicFind } from '@/lib/data'
import { mediaOf } from '@/components/cards'
import { Breadcrumbs, Card, EmptyState, PageHero, Section, StatusBadge, buttonClass } from '@/components/ui'
import type { MediaCollection, Programme } from '@/payload-types'

export const metadata: Metadata = { title: 'Media', description: 'Karat Racing photo galleries and video collections.', alternates: { canonical: '/championship-team/media' } }

type SP = { programme?: string; season?: string; type?: string }

export default async function MediaIndex({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const programmes = await getProgrammes()
  const and: Where[] = []
  const prog = programmes.find((p) => p.slug === sp.programme)
  if (prog) and.push({ programme: { equals: prog.id } })
  if (sp.season && /^\d{4}$/.test(sp.season)) and.push({ season: { equals: Number(sp.season) } })
  const all = (await publicFind<MediaCollection>('media-collections', { where: and.length ? { and } : undefined, sort: '-createdAt', depth: 1 })).docs
  const list = all.filter((c) => (sp.type === 'video' ? (c.videos?.length ?? 0) > 0 : sp.type === 'photo' ? (c.images?.length ?? 0) > 0 : true))
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Media' }]} />
      <PageHero eyebrow="News & Media" title="Media" intro="Galleries and videos. Every image is credited and published under the usage rights recorded for it." />
      <Section className="!pt-8">
        <form method="get" className="mb-8 flex flex-wrap items-end gap-3" aria-label="Filter media">
          <label className="grid gap-1 text-sm">
            Programme
            <select name="programme" defaultValue={sp.programme ?? ''} className="field-k">
              <option value="">All</option>
              {programmes.map((p) => <option key={p.id} value={p.slug!}>{p.title}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Season
            <input name="season" inputMode="numeric" pattern="\d{4}" defaultValue={sp.season} className="field-k w-28" />
          </label>
          <label className="grid gap-1 text-sm">
            Media type
            <select name="type" defaultValue={sp.type ?? ''} className="field-k">
              <option value="">All</option>
              <option value="photo">Photos</option>
              <option value="video">Video</option>
            </select>
          </label>
          <button className={buttonClass('outline')}>Apply</button>
        </form>
        {list.length ? (
          <ul className="grid gap-5 md:grid-cols-3">
            {list.map((c) => {
              const cover = mediaOf(c.images?.[0])
              return (
                <li key={c.id}>
                  <Card as="article" className="p-0">
                    <div className="relative aspect-[4/3] bg-navy-700">{cover?.url && <Image src={cover.url} alt="" fill sizes="33vw" className="object-cover" />}</div>
                    <div className="p-5">
                      <h2 className="font-display text-xl font-bold uppercase">
                        <Link href={`/championship-team/media/${c.slug}`} className="after:absolute after:inset-0">
                          {c.title}
                        </Link>
                      </h2>
                      <p className="text-mist text-sm">
                        {[c.images?.length && `${c.images.length} photos`, c.videos?.length && `${c.videos.length} videos`, (c.programme as Programme)?.title].filter(Boolean).join(' · ')}
                      </p>
                      {c.isDemo && <StatusBadge tone="warn" label="Demo" className="mt-2" />}
                    </div>
                  </Card>
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState title="No galleries yet">Galleries are added once we hold the rights to publish the images.</EmptyState>
        )}
      </Section>
    </>
  )
}
