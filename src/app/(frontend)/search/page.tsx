import Link from 'next/link'
import type { Metadata } from 'next'
import { siteSearch } from '@/lib/search'
import { ButtonLink, PageHero, Section, StatusBadge, buttonClass } from '@/components/ui'

export const metadata: Metadata = { title: 'Search', robots: { index: false, follow: true } }

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const hits = await siteSearch(q)
  return (
    <>
      <PageHero eyebrow="Karat Racing" title="Search" />
      <Section className="!pt-8">
        <form role="search" method="get" className="flex max-w-2xl flex-wrap gap-3">
          <label htmlFor="q" className="sr-only">Search the site</label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Search programmes, drivers, events, news…" className="field-k flex-1" />
          <button className={buttonClass('gold')}>Search</button>
        </form>
        <div className="mt-8 max-w-3xl" aria-live="polite">
          {q.trim().length >= 2 && (
            <p className="text-mist mb-4 text-sm">
              {hits.length} result{hits.length === 1 ? '' : 's'} for “{q}”
            </p>
          )}
          {hits.length > 0 ? (
            <ul className="divide-y divide-white/10">
              {hits.map((h) => (
                <li key={h.href + h.title} className="py-4">
                  <StatusBadge tone="neutral" label={h.type} />
                  <p className="mt-1 font-display text-xl font-bold uppercase">
                    <Link href={h.href} className="hover:text-gold-300">{h.title}</Link>
                  </p>
                  {h.excerpt && <p className="text-mist line-clamp-2 text-sm">{h.excerpt}</p>}
                </li>
              ))}
            </ul>
          ) : q.trim().length >= 2 ? (
            <div className="rounded-card border border-white/10 p-6">
              <p className="font-semibold">No matches found.</p>
              <p className="text-mist mt-1 text-sm">Try a shorter or different word, or go straight to:</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ButtonLink href="/championship-team/programmes" variant="outline">Programmes</ButtonLink>
                <ButtonLink href="/championship-team/news" variant="outline">News</ButtonLink>
                <ButtonLink href="/championship-team/contact" variant="outline">Contact</ButtonLink>
              </div>
            </div>
          ) : null}
        </div>
      </Section>
    </>
  )
}
