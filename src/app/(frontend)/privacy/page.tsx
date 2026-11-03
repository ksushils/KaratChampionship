import type { Metadata } from 'next'
import { getSettings } from '@/lib/data'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = { title: 'Privacy notice', alternates: { canonical: '/privacy' } }

export default async function Privacy() {
  const { site } = await getSettings()
  return (
    <LegalPage title="Privacy notice" version={site.privacyNoticeVersion}>
      <h2>Who we are</h2>
      <p>{site.legalEntityName ?? '[Legal entity name — to be supplied]'} (“Karat Racing”) controls the personal data collected through this website.</p>
      <h2>What we collect and why</h2>
      <ul>
        <li><strong>Enquiries</strong> (name, email, country, optional telephone, your answers): to respond to you and to discuss programmes, partnerships, hospitality, testing or the championship project. We ask for a driver’s age band, not a date of birth, and we do not collect identity documents or medical information through this website.</li>
        <li><strong>Young drivers</strong>: if a driver is under 18 we ask for a parent or guardian contact. Only authorised staff can see these enquiries, and they are handled under our safeguarding policy.</li>
        <li><strong>Job applications</strong> (contact details, CV, cover note): to assess your application. Only the recruitment team can access them.</li>
        <li><strong>Marketing</strong>: only if you opt in. This choice is separate from your enquiry, and you can withdraw it at any time.</li>
        <li><strong>Cookies and analytics</strong>: see the cookie policy. Optional analytics run only with your consent and never include names, emails, phone numbers or messages.</li>
      </ul>
      <h2>Retention</h2>
      <p>By default we keep enquiries for 24 months and job applications for 6 months, unless a longer period is needed for an agreement or the law. [Retention periods to be confirmed.]</p>
      <h2>Your rights</h2>
      <p>You can ask to access, correct or delete your data, or object to how we use it. Contact us using the general enquiry form and quote your reference if you have one.</p>
      <h2>International transfers</h2>
      <p>[To be completed after reviewing hosting, email and CRM providers and the countries involved.]</p>
    </LegalPage>
  )
}
