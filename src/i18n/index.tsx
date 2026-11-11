import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en, type Dict } from './en'
import { ar } from './ar'
import type { Lang } from '../lib/format'

const dicts: Record<Lang, Dict> = { en, ar }
const KEY = 'cobra:lang'

interface Ctx {
  lang: Lang
  dir: 'rtl' | 'ltr'
  t: Dict
  setLang: (l: Lang) => void
  fmt: (s: string, vars: Record<string, string | number>) => string
}
const LangContext = createContext<Ctx | null>(null)

const initialLang = (): Lang => {
  try {
    const stored = localStorage.getItem(KEY)
    if (stored === 'ar' || stored === 'en') return stored
  } catch { /* storage unavailable */ }
  return 'ar'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    const d = dicts[lang]
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    document.querySelector('meta[name="description"]')?.setAttribute('content', d.meta.description)
  }, [lang, dir])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem(KEY, l) } catch { /* ignore */ }
  }, [])

  const fmt = useCallback(
    (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? '')),
    [],
  )
  const value = useMemo(() => ({ lang, dir: dir as 'rtl' | 'ltr', t: dicts[lang], setLang, fmt }), [lang, dir, setLang, fmt])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const c = useContext(LangContext)
  if (!c) throw new Error('useLang must be used inside <LangProvider>')
  return c
}
