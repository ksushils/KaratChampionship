import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { publicFindOne } from '@/lib/data'
import { mediaOf } from '@/components/cards'
import { ConsentEmbed } from '@/components/ConsentEmbed'
import { Gallery } from '@/components/Gallery'
import { Breadcrumbs, PageHero, Section } from '@/components/ui'
import type { MediaCollection } from '@/payload-types'

type P = { params: Promise<{ collection: string }> }
const get = (slug: string) => publicFindOne<MediaCollection>('media-collections', { slug: { equals: slug } }, 2)

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const c = await get((await params).collection)
  return c ? { title: c.title, description: c.description ?? undefined, alternates: { canonical: `/championship-team/media/${c.slug}` } } : { title: 'Gallery not found' }
}

export default async function CollectionPage({ params }: P) {
  const c = await get((await params).collection)
  if (!c) notFound()
  // Media access control already drops images whose rights expired or were never approved (MEDIA-07).
  const items = (c.images ?? []).map(mediaOf).filter((m): m is NonNullable<typeof m> => Boolean(m?.url)).map((m) => ({ url: m.url!, alt: m.alt, caption: m.caption, credit: m.credit, width: m.width, height: m.height }))
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Media', href: '/championship-team/media' }, { label: c.title }]} />
      <PageHero eyebrow="Gallery" title={c.title} intro={c.description} />
      <Section className="!pt-8">
        {items.length > 0 && <Gallery items={items} label={`${c.title} photos`} />}
        {c.videos?.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {c.videos.map((v) => (
              <div key={v.id}>
                <ConsentEmbed url={v.url} title={v.title} />
                <p className="mt-2 font-semibold">{v.title}</p>
                {!v.captionsAvailable && <p className="text-mist text-xs">Captions may not be available on this video.</p>}
              </div>
            ))}
          </div>
        ) : null}
        {!items.length && !c.videos?.length && <p className="text-mist">This collection has no publicly available items at the moment.</p>}
      </Section>
    </>
  )
}
