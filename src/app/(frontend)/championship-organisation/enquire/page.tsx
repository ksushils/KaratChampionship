import type { Metadata } from 'next'
import { randomUUID } from 'node:crypto'
import { GeneralEnquiryForm } from '@/components/forms'
import { Breadcrumbs, PageHero, Section } from '@/components/ui'

export const metadata: Metadata = { title: 'Championship Series enquiry', description: 'Contact Karat Racing about its championship project in India.', alternates: { canonical: '/championship-organisation/enquire' } }

export default function OrgEnquire() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Championship Series', href: '/championship-organisation' }, { label: 'Enquire' }]} />
      <PageHero eyebrow="Championship Series" title="Enquiry" intro="Enquiries go to the championship project team. They do not go to the racing team." />
      <Section className="!pt-8">
        <div className="max-w-3xl">
          <GeneralEnquiryForm
            initialKey={randomUUID()}
            category="championship-organisation"
            showOrganisation
            topics={[
              { value: 'participant', label: 'Potential participant (team or driver)' },
              { value: 'circuit', label: 'Circuit or venue' },
              { value: 'sponsor', label: 'Sponsor or commercial partner' },
              { value: 'supplier', label: 'Supplier' },
              { value: 'authority', label: 'Authority or federation' },
              { value: 'other', label: 'Other' },
            ]}
            submitLabel="Send enquiry"
            analyticsSubmit="organiser_enquiry_submitted"
          />
        </div>
      </Section>
    </>
  )
}
