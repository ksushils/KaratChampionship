import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = { title: 'Accessibility statement', alternates: { canonical: '/accessibility' } }

export default function Accessibility() {
  return (
    <LegalPage title="Accessibility statement">
      <p>We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.</p>
      <h2>What we have done</h2>
      <ul>
        <li>Keyboard-accessible navigation, forms and galleries with visible focus</li>
        <li>A skip link, semantic landmarks and a logical heading structure</li>
        <li>Status labels that use text and shape, not colour alone</li>
        <li>Accessible form errors with a summary that links to each field</li>
        <li>Support for reduced motion, and no autoplaying audio</li>
        <li>Data tables with captions and headers that scroll inside their own region</li>
      </ul>
      <h2>Known limitations</h2>
      <p>Third-party videos and official timing services are provided by external organisations and may not meet the same standard. Some historical documents may not be fully accessible.</p>
      <h2>Feedback</h2>
      <p>If something does not work for you, please tell us using the general enquiry form and we will try to help.</p>
    </LegalPage>
  )
}
