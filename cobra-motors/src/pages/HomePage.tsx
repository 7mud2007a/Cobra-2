import { useEffect, useLayoutEffect, useState } from 'react'
import { cx } from '../lib/format'
import { consumeCameFromVehicle, loadHomeScroll, saveHomeScroll, takePendingSection } from '../lib/nav'
import { AboutSection } from '../sections/AboutSection'
import { AssistantSection } from '../sections/AssistantSection'
import { ContactSection } from '../sections/ContactSection'
import { Hero } from '../sections/Hero'
import { SocialSection } from '../sections/SocialSection'
import { VehiclesSection } from '../sections/VehiclesSection'

let firstMount = true

export function HomePage() {
  // true when we arrive here from a vehicle page (button or browser back/forward)
  const [returning] = useState(consumeCameFromVehicle)

  useLayoutEffect(() => {
    const pending = takePendingSection()
    if (pending) {
      // jump to the requested section; repeat once layout has settled (images, fonts, scrollbar changes)
      const jump = () => document.getElementById(pending)?.scrollIntoView({ behavior: 'auto', block: 'start' })
      jump()
      requestAnimationFrame(() => { jump(); window.setTimeout(jump, 180) })
      return
    }
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const reloaded = firstMount && (nav?.type === 'reload' || nav?.type === 'back_forward')
    firstMount = false
    const y = loadHomeScroll()
    if ((returning || reloaded) && y !== null) {
      window.scrollTo(0, y)
      requestAnimationFrame(() => window.scrollTo(0, y)) // once more after layout settles
    } else window.scrollTo(0, 0)
  }, [returning])

  // remember where the visitor is on the collection page
  useEffect(() => {
    let raf = 0
    const on = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; saveHomeScroll(window.scrollY) }) }
    window.addEventListener('scroll', on, { passive: true })
    return () => { window.removeEventListener('scroll', on); if (raf) cancelAnimationFrame(raf) }
  }, [])

  return (
    <main id="main" tabIndex={-1} className={cx('home', returning && 'is-return')}>
      <Hero instant={returning} />
      <VehiclesSection />
      <AboutSection />
      <ContactSection />
      <SocialSection />
      <AssistantSection />
    </main>
  )
}
