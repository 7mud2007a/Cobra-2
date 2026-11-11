import { useEffect, useRef, useState } from 'react'
import { siteConfig, type SocialKey } from '../config/site'
import { useLang } from '../i18n'
import { asset, cx } from '../lib/format'
import { goToSection, HOME_HREF } from '../lib/nav'
import { SocialIcon } from './ui/Icons'

const SECTIONS = ['home', 'vehicles', 'about', 'contact'] as const
type SectionId = (typeof SECTIONS)[number]

export function NavBar({ isHome }: { isHome: boolean }) {
  const { t, lang, setLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<SectionId>('home')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try { return localStorage.getItem('cobra-theme') === 'dark' ? 'dark' : 'light' } catch { return 'light' }
  })
  const firstLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      setScrolled(window.scrollY > 24)
      if (!isHome) return
      let current: SectionId = 'home'
      for (const id of SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) current = id
      }
      setActive(current)
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf) }
  }, [isHome])

  // close the mobile menu on route change / Escape; lock page scroll while open
  useEffect(() => { setOpen(false) }, [isHome])
  useEffect(() => {
    document.documentElement.classList.toggle('no-scroll', open)
    if (!open) return
    firstLink.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.documentElement.classList.remove('no-scroll') }
  }, [open])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('cobra-theme', theme) } catch { /* storage may be unavailable */ }
  }, [theme])

  const items: [SectionId, string][] = [['home', t.nav.home], ['vehicles', t.nav.vehicles], ['about', t.nav.about], ['contact', t.nav.contact]]
  const go = (id: SectionId) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    // let the menu release its scroll lock before scrolling
    window.setTimeout(() => goToSection(id, isHome), open ? 60 : 0)
  }
  const solid = scrolled || !isHome || open

  return (
    <header className={cx('nav', solid && 'is-solid', open && 'is-open')}>
      <div className="nav__bar" aria-hidden="true" />
      <div className="container nav__inner">
        <a className="nav__logo" href={HOME_HREF} onClick={go('home')} aria-label={`${siteConfig.brand} — ${t.nav.home}`}>
          <img src={asset('logo/cobra-logo.png')} alt={siteConfig.brand} width={886} height={480} decoding="async" />
        </a>

        <nav className="nav__links" aria-label={t.a11y.mainNav}>
          {items.map(([id, label]) => (
            <a key={id} href={HOME_HREF} className={cx('nav__link', isHome && active === id && 'is-active')} aria-current={isHome && active === id ? 'true' : undefined} onClick={go(id)}>
              {label}
            </a>
          ))}
        </nav>

        <div className="nav__tools">
          <button type="button" className="nav__theme" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? (lang === 'ar' ? 'تفعيل الوضع الفاتح' : 'Switch to light mode') : (lang === 'ar' ? 'تفعيل الوضع الداكن' : 'Switch to dark mode')} title={theme === 'dark' ? (lang === 'ar' ? 'الوضع الفاتح' : 'Light mode') : (lang === 'ar' ? 'الوضع الداكن' : 'Dark mode')}>
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>
          <button type="button" className="nav__lang" lang={lang === 'ar' ? 'en' : 'ar'} onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} aria-label={t.a11y.switchLang}>
            {t.nav.otherLang}
          </button>
          <button type="button" className="nav__burger" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu} onClick={() => setOpen((o) => !o)}>
            <span /><span />
          </button>
        </div>
      </div>

      <div className="menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label={t.a11y.mainNav}>
        <nav className="menu__links">
          {items.map(([id, label], i) => (
            <a key={id} ref={i === 0 ? firstLink : undefined} href={HOME_HREF} style={{ '--i': i } as React.CSSProperties} onClick={go(id)}>{label}</a>
          ))}
        </nav>
        <ul className="menu__social">
          {(Object.keys(siteConfig.social) as SocialKey[]).map((k) => (
            <li key={k}><a href={siteConfig.social[k].url} target="_blank" rel="noopener noreferrer" aria-label={t.social[k]}><SocialIcon name={k} /></a></li>
          ))}
        </ul>
      </div>
    </header>
  )
}
