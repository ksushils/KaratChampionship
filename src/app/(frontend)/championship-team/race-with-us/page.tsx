import type { Metadata } from 'next'
import { randomUUID } from 'node:crypto'
import { getFaqs, getProgrammes } from '@/lib/data'
import { PROGRAMME_STATUS_LABEL } from '@/lib/status'
import { FaqList } from '@/components/FaqList'
import { RaceEnquiryForm } from '@/components/forms'
import { Breadcrumbs, Card, Notice, PageHero, Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Race with us',
  description: 'Discuss a single-seater race programme with Karat Racing. A short, confidential enquiry for drivers, parents, managers and academies.',
  alternates: { canonical: '/championship-team/race-with-us' },
}

type SP = { programme?: string; season?: string }

export default async function RaceWithUs({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const [programmes, faqs] = await Promise.all([getProgrammes(), getFaqs('driver-enquiries')])
  const options = programmes.filter((p) => p.status !== 'future' && p.status !== 'archived').map((p) => ({ value: p.slug!, label: `${p.title} — ${PROGRAMME_STATUS_LABEL[p.status]}` }))
  const y = new Date().getUTCFullYear()
  // LEAD-04: seasons computed, never hard-coded.
  const seasons = [y, y + 1, y + 2].map((s) => ({ value: String(s), label: String(s) })).concat([{ value: 'flexible', label: 'Flexible' }])
  const def = options.some((o) => o.value === sp.programme) ? sp.programme : undefined
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Race with us' }]} />
      <PageHero eyebrow="Race with Karat" title="Discuss your race programme" intro="Three short steps, about three minutes. We only ask what we need to have a useful first conversation, so please do not send any documents." />
      <Section className="!pt-10">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <RaceEnquiryForm programmes={options} seasons={seasons} defaultProgramme={def} initialKey={randomUUID()} />
          </div>
          <aside className="grid content-start gap-5">
            <Card>
              <h2 className="eyebrow mb-3">What happens next</h2>
              <ol className="grid gap-3 text-sm">
                <li><strong>1.</strong> Your enquiry is saved and you get a reference number.</li>
                <li><strong>2.</strong> The Championship Team reviews it in confidence.</li>
                <li><strong>3.</strong> We contact you to arrange a conversation. If the driver is under 18, we include their parent or guardian.</li>
              </ol>
            </Card>
            <Notice tone="blue" title="Under 18?">Young drivers are welcome to enquire, but a parent or guardian must be involved. The form will ask for their details.</Notice>
            {faqs.length > 0 && (
              <div>
                <h2 className="eyebrow mb-3">Questions</h2>
                <FaqList faqs={faqs} />
              </div>
            )}
          </aside>
        </div>
      </Section>
    </>
  )
}
