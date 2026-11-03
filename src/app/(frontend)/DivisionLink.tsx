'use client'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { track } from '@/components/analytics'

export function DivisionLink({ href, division, children, className }: { href: string; division: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={className} onClick={() => track('division_selected', { division, from: 'gateway' })}>
      {children}
    </Link>
  )
}
