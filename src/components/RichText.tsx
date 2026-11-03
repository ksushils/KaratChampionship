import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function RichText({ data, className }: { data?: unknown; className?: string }) {
  if (!data || typeof data !== 'object') return null
  return (
    <div className={`prose-k ${className ?? ''}`}>
      <LexicalRichText data={data as SerializedEditorState} />
    </div>
  )
}
