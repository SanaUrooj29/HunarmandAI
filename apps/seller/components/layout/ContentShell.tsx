'use client'

import { useSidebar } from '@/lib/sidebar-context'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export function ContentShell({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar()
  const pathname = usePathname()
  const isOnboarding = pathname.startsWith('/onboarding')

  return (
    <div
      className="flex-1 flex flex-col min-w-0 sidebar-transition"
      style={{
        // On mobile (< md) sidebar is hidden, so no offset needed.
        // We can't use a CSS class because the value is dynamic.
        // The md: prefix isn't available as inline style, so we use a data attr + CSS.
      }}
      data-collapsed={collapsed ? 'true' : 'false'}
      data-onboarding={isOnboarding ? 'true' : 'false'}
    >
      {children}
    </div>
  )
}
