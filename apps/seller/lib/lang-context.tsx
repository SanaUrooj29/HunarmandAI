'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { strings, Locale, StringKey } from '@/locales/strings'

interface LangContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: StringKey) => string
  isRtl: boolean
}

const LangContext = createContext<LangContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (k) => strings.en[k],
  isRtl: false,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const stored = localStorage.getItem('hunarmand_locale') as Locale | null
    if (stored === 'en' || stored === 'ur') setLocaleState(stored)
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('hunarmand_locale', l)
    document.documentElement.dir = l === 'ur' ? 'rtl' : 'ltr'
    document.documentElement.lang = l
  }

  const t = (key: StringKey): string => strings[locale][key] ?? strings.en[key]

  return (
    <LangContext.Provider value={{ locale, setLocale, t, isRtl: locale === 'ur' }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
