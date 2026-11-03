import Image from 'next/image'
import Link from 'next/link'
import { getDivisions } from '@/lib/data'
import { DIVISION_STATUS_LABEL } from '@/lib/status'
import { StatusBadge, buttonClass } from '@/components/ui'
import { DivisionLink } from './DivisionLink'

const IMG: Record<string, string> = {
  'championship-team': '/brand/car-side-light.jpg',
  testing: '/brand/car-aerial-dark.jpg',
  'championship-organisation': '/brand/car-top-light.jpg',
}
const HREF: Record<string, string> = { 'championship-team': '/championship-team', testing: '/testing', 'championship-organisation': '/championship-organisation' }

export default async function Gateway() {
  const divisions = (await getDivisions()).filter((d) => d.enabled !== false)
  return (
    <>
      <section className="relative overflow-hidden" aria-labelledby="gw-title">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(30,99,233,0.28),transparent_60%),radial-gradient(ellipse_at_10%_90%,rgba(220,179,92,0.12),transparent_50%)]" />
        <div className="container-k relative grid items-center gap-8 pb-6 pt-12 md:pt-20 lg:grid-cols-[1fr_1.25fr]">
          <div>
            <p className="eyebrow mb-4">Performance / Precision / Karat</p>
            <h1 id="gw-title" className="font-display text-[length:var(--text-display-xl)] font-extrabold uppercase leading-[0.95]">
              <span className="text-gold-metal">Karat</span> <span className="block text-white">Racing</span>
            </h1>
            <p className="text-mist mt-6 max-w-xl text-lg">
              One motorsport organisation, three separate businesses: a championship team, a testing and driver-development academy, and a plan for a new championship series in India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/championship-team" className={buttonClass('gold')}>
                Championship Team
              </Link>
              <Link href="/championship-team/race-with-us" className={buttonClass('outline')}>
                Discuss your race programme
              </Link>
            </div>
          </div>
          <div className="relative">
            <Image src="/brand/car-side-dark.jpg" alt="Karat Racing livery concept: a blue and gold single-seater, side view" width={1024} height={331} priority sizes="(min-width: 1024px) 60vw, 100vw" className="h-auto w-full rounded-card [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]" />
            <p className="text-mist mt-2 text-right text-xs">Livery concept</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="pathways-title" className="pb-20 pt-6">
        <div className="container-k">
          <h2 id="pathways-title" className="eyebrow mb-6">
            Choose a business
          </h2>
          <ul className="grid gap-5 md:grid-cols-3">
            {divisions.map((d, i) => (
              <li key={d.id} className="clip-angle edge-glow group relative flex flex-col overflow-hidden bg-navy-800/80">
                <div className="relative aspect-[16/10] overflow-hidden bg-paper">
                  <Image src={IMG[d.key]} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span aria-hidden="true" className="absolute left-4 top-3 font-display text-5xl font-extrabold text-white/90 drop-shadow">
                    0{i + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <StatusBadge status={d.status} label={DIVISION_STATUS_LABEL[d.status ?? 'planned']} className="self-start" />
                  <h3 className="mt-3 font-display text-2xl font-bold uppercase">
                    <DivisionLink href={HREF[d.key]} division={d.key} className="after:absolute after:inset-0 hover:text-gold-300">
                      {d.name}
                    </DivisionLink>
                  </h3>
                  <p className="mt-1 font-display text-sm font-semibold uppercase tracking-[0.14em] text-gold-300">{d.pathwayLabel}</p>
                  <p className="text-mist mt-3 text-[0.95rem]">{d.description}</p>
                  <span aria-hidden="true" className="mt-auto pt-5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-white group-hover:text-gold-300">
                    Enter →
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-mist mt-6 max-w-3xl text-sm">
            Each business has its own enquiry route. The Championship Series project is separate from the team’s racing activity. It is not connected to the existing Indian F4 championship.
          </p>
        </div>
      </section>
    </>
  )
}
