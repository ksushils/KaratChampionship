import type { Metadata } from 'next'
import { ProgrammeView } from '@/components/ProgrammeView'
import { getProgramme } from '@/lib/data'

type P = { params: Promise<{ programme: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { programme } = await params
  const p = await getProgramme(programme)
  if (!p) return { title: 'Programme not found' }
  return {
    title: p.seo?.title || `${p.title} programme`,
    description: p.seo?.description || p.shortDescription || undefined,
    alternates: { canonical: `/championship-team/programmes/${p.slug}` },
    robots: p.seo?.noindex ? { index: false } : undefined,
  }
}

export default async function Page({ params }: P) {
  const { programme } = await params
  return <ProgrammeView slug={programme} />
}
