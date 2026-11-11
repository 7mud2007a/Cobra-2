import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n'
import { asset, cx } from '../lib/format'
import { prefersReducedMotion, scrollToSection } from '../lib/nav'

const FLAG = 'cobra:intro'
const seen = () => { try { return sessionStorage.getItem(FLAG) === '1' } catch { return false } }
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

/** Cinematic intro: starts dark, then the shade lifts once the image and fonts are ready. */
export function Hero({ instant }: { instant: boolean }) {
  const { t } = useLang()
  const [revealed, setRevealed] = useState(() => instant || seen() || prefersReducedMotion())
  const [theme, setTheme] = useState(() => typeof document === 'undefined' ? 'light' : document.documentElement.dataset.theme || 'light')
  const media = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => setTheme(root.dataset.theme || 'light'))
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (revealed) return
    let live = true
    const el = img.current
    const imgReady = !el || el.complete ? Promise.resolve() : new Promise<void>((r) => { el.addEventListener('load', () => r(), { once: true }); el.addEventListener('error', () => r(), { once: true }) })
    const fonts = document.fonts?.load ? Promise.all([document.fonts.load('1em Tajawal'), document.fonts.load('1em Alamani', 'ا')]).catch(() => undefined) : Promise.resolve()
    Promise.race([Promise.all([imgReady, fonts, wait(500)]), wait(3500)]).then(() => {
      if (!live) return
      setRevealed(true)
      try { sessionStorage.setItem(FLAG, '1') } catch { /* ignore */ }
    })
    return () => { live = false }
  }, [revealed])

  useEffect(() => {
    if (prefersReducedMotion()) return
    let raf = 0
    const on = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        media.current?.style.setProperty('--py', `${Math.min(window.scrollY, window.innerHeight) * 0.16}px`)
      })
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => { window.removeEventListener('scroll', on); if (raf) cancelAnimationFrame(raf) }
  }, [])

  return (
    <section id="home" className={cx('hero', revealed && 'is-revealed', instant && 'is-instant')}>
      <div className="hero__media" ref={media}>
        <div className="hero__drift">
          <img ref={img} className="hero__img" src={asset(theme === 'dark' ? 'images/cobra-logo-white.png' : 'images/cobra-logo.png')} alt={t.hero.alt} width={886} height={480} fetchPriority="high" decoding="async" />
        </div>
      </div>
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__loader" aria-hidden="true" />
      <div className="container hero__content">
        <h1 className="hero__title" style={{ '--i': 0 } as React.CSSProperties}>{t.hero.headline}</h1>
        <p className="hero__sub" style={{ '--i': 1 } as React.CSSProperties}>{t.hero.sub}</p>
        <div style={{ '--i': 2 } as React.CSSProperties}>
          <button type="button" className="btn btn--light" onClick={() => scrollToSection('vehicles')}>{t.hero.cta}</button>
        </div>
      </div>
    </section>
  )
}
