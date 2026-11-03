'use client'
import { useEffect } from 'react'
import { buttonClass } from '@/components/ui'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <section className="container-k py-24 text-center">
      <p className="eyebrow mb-3">Something went wrong</p>
      <h1 className="font-display text-[length:var(--text-display-lg)] font-bold uppercase">Red flag</h1>
      <p className="text-mist mx-auto mt-4 max-w-xl">We couldn’t load this page. If you were sending a form, it may not have been saved, so please try again.{error.digest && ` (Ref: ${error.digest})`}</p>
      <div className="mt-8 flex justify-center gap-3">
        <button className={buttonClass('gold')} onClick={reset}>Try again</button>
        <a href="/" className={buttonClass('outline')}>Home</a>
      </div>
    </section>
  )
}
