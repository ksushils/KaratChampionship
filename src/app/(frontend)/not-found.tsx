import Link from 'next/link'
import { buttonClass } from '@/components/ui'

export default function NotFound() {
  return (
    <section className="container-k py-24 text-center">
      <p className="eyebrow mb-3">Error 404</p>
      <h1 className="font-display text-[length:var(--text-display-lg)] font-bold uppercase">Off the racing line</h1>
      <p className="text-mist mx-auto mt-4 max-w-xl">This page doesn’t exist, or the content isn’t available right now. It may be unpublished or not yet announced.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClass('gold')}>Home</Link>
        <Link href="/search" className={buttonClass('outline')}>Search</Link>
        <Link href="/championship-team/contact" className={buttonClass('outline')}>Contact</Link>
      </div>
    </section>
  )
}
