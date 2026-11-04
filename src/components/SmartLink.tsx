import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

export const isExternal = (href: string) => /^https?:\/\//.test(href)

/**
 * Internal links use Next <Link>. External links (e.g. the Testing & Karat Academy site)
 * open in a new tab with rel="noopener noreferrer" and an accessible "(opens in a new tab)" hint.
 */
export function SmartLink({ href, children, showIcon = true, ...rest }: Omit<ComponentProps<'a'>, 'href'> & { href: string; children: ReactNode; showIcon?: boolean }) {
  if (isExternal(href))
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        {showIcon && (
          <span aria-hidden="true" className="ml-1 text-[0.8em] opacity-80">
            ↗
          </span>
        )}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  )
}
