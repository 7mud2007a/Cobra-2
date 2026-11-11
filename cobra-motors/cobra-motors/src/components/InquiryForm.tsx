import { useId, useState } from 'react'
import { siteConfig } from '../config/site'
import { vehicleName, type Vehicle } from '../data/vehicles'
import { useLang } from '../i18n'

const STORE = 'cobra:inquiries'

/** Simulated inquiry: validated locally, stored in localStorage only. Nothing is ever sent. */
export function InquiryForm({ vehicle, onClose }: { vehicle?: Vehicle; onClose?: () => void }) {
  const { t, fmt } = useLang()
  const uid = useId()
  const prefill = vehicle ? fmt(t.inquiry.prefill, { vehicle: vehicleName(vehicle) }) : ''
  const [vals, setVals] = useState({ name: '', contact: '', message: prefill })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [phase, setPhase] = useState<'idle' | 'sending' | 'done'>('idle')

  const set = (k: keyof typeof vals) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVals((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: false }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const err = { name: !vals.name.trim(), contact: !vals.contact.trim() }
    setErrors(err)
    if (err.name || err.contact) { (document.getElementById(`${uid}-${err.name ? 'name' : 'contact'}`) as HTMLElement | null)?.focus(); return }
    setPhase('sending')
    try {
      const list = JSON.parse(localStorage.getItem(STORE) ?? '[]') as unknown[]
      list.unshift({ ...vals, vehicleId: vehicle?.id ?? null, at: new Date().toISOString() })
      localStorage.setItem(STORE, JSON.stringify(list.slice(0, 50)))
    } catch { /* storage unavailable — the demo still completes */ }
    window.setTimeout(() => setPhase('done'), 900)
  }

  if (phase === 'done') {
    return (
      <div className="inquiry__done" role="status">
        <svg className="inquiry__check" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" /><path d="M15 27l8 8 14-16" /></svg>
        <h3>{t.inquiry.successTitle}</h3>
        <p>{fmt(t.inquiry.successText, { name: vals.name.trim() })}</p>
        {siteConfig.demoMode && <p className="inquiry__demo">{t.inquiry.demoNote}</p>}
        <div className="inquiry__actions">
          {onClose && <button type="button" className="btn btn--dark" onClick={onClose}>{t.inquiry.close}</button>}
          <button type="button" className="btn btn--line" onClick={() => { setVals({ name: '', contact: '', message: prefill }); setPhase('idle') }}>{t.inquiry.another}</button>
        </div>
      </div>
    )
  }

  return (
    <form className="inquiry" onSubmit={submit} noValidate>
      <div className={`field${errors.name ? ' has-error' : ''}`}>
        <label htmlFor={`${uid}-name`}>{t.inquiry.name}</label>
        <input id={`${uid}-name`} value={vals.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-ne` : undefined} />
        {errors.name && <p className="field__error" id={`${uid}-ne`}>{t.inquiry.required}</p>}
      </div>
      <div className={`field${errors.contact ? ' has-error' : ''}`}>
        <label htmlFor={`${uid}-contact`}>{t.inquiry.contact}</label>
        <input id={`${uid}-contact`} value={vals.contact} onChange={set('contact')} autoComplete="email tel" dir="auto" aria-invalid={!!errors.contact} aria-describedby={errors.contact ? `${uid}-ce` : undefined} />
        {errors.contact && <p className="field__error" id={`${uid}-ce`}>{t.inquiry.required}</p>}
      </div>
      <div className="field">
        <label htmlFor={`${uid}-message`}>{t.inquiry.message}</label>
        <textarea id={`${uid}-message`} rows={4} value={vals.message} onChange={set('message')} dir="auto" />
      </div>
      <button type="submit" className="btn btn--dark inquiry__submit" disabled={phase === 'sending'}>
        {phase === 'sending' ? t.inquiry.sending : t.inquiry.submit}
      </button>
      {siteConfig.demoMode && <p className="inquiry__demo">{t.inquiry.demoNote}</p>}
    </form>
  )
}
