/** Tiny hash router + scroll bookkeeping. Hash routes keep the site deployable on any static host. */
import { useEffect, useState } from 'react'

export type Route = { name: 'home' } | { name: 'vehicle'; id: string }

export const vehicleHref = (id: string) => `#/vehicle/${id}`
export const HOME_HREF = '#/'

const parse = (): Route => {
  const m = location.hash.replace(/^#/, '').match(/^\/vehicle\/([\w-]+)/)
  return m ? { name: 'vehicle', id: m[1] } : { name: 'home' }
}
export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parse)
  useEffect(() => {
    const on = () => setRoute(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

/* In-app navigation history (for the "Back to collection" link). */
let navCount = 0
let prevHash = ''
let lastHash = location.hash
window.addEventListener('hashchange', () => { navCount++; prevHash = lastHash; lastHash = location.hash })
const isHomeHash = (h: string) => !/^#\/vehicle\//.test(h)
/** True when the previous history entry is the collection page → history.back() restores it natively. */
export const canPopToHome = () => navCount > 0 && isHomeHash(prevHash)

/* Scroll memory for the home page. */
const KEY = 'cobra:homeScroll'
export const saveHomeScroll = (y: number) => { try { sessionStorage.setItem(KEY, String(Math.round(y))) } catch { /* ignore */ } }
export const loadHomeScroll = (): number | null => {
  try { const v = sessionStorage.getItem(KEY); return v === null ? null : Number(v) } catch { return null }
}
let cameFromVehicle = false
export const markCameFromVehicle = () => { cameFromVehicle = true }
export const consumeCameFromVehicle = () => { const v = cameFromVehicle; cameFromVehicle = false; return v }

let pendingSection: string | null = null
export const setPendingSection = (id: string) => { pendingSection = id }
export const takePendingSection = () => { const p = pendingSection; pendingSection = null; return p }

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function scrollToSection(id: string) {
  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth'
  if (id === 'home') { window.scrollTo({ top: 0, behavior }); return }
  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
}

/** Section navigation that works from any page. */
export function goToSection(id: string, isHome: boolean) {
  if (isHome) scrollToSection(id)
  else { setPendingSection(id); location.hash = HOME_HREF }
}
