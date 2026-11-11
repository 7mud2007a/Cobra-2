import { InquiryForm } from '../components/InquiryForm'
import { Reveal } from '../components/ui/Reveal'
import { siteConfig } from '../config/site'
import { useLang } from '../i18n'

export function ContactSection() {
  const { t, lang } = useLang()
  const c = siteConfig.contact
  const rows: [string, string, string | undefined][] = [
    [t.contact.phone, c.phone, c.phone ? `tel:${c.phone.replace(/\s/g, '')}` : undefined],
    [t.contact.whatsapp, c.whatsapp ? `+${c.whatsapp}` : '', c.whatsapp ? `https://wa.me/${c.whatsapp}` : undefined],
    [t.contact.email, c.email, c.email ? `mailto:${c.email}` : undefined],
    [t.contact.address, c.address[lang], undefined],
    [t.contact.hours, c.hours[lang], undefined],
  ]
  const shown = rows.filter(([, v]) => v)
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <Reveal>
          <h2 id="contact-title" className="h2">{t.contact.title}</h2>
          <p className="lead">{t.contact.intro}</p>
          {shown.length > 0 ? (
            <dl className="contact__list">
              {shown.map(([k, v, href]) => (
                <div key={k}><dt>{k}</dt><dd>{href ? <a href={href}><bdi>{v}</bdi></a> : v}</dd></div>
              ))}
            </dl>
          ) : (
            <p className="contact__pending">{t.contact.pending}</p>
          )}
        </Reveal>
        <Reveal delay={140} className="contact__form"><InquiryForm /></Reveal>
      </div>
    </section>
  )
}
