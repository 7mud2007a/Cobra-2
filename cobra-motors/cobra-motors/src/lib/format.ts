import { siteConfig } from '../config/site'

export type Lang = 'ar' | 'en'

export const formatNumber = (n: number) => n.toLocaleString('en-US')
export const formatPrice = (n: number) => `${siteConfig.currency.symbol}${formatNumber(n)}`
export const formatKm = (n: number, lang: Lang) => `${formatNumber(n)} ${lang === 'ar' ? 'كم' : 'km'}`
export const formatHp = (n: number, lang: Lang) => `${formatNumber(n)} ${lang === 'ar' ? 'حصان' : 'hp'}`

/** Arabic plural for "vehicles". */
export const vehiclesCount = (n: number, lang: Lang) => {
  if (lang === 'en') return `${n} ${n === 1 ? 'vehicle' : 'vehicles'}`
  if (n === 1) return 'سيارة واحدة'
  if (n === 2) return 'سيارتان'
  return n >= 3 && n <= 10 ? `${n} سيارات` : `${n} سيارة`
}

export const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ')

/** Resolves a path in /public against Vite's base (works at any hosting path). */
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`
