import { SocialIcon } from '../components/ui/Icons'
import { siteConfig, type SocialKey } from '../config/site'
import { useLang } from '../i18n'
import { asset } from '../lib/format'
import { goToSection, HOME_HREF } from '../lib/nav'

export function Footer({ isHome }: { isHome: boolean }) {
  const { t } = useLang()
  const links: [string, string][] = [['home', t.nav.home], ['vehicles', t.nav.vehicles], ['about', t.nav.about], ['contact', t.nav.contact]]
  const keys = Object.keys(siteConfig.social) as SocialKey[]
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <a className="footer__logo" href={HOME_HREF} onClick={(e) => { e.preventDefault(); goToSection('home', isHome) }} aria-label={`${siteConfig.brand} — ${t.nav.home}`}>
          <img src={asset('logo/cobra-logo.png')} alt={siteConfig.brand} width={886} height={480} loading="lazy" decoding="async" />
        </a>
        <nav aria-label={t.footer.nav}>
          <ul className="footer__links">
            {links.map(([id, label]) => (
              <li key={id}><a href={HOME_HREF} onClick={(e) => { e.preventDefault(); goToSection(id, isHome) }}>{label}</a></li>
            ))}
          </ul>
        </nav>
        <ul className="footer__social" aria-label={t.footer.follow}>
          {keys.map((k) => (
            <li key={k}><a href={siteConfig.social[k].url} target="_blank" rel="noopener noreferrer" aria-label={t.social[k]}><SocialIcon name={k} /></a></li>
          ))}
        </ul>
      </div>
      <div className="container footer__legal">
        <p>© {new Date().getFullYear()} {siteConfig.brand}. {t.footer.rights}</p>
      </div>
      <div className="footer__credit">
        <p dir="ltr">
          Developed by{' '}
          <a href={siteConfig.developer.url} target="_blank" rel="noopener noreferrer">{siteConfig.developer.name}</a>
        </p>
      </div>
    </footer>
  )
}
