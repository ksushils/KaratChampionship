import Image from 'next/image'
import Link from 'next/link'

export function Wordmark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const k = size === 'lg' ? 64 : size === 'sm' ? 30 : 40
  const text = size === 'lg' ? 'text-4xl' : size === 'sm' ? 'text-lg' : 'text-2xl'
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image src="/brand/karat-k.png" alt="" width={k} height={Math.round(k * 0.95)} priority className="drop-shadow-[0_0_10px_rgba(60,200,255,0.35)]" />
      <span className="flex flex-col leading-none">
        <span className={`font-display ${text} text-gold-metal font-extrabold tracking-[0.16em]`}>KARAT</span>
        <span className="font-display text-[0.62rem] font-semibold tracking-[0.42em] text-royal-300">RACING</span>
      </span>
    </span>
  )
}

export function LogoLink() {
  return (
    <Link href="/" className="inline-flex min-h-11 items-center" aria-label="Karat Racing — home">
      <Wordmark />
    </Link>
  )
}
