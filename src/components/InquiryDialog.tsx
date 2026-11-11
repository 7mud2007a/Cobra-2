import { useEffect, useRef } from 'react'
import { vehicleName, type Vehicle } from '../data/vehicles'
import { useLang } from '../i18n'
import { InquiryForm } from './InquiryForm'
import { CloseIcon } from './ui/Icons'

/** Native <dialog>: focus trap, Escape to close and inert background come for free. */
export function InquiryDialog({ vehicle, open, onClose }: { vehicle: Vehicle; open: boolean; onClose: () => void }) {
  const { t, fmt } = useLang()
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) { d.showModal(); document.documentElement.classList.add('no-scroll') }
    if (!open && d.open) d.close()
    return () => { document.documentElement.classList.remove('no-scroll') }
  }, [open])
  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="inq-title"
      onClose={() => { document.documentElement.classList.remove('no-scroll'); onClose() }}
      onClick={(e) => { if (e.target === ref.current) onClose() }}
    >
      <div className="dialog__panel">
        <button type="button" className="dialog__close" onClick={onClose} aria-label={t.a11y.close}><CloseIcon /></button>
        <h2 id="inq-title" className="dialog__title">{fmt(t.inquiry.titleVehicle, { vehicle: '' })}<bdi>{vehicleName(vehicle)}</bdi></h2>
        {open && <InquiryForm vehicle={vehicle} onClose={onClose} />}
      </div>
    </dialog>
  )
}
