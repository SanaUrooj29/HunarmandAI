'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SidebarCtx {
  collapsed: boolean
  toggle: () => void
  sidebarW: string   // CSS value for margin offset
}

const Ctx = createContext<SidebarCtx>({
  collapsed: false,
  toggle: () => {},
  sidebarW: '240px',
})

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  // Persist preference
  useEffect(() => {
    const stored = localStorage.getItem('sidebar_collapsed')
    if (stored === 'true') setCollapsed(true)
  }, [])

  const toggle = () => {
    setCollapsed(p => {
      localStorage.setItem('sidebar_collapsed', String(!p))
      return !p
    })
  }

  const sidebarW = collapsed ? '64px' : '240px'

  return (
    <Ctx.Provider value={{ collapsed, toggle, sidebarW }}>
      {children}
    </Ctx.Provider>
  )
}

export const useSidebar = () => useContext(Ctx)
