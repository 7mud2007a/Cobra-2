import { useLayoutEffect, useState } from 'react'
import { Gallery } from '../components/Gallery'
import { InquiryDialog } from '../components/InquiryDialog'
import { BackIcon } from '../components/ui/Icons'
import { StatusBadge } from '../components/ui/StatusBadge'
import { getVehicle, vehicleName, vehicles } from '../data/vehicles'
import { useLang } from '../i18n'
import { formatHp, formatKm, formatPrice } from '../lib/format'
import { canPopToHome, HOME_HREF, markCameFromVehicle, vehicleHref } from '../lib/nav'

export function VehiclePage({ id }: { id: string }) {
  const { t, lang } = useLang()
  const v = getVehicle(id)
  const [inquiry, setInquiry] = useState(false)

  useLayoutEffect(() => { markCameFromVehicle(); window.scrollTo(0, 0) }, [id])

  const back = (e: React.MouseEvent) => {
    e.preventDefault()
    if (canPopToHome()) history.back() // native back → the collection restores its scroll position
    else location.hash = HOME_HREF
  }
  const backLink = (
    <a className="back" href={HOME_HREF} onClick={back}><BackIcon />{t.details.back}</a>
  )

  if (!v) {
    return (
      <main id="main" tabIndex={-1} className="vpage vpage--empty">
        <div className="container">
          {backLink}
          <h1 className="h2">{t.details.notFoundTitle}</h1>
          <p className="lead">{t.details.notFoundText}</p>
          <a className="btn btn--dark" href={HOME_HREF} onClick={back}>{t.details.browse}</a>
        </div>
      </main>
    )
  }

  const name = vehicleName(v)
  const next = vehicles[(vehicles.findIndex((x) => x.id === v.id) + 1) % vehicles.length]
  const rows: [string, React.ReactNode][] = [
    [t.spec.year, v.year],
    [t.spec.engine, <bdi key="e">{v.engine}</bdi>],
    [t.spec.power, <bdi key="p">{formatHp(v.horsepower, lang)}</bdi>],
    [t.spec.transmission, v.transmission[lang]],
    [t.spec.drivetrain, t.drivetrain[v.drivetrain]],
    [t.spec.fuel, t.fuel[v.fuel]],
    [t.spec.mileage, <bdi key="m">{formatKm(v.mileage, lang)}</bdi>],
    [t.spec.exterior, v.exteriorColor[lang]],
    [t.spec.interior, v.interiorColor[lang]],
    [t.spec.status, <StatusBadge key="s" status={v.status} />],
  ]
  const note = v.status === 'sold' ? t.details.soldNote : v.status === 'reserved' ? t.details.reservedNote : t.details.availableNote

  return (
    <main id="main" tabIndex={-1} className="vpage">
      <div className="container">
        {backLink}
        <div className="vpage__grid">
          <Gallery key={v.id} images={v.images} name={name} />
          <aside className="vinfo">
            <StatusBadge status={v.status} />
            <p className="vinfo__make"><bdi>{v.make}</bdi></p>
            <h1 className="vinfo__model"><bdi>{v.model}</bdi></h1>
            <p className="vinfo__price"><bdi>{formatPrice(v.price)}</bdi></p>
            <p className="vinfo__note">{note}</p>
            <button type="button" className="btn btn--dark btn--block" onClick={() => setInquiry(true)}>{t.details.inquire}</button>
            <dl className="vinfo__facts">
              <div><dt>{t.spec.year}</dt><dd>{v.year}</dd></div>
              <div><dt>{t.spec.mileage}</dt><dd><bdi>{formatKm(v.mileage, lang)}</bdi></dd></div>
              <div><dt>{t.spec.power}</dt><dd><bdi>{formatHp(v.horsepower, lang)}</bdi></dd></div>
            </dl>
          </aside>
        </div>

        <div className="vpage__detail">
          <section aria-labelledby="specs-title">
            <h2 id="specs-title" className="h3">{t.details.specs}</h2>
            <dl className="specs">
              {rows.map(([k, val]) => <div key={k}><dt>{k}</dt><dd>{val}</dd></div>)}
            </dl>
          </section>
          <section aria-labelledby="about-vehicle-title">
            <h2 id="about-vehicle-title" className="h3">{t.details.about}</h2>
            <p className="vpage__desc">{v.description[lang]}</p>
          </section>
        </div>

        <a className="vnext" href={vehicleHref(next.id)}>
          <span>{t.details.next}</span>
          <strong><bdi>{vehicleName(next)}</bdi></strong>
        </a>
      </div>
      <InquiryDialog vehicle={v} open={inquiry} onClose={() => setInquiry(false)} />
    </main>
  )
}
