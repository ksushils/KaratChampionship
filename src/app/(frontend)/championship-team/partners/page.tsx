import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getCurrentPartnerships, publicFind } from '@/lib/data'
import { isCurrentPartnership } from '@/lib/partners'
import { mediaOf } from '@/components/cards'
import { Breadcrumbs, ButtonLink, EmptyState, PageHero, Section, SectionHeading, StatusBadge } from '@/components/ui'
import type { Partner, Partnership } from '@/payload-types'

export const metadata: Metadata = { title: 'Partners', description: 'Karat Racing’s current partners and supporters.', alternates: { canonical: '/championship-team/partners' } }

const TIER: Record<string, string> = { title: 'Title partner', principal: 'Principal partner', official: 'Official partner', technical: 'Technical partner', supplier: 'Supplier', other: 'Partner' }

export default async function Partners() {
  const current = await getCurrentPartnerships()
  const all = (await publicFind<Partnership>('partnerships', { depth: 2, limit: 200 })).docs
  const historical = all.filter((p) => !isCurrentPartnership(p) && p.endDate && new Date(p.endDate) < new Date() && typeof p.partner === 'object')
  const tiers = [...new Set(current.map((p) => p.tier))]
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Partners' }]} />
      <PageHero eyebrow="Partners" title="Our partners" intro="The organisations that support Karat Racing. We show only current partnerships with approved publication rights.">
        <ButtonLink href="/championship-team/partner-with-us">Become a partner</ButtonLink>
      </PageHero>
      <Section>
        {current.length === 0 ? (
          <EmptyState title="Partner announcements to come" action={<ButtonLink href="/championship-team/partner-with-us" variant="outline">Partnership opportunities</ButtonLink>}>
            We will announce partners here once agreements are in place and approved for publication.
          </EmptyState>
        ) : (
          tiers.map((t) => (
            <div key={t} className="mb-10">
              <SectionHeading title={TIER[t] ?? t} />
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {current.filter((p) => p.tier === t).map((ps) => {
                  const p = ps.partner as Partner
                  const logo = mediaOf(p.logo)
                  return (
                    <li key={ps.id} className="clip-angle edge-glow relative bg-navy-800/70 p-6">
                      <div className="flex h-20 items-center">{logo?.url ? <Image src={logo.url} alt="" width={180} height={72} className="h-16 w-auto object-contain" /> : null}</div>
                      <h3 className="mt-3 font-display text-xl font-bold uppercase">
                        <Link href={`/championship-team/partners/${p.slug}`} className="after:absolute after:inset-0 hover:text-gold-300">
                          {p.name}
                        </Link>
                      </h3>
                      {ps.scope !== 'team' && <p className="text-mist text-sm">Supports: {ps.scope}</p>}
                      {p.isDemo && <StatusBadge tone="warn" label="Demo" className="mt-2" />}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))
        )}
      </Section>
      {historical.length > 0 && (
        <Section className="!pt-0" labelledBy="past">
          <SectionHeading id="past" eyebrow="Archive" title="Past partners" intro="With thanks to the organisations that supported us in previous seasons." />
          <ul className="flex flex-wrap gap-3 text-sm">
            {historical.map((ps) => (
              <li key={ps.id} className="rounded border border-white/10 px-3 py-2">
                {(ps.partner as Partner).name} <span className="text-mist">({ps.startDate?.slice(0, 4)}–{ps.endDate?.slice(0, 4)})</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}
