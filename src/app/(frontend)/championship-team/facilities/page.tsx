import Image from 'next/image'
import type { Metadata } from 'next'
import { publicFind } from '@/lib/data'
import { mediaOf } from '@/components/cards'
import { Breadcrumbs, Card, EmptyState, PageHero, Section, StatusBadge } from '@/components/ui'
import type { Facility } from '@/payload-types'

export const metadata: Metadata = { title: 'Facilities', description: 'Karat Racing facilities and resources, with owned and partner-provided facilities clearly identified.', alternates: { canonical: '/championship-team/facilities' } }

const OWN = { owned: 'Owned by Karat Racing', operated: 'Operated by Karat Racing', partner: 'Partner-provided' } as const

export default async function Facilities() {
  const items = (await publicFind<Facility>('facilities', { depth: 1 })).docs
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Facilities' }]} />
      <PageHero eyebrow="Team" title="Facilities" intro="We list only facilities and resources that actually exist. Partner-provided facilities are labelled as such." />
      <Section>
        {items.length ? (
          <ul className="grid gap-5 md:grid-cols-2">
            {items.map((f) => {
              const img = mediaOf(f.image)
              return (
                <li key={f.id}>
                  <Card className="h-full p-0">
                    {img?.url && (
                      <div className="relative aspect-[16/9]">
                        <Image src={img.url} alt={img.alt ?? ''} fill sizes="50vw" className="object-cover" />
                      </div>
                    )}
                    <div className="p-6">
                      <StatusBadge tone={f.ownership === 'partner' ? 'blue' : 'gold'} label={f.ownership === 'partner' && f.partnerName ? `Provided by ${f.partnerName}` : OWN[f.ownership]} />
                      <h2 className="mt-3 font-display text-2xl font-bold uppercase">{f.name}</h2>
                      {f.location && <p className="text-mist text-sm">{f.location}</p>}
                      {f.description && <p className="mt-3">{f.description}</p>}
                      {f.capabilities?.length ? <p className="text-mist mt-3 text-sm">Capabilities: {f.capabilities.join(', ')}</p> : null}
                    </div>
                  </Card>
                </li>
              )
            })}
          </ul>
        ) : (
          <EmptyState title="Facility details to follow">We will add workshop and resource details once their locations and ownership arrangements are confirmed.</EmptyState>
        )}
      </Section>
    </>
  )
}
