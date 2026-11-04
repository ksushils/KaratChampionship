import Image from 'next/image'
import Link from 'next/link'
import { getDivisions } from '@/lib/data'
import { DIVISION_STATUS_LABEL } from '@/lib/status'
import { StatusBadge, buttonClass } from '@/components/ui'
import { DivisionLink } from './DivisionLink'
import { HeroVideo } from '@/components/HeroVideo'
import { TESTING_PAGE } from '@/lib/nav'

const IMG: Record<string, string> = {
  'championship-team': '/brand/car-side-light.jpg',
  testing: '/brand/car-aerial-dark.jpg',
  'championship-organisation': '/brand/car-top-light.jpg',
}
const HREF: Record<string, string> = { 'championship-team': '/championship-team', testing: TESTING_PAGE, 'championship-organisation': '/championship-organisation' }

export default async function Gateway() {
  const divisions = (await getDivisions()).filter((d) => d.enabled !== false)
  return (
    <>
      <section className="relative isolate flex min-h-[34rem] items-center overflow-hidden md:min-h-[40rem]" aria-labelledby="gw-title">
        {/* Background video made from the Karat car photo; the poster shows the same photo while loading. */}
        <HeroVideo className="absolute inset-0 -z-20 h-full w-full object-cover object-[68%_50%]" />
        <p className="sr-only">Background video: the Karat Racing blue and gold livery concept car, with a slow camera move and a light sweep.</p>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/55 md:bg-transparent md:bg-gradient-to-r md:from-night md:from-15% md:via-night/60 md:via-45% md:to-night/0 md:to-70%" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-night to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-night/80 to-transparent" />
        <div className="container-k relative py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4">Performance / Precision / Karat</p>
            <h1 id="gw-title" className="font-display text-[length:var(--text-display-xl)] font-extrabold uppercase leading-[0.95] drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
              <span className="text-gold-metal">Karat</span> <span className="block text-white">Racing</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">
              One motorsport organisation, three separate businesses: a championship team, a testing and driver-development academy, and a plan for a new championship series in India.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/championship-team" className={buttonClass('gold')}>
                Championship Team
              </Link>
              <Link href="/championship-team/race-with-us" className={buttonClass('outline', 'bg-night/40 backdrop-blur-sm')}>
                Discuss your race programme
              </Link>
            </div>
          </div>
        </div>
        <p className="absolute bottom-5 left-4 text-xs text-white/60 md:left-8">Livery concept</p>
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
                    {/^https?:/.test(HREF[d.key]) ? 'Visit site ↗' : 'Enter →'}
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
