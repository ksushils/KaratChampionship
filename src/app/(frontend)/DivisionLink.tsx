'use client'
import type { ReactNode } from 'react'
import { track } from '@/components/analytics'
import { SmartLink } from '@/components/SmartLink'

/** Gateway pathway link. External businesses (Testing & Karat Academy) open in a new tab. */
export function DivisionLink({ href, division, children, className }: { href: string; division: string; children: ReactNode; className?: string }) {
  return (
    <SmartLink href={href} className={className} onClick={() => track('division_selected', { division, from: 'gateway' })}>
      {children}
    </SmartLink>
  )
}
