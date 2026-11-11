import { useState } from 'react'
import { VehicleCard } from '../components/VehicleCard'
import { Reveal } from '../components/ui/Reveal'
import { makes, vehicles } from '../data/vehicles'
import { useLang } from '../i18n'
import { cx, vehiclesCount } from '../lib/format'
import { scrollToSection } from '../lib/nav'

export function VehiclesSection() {
  const { t, lang } = useLang()
  const [make, setMake] = useState('all')
  const list = make === 'all' ? vehicles : vehicles.filter((v) => v.make === make)

  return (
    <section id="vehicles" className="section vehicles" aria-labelledby="vehicles-title">
      <div className="container">
        <header className="section__head">
          <Reveal>
            <h2 id="vehicles-title" className="h2">{t.vehicles.title}</h2>
            <p className="lead">{t.vehicles.intro}</p>
          </Reveal>
          <Reveal className="filters" delay={120}>
            <div className="filters__row" role="group" aria-label={t.vehicles.filterLabel}>
              {['all', ...makes].map((m) => (
                <button key={m} type="button" className={cx('filter', make === m && 'is-active')} aria-pressed={make === m} onClick={() => setMake(m)}>
                  {m === 'all' ? t.vehicles.all : <bdi>{m}</bdi>}
                </button>
              ))}
            </div>
            <p className="filters__count" aria-live="polite">{vehiclesCount(list.length, lang)}</p>
          </Reveal>
        </header>

        <div className="vgrid">
          {list.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 90}><VehicleCard v={v} /></Reveal>
          ))}
          {make === 'all' && (
            <Reveal delay={(list.length % 3) * 90}>
              <button type="button" className="vtile" onClick={() => scrollToSection('assistant')}>
                <span className="vtile__title">{t.vehicles.tileTitle}</span>
                <span className="vtile__text">{t.vehicles.tileText}</span>
                <span className="vtile__cta">{t.vehicles.tileCta}</span>
              </button>
            </Reveal>
          )}
        </div>
        <p className="note">{t.vehicles.sampleNote}</p>
      </div>
    </section>
  )
}
