import Link from 'next/link'
import type { ReactNode } from 'react'
import { statusTone, type Tone } from '@/lib/status'

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ')
}

type BtnVariant = 'gold' | 'outline' | 'ghost' | 'blue'
const btn: Record<BtnVariant, string> = {
  gold: 'bg-gradient-to-b from-gold-300 to-gold-500 text-night hover:from-gold-200 hover:to-gold-400 shadow-[0_6px_24px_-8px_rgba(220,179,92,0.6)]',
  blue: 'bg-royal-500 text-white hover:bg-royal-400',
  outline: 'border border-gold-400/70 text-gold-200 hover:bg-gold-400/10',
  ghost: 'text-white hover:text-gold-300 underline-offset-4 hover:underline',
}
export const buttonClass = (v: BtnVariant = 'gold', extra = '') =>
  cx(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.3rem] px-5 py-2.5 font-display text-[0.95rem] font-semibold uppercase tracking-[0.08em] transition-colors',
    btn[v],
    extra,
  )

export function ButtonLink({ href, children, variant = 'gold', className, ...rest }: { href: string; children: ReactNode; variant?: BtnVariant; className?: string; [k: string]: unknown }) {
  const external = /^https?:\/\//.test(href)
  if (external)
    return (
      <a href={href} className={buttonClass(variant, className)} rel="noopener noreferrer" target="_blank" {...rest}>
        {children}
        <span aria-hidden="true">↗</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      {children}
    </Link>
  )
}

const tones: Record<Tone, string> = {
  gold: 'border-gold-400/60 text-gold-200 bg-gold-400/10',
  blue: 'border-royal-400/60 text-royal-300 bg-royal-500/10',
  neutral: 'border-white/25 text-mist bg-white/5',
  warn: 'border-warn/60 text-warn bg-warn/10',
  danger: 'border-danger/60 text-[#ff9b9b] bg-danger/10',
  success: 'border-success/60 text-success bg-success/10',
}
const toneIcon: Record<Tone, string> = { gold: '◆', blue: '◇', neutral: '•', warn: '▲', danger: '✕', success: '✓' }

/** Status label — always text + shape, never colour alone (WCAG 1.4.1). */
export function StatusBadge({ status, label, tone, className }: { status?: string | null; label: string; tone?: Tone; className?: string }) {
  const t = tone ?? statusTone(status)
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-[0.2rem] border px-2 py-0.5 font-display text-[0.72rem] font-semibold uppercase tracking-[0.12em]', tones[t], className)}>
      <span aria-hidden="true">{toneIcon[t]}</span>
      {label}
    </span>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('eyebrow', className)}>{children}</p>
}

export function SectionHeading({ eyebrow, title, intro, id, as: As = 'h2', className }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; id?: string; as?: 'h1' | 'h2' | 'h3'; className?: string }) {
  return (
    <div className={cx('mb-8 max-w-3xl', className)}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <As id={id} className={cx('font-display font-bold uppercase', As === 'h1' ? 'text-[length:var(--text-display-lg)]' : 'text-[length:var(--text-display-md)]')}>
        {title}
      </As>
      <div className="rule-gold mt-4 w-24" aria-hidden="true" />
      {intro && <div className="text-mist mt-4 text-lg">{intro}</div>}
    </div>
  )
}

export function PageHero({ eyebrow, title, intro, children, image, status }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; children?: ReactNode; image?: string; status?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-ink-900">
      {image && (
        // Decorative background; the meaningful image is presented elsewhere with alt text.
        <div aria-hidden="true" className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-night via-night/90 to-night/40" />
      <div className="container-k relative py-14 md:py-20">
        {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[length:var(--text-display-lg)] font-bold uppercase">{title}</h1>
        </div>
        {status && <div className="mt-4 flex flex-wrap gap-2">{status}</div>}
        {intro && <div className="text-mist mt-5 max-w-2xl text-lg">{intro}</div>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  )
}

export function Section({ children, className, paper, id, labelledBy }: { children: ReactNode; className?: string; paper?: boolean; id?: string; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx('py-14 md:py-20', paper && 'paper', className)}>
      <div className="container-k">{children}</div>
    </section>
  )
}

export function Card({ children, className, as: As = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'article' | 'li' }) {
  return <As className={cx('clip-angle edge-glow relative bg-navy-800/70 p-6', className)}>{children}</As>
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-white/20 p-8 text-center">
      <p className="font-display text-xl font-semibold uppercase tracking-wide">{title}</p>
      {children && <div className="text-mist mx-auto mt-2 max-w-xl">{children}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Notice({ children, tone = 'gold', title }: { children: ReactNode; tone?: 'gold' | 'blue' | 'warn'; title?: string }) {
  const c = tone === 'warn' ? 'border-warn/60 bg-warn/5' : tone === 'blue' ? 'border-royal-400/60 bg-royal-500/10' : 'border-gold-400/60 bg-gold-400/5'
  return (
    <div className={cx('rounded-card border-l-4 p-4 text-sm', c)} role="note">
      {title && <p className="mb-1 font-semibold">{title}</p>}
      {children}
    </div>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, item: it.href ? `${base}${it.href}` : undefined })),
  }
  return (
    <nav aria-label="Breadcrumb" className="container-k pt-5 text-sm">
      <ol className="text-mist flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.href && i < items.length - 1 ? (
              <Link href={it.href} className="hover:text-gold-300 underline-offset-4 hover:underline">
                {it.label}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? 'page' : undefined} className="text-white">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
    </nav>
  )
}

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}

/** Missing value: shows an em dash with an accessible "Not published" label — never zero (RES-15). */
export function Val({ v }: { v: string | number | null | undefined }) {
  if (v === null || v === undefined || v === '')
    return (
      <span className="text-mist" title="Not published">
        <span aria-hidden="true">—</span>
        <span className="sr-only">Not published</span>
      </span>
    )
  return <>{v}</>
}

export function ExternalLink({ href, children, className, onClickEvent }: { href: string; children: ReactNode; className?: string; onClickEvent?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cx('text-royal-300 underline underline-offset-4 hover:text-gold-300', className)} data-track={onClickEvent}>
      {children}
      <span aria-hidden="true"> ↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
