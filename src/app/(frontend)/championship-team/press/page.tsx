import type { Metadata } from 'next'
import { randomUUID } from 'node:crypto'
import { getSettings, publicFind } from '@/lib/data'
import { canDownload } from '@/lib/media-rights'
import { mediaOf } from '@/components/cards'
import { GeneralEnquiryForm } from '@/components/forms'
import { Breadcrumbs, Card, Notice, PageHero, Section, SectionHeading } from '@/components/ui'
import type { Media } from '@/payload-types'

export const metadata: Metadata = { title: 'Press', description: 'Karat Racing press resources, approved downloads and media enquiries.', alternates: { canonical: '/championship-team/press' } }

export default async function Press() {
  const [{ team }, assets] = await Promise.all([getSettings(), publicFind<Media>('media', { where: { downloadPermitted: { equals: true } }, limit: 24, depth: 0 })])
  const downloads = assets.docs.filter((m) => canDownload(m))
  const profile = mediaOf(team.teamProfilePdf)
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Press' }]} />
      <PageHero eyebrow="News & Media" title="Press" intro="Approved brand assets, team information and a direct route for media enquiries." />
      <Section labelledBy="downloads">
        <SectionHeading id="downloads" eyebrow="Downloads" title="Press resources" />
        <ul className="grid gap-4 md:grid-cols-3">
          <li>
            <Card>
              <h3 className="font-display text-lg font-bold uppercase">Karat logo mark</h3>
              <p className="text-mist text-sm">PNG with transparent background. Supplied by the owner.</p>
              <a className="mt-3 inline-block text-royal-300 underline" href="/brand/karat-k.png" download data-track="media_downloaded">
                Download PNG
              </a>
            </Card>
          </li>
          <li>
            <Card>
              <h3 className="font-display text-lg font-bold uppercase">Livery concept</h3>
              <p className="text-mist text-sm">Side, front, top and rear views. Concept artwork.</p>
              <a className="mt-3 inline-block text-royal-300 underline" href="/brand/livery-presentation.jpg" download data-track="media_downloaded">
                Download JPG
              </a>
            </Card>
          </li>
          {profile?.url && (
            <li>
              <Card>
                <h3 className="font-display text-lg font-bold uppercase">Team profile</h3>
                <p className="text-mist text-sm">Version {team.teamProfileVersion ?? '—'}</p>
                <a className="mt-3 inline-block text-royal-300 underline" href={profile.url} download data-track="media_downloaded">
                  Download PDF
                </a>
              </Card>
            </li>
          )}
          {downloads.map((m) => (
            <li key={m.id}>
              <Card>
                <h3 className="font-display text-lg font-bold uppercase">{m.alt}</h3>
                <p className="text-mist text-sm">{[m.credit, m.usageScope].filter(Boolean).join(' · ')}</p>
                {m.restrictions && <p className="text-mist text-xs">Restrictions: {m.restrictions}</p>}
                <a className="mt-3 inline-block text-royal-300 underline" href={m.url!} download data-track="media_downloaded">
                  Download
                </a>
              </Card>
            </li>
          ))}
        </ul>
        <div className="mt-6 max-w-3xl">
          <Notice tone="blue">Championship media accreditation and paddock passes are issued by each championship organiser, not by Karat Racing. Please apply to the organiser directly.</Notice>
        </div>
      </Section>
      <Section paper labelledBy="press-contact">
        <div className="max-w-2xl">
          <SectionHeading id="press-contact" eyebrow="Media enquiries" title="Contact the press office" />
          <div className="rounded-card bg-night p-6 text-white">
            <GeneralEnquiryForm initialKey={randomUUID()} category="media" showOrganisation topics={[{ value: 'interview', label: 'Interview request' }, { value: 'images', label: 'Images or assets' }, { value: 'information', label: 'Information request' }, { value: 'other', label: 'Other' }]} submitLabel="Send media enquiry" />
          </div>
        </div>
      </Section>
    </>
  )
}
