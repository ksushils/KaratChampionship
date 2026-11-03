import type { Faq } from '@/payload-types'
import { JsonLd } from './ui'

/** Native <details> disclosure: keyboard and screen-reader accessible without JS. */
export function FaqList({ faqs, structuredData = false }: { faqs: Faq[]; structuredData?: boolean }) {
  if (!faqs.length) return null
  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {faqs.map((f) => (
        <details key={f.id} className="group py-1">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">
            {f.question}
            <span aria-hidden="true" className="text-gold-300 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="text-mist pb-4">{f.answer}</p>
        </details>
      ))}
      {structuredData && (
        <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) }} />
      )}
    </div>
  )
}
