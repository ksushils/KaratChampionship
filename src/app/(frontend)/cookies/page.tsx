import type { Metadata } from 'next'
import { CookieSettingsButton } from '@/components/ConsentManager'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = { title: 'Cookie policy', alternates: { canonical: '/cookies' } }

export default function Cookies() {
  return (
    <LegalPage title="Cookie policy">
      <h2>Essential</h2>
      <ul>
        <li><code>karat_consent</code>: remembers your cookie choices (180 days).</li>
        <li><code>payload-token</code>: staff login for the content management system only (not set for visitors).</li>
      </ul>
      <h2>Optional (only with consent)</h2>
      <ul>
        <li><strong>Analytics</strong>: aggregated, privacy-focused page and conversion measurement. It is not loaded until you accept.</li>
        <li><strong>Media embeds</strong>: video players from providers such as YouTube or Vimeo, which may set their own cookies. They are not loaded until you accept. A plain link is always available instead.</li>
      </ul>
      <p>
        You can change or withdraw your choice at any time: <CookieSettingsButton className="text-royal-300 underline" />
      </p>
    </LegalPage>
  )
}
