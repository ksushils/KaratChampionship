'use client'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

export type GalleryItem = { url: string; alt: string; caption?: string | null; credit?: string | null; width?: number | null; height?: number | null }

/** Accessible lightbox: native <dialog> (focus trap, Esc), arrow keys, visible controls (MEDIA-03). */
export function Gallery({ items, label }: { items: GalleryItem[]; label: string }) {
  const [index, setIndex] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const open = (i: number, el: HTMLButtonElement) => {
    opener.current = el
    setIndex(i)
  }
  const close = useCallback(() => setIndex(null), [])
  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (index !== null && !d.open) d.showModal()
    if (index === null && d.open) {
      d.close()
      opener.current?.focus()
    }
  }, [index])
  const step = (n: number) => setIndex((i) => (i === null ? i : (i + n + items.length) % items.length))
  const cur = index !== null ? items[index] : null
  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4" aria-label={label}>
        {items.map((it, i) => (
          <li key={i}>
            <button type="button" onClick={(e) => open(i, e.currentTarget)} className="group relative block aspect-[4/3] w-full overflow-hidden rounded-card bg-navy-700">
              <Image src={it.url} alt={it.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform group-hover:scale-105" />
              <span className="sr-only">Open image {i + 1} of {items.length} in viewer</span>
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        aria-label={`${label} — image viewer`}
        onClose={close}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(1)
          if (e.key === 'ArrowLeft') step(-1)
        }}
        className="m-auto max-h-[95vh] w-[min(72rem,calc(100vw-1rem))] bg-transparent p-0 text-white backdrop:bg-black/90"
      >
        {cur && (
          <figure className="relative">
            <div className="relative h-[70vh] w-full">
              <Image src={cur.url} alt={cur.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-sm">
              <span>{cur.caption}</span>
              <span className="text-mist">
                {cur.credit} · {index! + 1} / {items.length}
              </span>
            </figcaption>
            <div className="mt-3 flex justify-center gap-2">
              <button type="button" className="min-h-11 min-w-11 rounded border border-white/30 px-4" onClick={() => step(-1)}>
                ← Previous
              </button>
              <button type="button" className="min-h-11 min-w-11 rounded border border-white/30 px-4" onClick={close} autoFocus>
                Close
              </button>
              <button type="button" className="min-h-11 min-w-11 rounded border border-white/30 px-4" onClick={() => step(1)}>
                Next →
              </button>
            </div>
          </figure>
        )}
      </dialog>
    </>
  )
}
