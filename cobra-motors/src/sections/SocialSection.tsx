import { SocialIcon } from '../components/ui/Icons'
import { Reveal } from '../components/ui/Reveal'
import { siteConfig, type SocialKey } from '../config/site'
import { useLang } from '../i18n'

export function SocialSection() {
  const { t } = useLang()
  const keys = Object.keys(siteConfig.social) as SocialKey[]
  return (
    <section id="social" className="section social" aria-labelledby="social-title">
      <div className="container social__inner">
        <Reveal>
          <h2 id="social-title" className="h3">{t.social.title}</h2>
          <p className="lead">{t.social.text}</p>
        </Reveal>
        <ul className="social__list">
          {keys.map((k, i) => (
            <Reveal as="li" key={k} delay={i * 70}>
              <a className="social__link" href={siteConfig.social[k].url} target="_blank" rel="noopener noreferrer" aria-label={t.social[k]}>
                <span className="social__icon"><SocialIcon name={k} /></span>
                <span className="social__label">{t.social[k]}</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
