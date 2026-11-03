import type { Metadata } from 'next'
import { ProgrammeView } from '@/components/ProgrammeView'
import { getProgramme } from '@/lib/data'

type P = { params: Promise<{ programme: string; season: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { programme, season } = await params
  const p = await getProgramme(programme)
  if (!p) return { title: 'Programme not found' }
  return {
    title: `${p.title} ${season}`,
    description: `${p.title} ${season} — Karat Racing programme status, calendar, drivers and results.`,
    alternates: { canonical: `/championship-team/programmes/${p.slug}/${season}` },
  }
}

export default async function Page({ params }: P) {
  const { programme, season } = await params
  return <ProgrammeView slug={programme} seasonParam={season} />
}
