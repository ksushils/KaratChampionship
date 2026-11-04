import Link from 'next/link'
import type { Metadata } from 'next'
import { randomUUID } from 'node:crypto'
import { getSettings } from '@/lib/data'
import { TESTING_ENQUIRE_URL } from '@/lib/nav'
import { GeneralEnquiryForm } from '@/components/forms'
import { Breadcrumbs, Card, PageHero, Section } from '@/components/ui'

export const metadata: Metadata = { title: 'Contact', description: 'Contact Karat Racing. Separate routes for drivers, partners, media, careers, testing and championship organisation.', alternates: { canonical: '/championship-team/contact' } }

const ROUTES = [
  ['Drivers & families', 'Discuss a race programme', '/championship-team/race-with-us'],
  ['Partners', 'Partnership and sponsorship', '/championship-team/partner-with-us#enquire'],
  ['Hospitality', 'Race-weekend guests', '/championship-team/hospitality'],
  ['Media', 'Press and interview requests', '/championship-team/press'],
  ['Careers', 'Open roles', '/championship-team/careers'],
  ['Testing', 'Testing & Karat Academy', TESTING_ENQUIRE_URL],
  ['Championship Series', 'Building racing in India', '/championship-organisation/enquire'],
  ['Safeguarding', 'Raise a welfare concern', '/safeguarding'],
] as const

export default async function Contact() {
  const { site, flags } = await getSettings()
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Team', href: '/championship-team' }, { label: 'Contact' }]} />
      <PageHero eyebrow="Contact" title="Contact Karat Racing" intro="Choose the route that matches your enquiry so it goes straight to the right team." />
      <Section>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROUTES.map(([t, d, h]) => (
            <li key={h}>
              <Card className="h-full">
                <h2 className="font-display text-lg font-bold uppercase">
                  <Link href={h} className="after:absolute after:inset-0 hover:text-gold-300">{t}</Link>
                </h2>
                <p className="text-mist text-sm">{d}</p>
              </Card>
            </li>
          ))}
        </ul>
        {(site.publicEmail || site.publicPhone || site.registeredAddress) && (
          <div className="mt-8 grid gap-1 text-sm">
            {site.publicEmail && <p>Email: <a className="underline" href={`mailto:${site.publicEmail}`}>{site.publicEmail}</a></p>}
            {site.publicPhone && <p>Telephone: <a className="underline" href={`tel:${site.publicPhone.replace(/\s/g, '')}`}>{site.publicPhone}</a></p>}
            {site.registeredAddress && <p className="whitespace-pre-line">{site.registeredAddress}</p>}
          </div>
        )}
        {flags.whatsapp && flags.whatsappNumber && (
          <p className="mt-4 text-sm">
            WhatsApp: <a className="underline" href={`https://wa.me/${flags.whatsappNumber.replace(/\D/g, '')}`}>message us</a> (business hours; not monitored for urgent matters)
          </p>
        )}
      </Section>
      <Section paper labelledBy="general">
        <div className="max-w-2xl">
          <h2 id="general" className="mb-6 font-display text-3xl font-bold uppercase">General enquiry</h2>
          <div className="rounded-card bg-night p-6 text-white">
            <GeneralEnquiryForm initialKey={randomUUID()} category="general" showOrganisation />
          </div>
        </div>
      </Section>
    </>
  )
}
