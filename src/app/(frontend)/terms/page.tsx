import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'

export const metadata: Metadata = { title: 'Terms of use', alternates: { canonical: '/terms' } }

export default function Terms() {
  return (
    <LegalPage title="Terms of use">
      <h2>Information on this site</h2>
      <p>Programme statuses, calendars and results are published in good faith from official sources and can change. The championship organisers’ official classifications and regulations always take precedence.</p>
      <h2>No offer</h2>
      <p>Nothing on this website is an offer of a race seat, test, hospitality or partnership. Any agreement must be made in writing.</p>
      <h2>Intellectual property</h2>
      <p>Karat Racing names, logos and livery designs belong to Karat Racing. Championship names and marks belong to their owners. Photography is credited and used under licence.</p>
      <h2>Livery imagery</h2>
      <p>Car imagery on this website shows livery design concepts, not specific race entries.</p>
    </LegalPage>
  )
}
