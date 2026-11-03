import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticles, publicFind, publicFindOne } from '@/lib/data'
import { isCurrentPartnership } from '@/lib/partners'
import { ArticleCard, mediaOf } from '@/components/cards'
import { Breadcrumbs, ExternalLink, Section, SectionHeading, StatusBadge } from '@/components/ui'
import type { Partner, Partnership } from '@/payload-types'

type P = { params: Promise<{ partner: string }> }
const get = (slug: string) => publicFindOne<Partner>('partners', { slug: { equals: slug } }, 1)

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await get((await params).partner)
  return p ? { title: p.name, description: p.description ?? undefined, alternates: { canonical: `/championship-team/partners/${p.slug}` } } : { title: 'Partner not found' }
}

export default async function PartnerPage({ params }: P) {
  const p = await get((await params).partner)
  if (!p) notFound()
  const ships = (await publicFind<Partnership>('partnerships', { where: { partner: { equals: p.id } }, depth: 1 })).docs
  const current = ships.some((s) => isCurrentPartnership(s))
  const articles = await getArticles({ where: { partners: { contains: p.id } }, limit: 3 })
  const logo = mediaOf(p.logo)
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Partners', href: '/championship-team/partners' }, { label: p.name }]} />
      <Section>
        <div className="grid gap-8 md:grid-cols-[16rem_1fr] md:items-center">
          <div className="flex aspect-square items-center justify-center rounded-card bg-white p-6">{logo?.url ? <Image src={logo.url} alt={`${p.name} logo`} width={240} height={240} className="h-auto w-full object-contain" /> : <span className="font-display text-2xl font-bold text-navy-800">{p.name}</span>}</div>
          <div>
            <StatusBadge tone={current ? 'success' : 'neutral'} label={current ? 'Current partner' : 'Past partner'} />
            {p.isDemo && <StatusBadge tone="warn" label="Demo fixture" className="ml-2" />}
            <h1 className="mt-3 font-display text-[length:var(--text-display-lg)] font-bold uppercase">{p.name}</h1>
            {p.description && <p className="text-mist mt-3 max-w-2xl text-lg">{p.description}</p>}
            {p.website && <p className="mt-4"><ExternalLink href={p.website}>Visit website</ExternalLink></p>}
          </div>
        </div>
      </Section>
      {articles.docs.length > 0 && (
        <Section className="!pt-0" labelledBy="pn">
          <SectionHeading id="pn" title="Related stories" />
          <ul className="grid gap-5 md:grid-cols-3">{articles.docs.map((a) => <li key={a.id}><ArticleCard a={a} /></li>)}</ul>
        </Section>
      )}
    </>
  )
}
