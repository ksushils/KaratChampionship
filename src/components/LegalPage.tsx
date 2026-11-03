import type { ReactNode } from 'react'
import { Notice, PageHero, Section } from './ui'

export function LegalPage({ title, version, children }: { title: string; version?: string | null; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow="Karat Racing" title={title} />
      <Section className="!pt-8">
        <div className="prose-k">
          <Notice tone="warn" title="Draft for review">
            This text is a working draft. It must be reviewed by a qualified adviser for the UK, EU and India, as applicable, before launch. Publishing it does not on its own make the organisation compliant.
          </Notice>
          {version && <p className="text-mist text-sm">Version {version}</p>}
          {children}
        </div>
      </Section>
    </>
  )
}
