import type { Vehicle } from '../data/vehicles'
import { vehicleName } from '../data/vehicles'
import { useLang } from '../i18n'
import { asset, cx, formatKm, formatPrice } from '../lib/format'
import { vehicleHref } from '../lib/nav'
import { StatusBadge } from './ui/StatusBadge'

export function VehicleCard({ v }: { v: Vehicle }) {
  const { t, lang } = useLang()
  const name = vehicleName(v)
  const specs: [string, React.ReactNode][] = [
    [t.spec.engine, <bdi key="e">{v.engine}</bdi>],
    [t.spec.transmission, v.transmission[lang]],
    [t.spec.fuel, t.fuel[v.fuel]],
    [t.spec.mileage, <bdi key="m">{formatKm(v.mileage, lang)}</bdi>],
  ]
  return (
    <article className={cx('vcard', `vcard--${v.status}`)}>
      <a className="vcard__media" href={vehicleHref(v.id)} tabIndex={-1} aria-hidden="true">
        <img src={asset(v.images[0])} alt={name} width={1600} height={1000} loading="lazy" decoding="async" />
      </a>
      <div className="vcard__status"><StatusBadge status={v.status} /></div>
      <div className="vcard__body">
        <div className="vcard__head">
          <span className="vcard__make"><bdi>{v.make}</bdi></span>
          <span className="vcard__year">{v.year}</span>
        </div>
        <h3 className="vcard__model"><bdi>{v.model}</bdi></h3>
        <dl className="vcard__specs">
          {specs.map(([k, val]) => (
            <div key={k}><dt>{k}</dt><dd>{val}</dd></div>
          ))}
        </dl>
        <div className="vcard__foot">
          <p className="vcard__price"><bdi>{formatPrice(v.price)}</bdi></p>
          <a className="btn btn--dark" href={vehicleHref(v.id)} aria-label={`${t.vehicles.viewDetails}: ${name}`}>{t.vehicles.viewDetails}</a>
        </div>
      </div>
    </article>
  )
}
