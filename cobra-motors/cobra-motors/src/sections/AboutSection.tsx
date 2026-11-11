import { Reveal } from '../components/ui/Reveal'
import { siteConfig } from '../config/site'
import { availableCount } from '../data/vehicles'
import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'
import { useLang } from '../i18n'
import { formatNumber } from '../lib/format'

function Stat({ value, label, suffix, run, delay }: { value: number; label: string; suffix?: string; run: boolean; delay: number }) {
  const n = useCountUp(value, run, 1700 + delay)
  return (
    <div className="stat">
      <dt className="stat__label">{label}</dt>
      <dd className="stat__num"><bdi>{formatNumber(n)}{suffix}</bdi></dd>
    </div>
  )
}

export function AboutSection() {
  const { t } = useLang()
  const [ref, seen] = useInView<HTMLDListElement>('0px 0px -15% 0px')
  const s = siteConfig.stats
  const stats = [
    { value: s.yearsOfExperience, label: t.about.stats.years, suffix: '+' },
    { value: s.vehiclesSold, label: t.about.stats.sold, suffix: '+' },
    { value: s.satisfiedCustomers, label: t.about.stats.customers, suffix: '+' },
    { value: availableCount(), label: t.about.stats.available },
  ]
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container">
        <div className="about__top">
          <Reveal><h2 id="about-title" className="h2 about__title">{t.about.title}</h2></Reveal>
          <Reveal delay={120}><p className="lead about__intro">{t.about.intro}</p></Reveal>
        </div>
        <ul className="values">
          {t.about.values.map((v, i) => (
            <Reveal as="li" key={v.t} delay={i * 100} className="value">
              <h3>{v.t}</h3>
              <p>{v.d}</p>
            </Reveal>
          ))}
        </ul>
        <dl className="stats" ref={ref}>
          {stats.map((st, i) => <Stat key={st.label} {...st} run={seen} delay={i * 120} />)}
        </dl>
        <p className="note">{t.about.note}</p>
      </div>
    </section>
  )
}
