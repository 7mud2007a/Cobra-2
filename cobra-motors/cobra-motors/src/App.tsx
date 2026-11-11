import { useEffect } from 'react'
import { Footer } from './sections/Footer'
import { NavBar } from './components/NavBar'
import { siteConfig } from './config/site'
import { getVehicle, vehicleName } from './data/vehicles'
import { useLang } from './i18n'
import { useRoute } from './lib/nav'
import { HomePage } from './pages/HomePage'
import { VehiclePage } from './pages/VehiclePage'

export default function App() {
  const route = useRoute()
  const { t } = useLang()
  const isHome = route.name === 'home'
  const vehicle = route.name === 'vehicle' ? getVehicle(route.id) : undefined

  useEffect(() => {
    document.title = vehicle ? `${vehicleName(vehicle)} — ${siteConfig.brand}` : t.meta.title
  }, [vehicle, t])

  return (
    <>
      <a
        className="skip"
        href="#main"
        onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}
      >
        {t.a11y.skip}
      </a>
      <NavBar isHome={isHome} />
      <div className="page" key={route.name === 'vehicle' ? route.id : 'home'}>
        {route.name === 'vehicle' ? <VehiclePage id={route.id} /> : <HomePage />}
      </div>
      <Footer isHome={isHome} />
    </>
  )
}
