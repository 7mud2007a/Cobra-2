import { useEffect, useRef, useState } from 'react'
import { assistantConfig } from '../../data/assistantConfig'
import { getVehicle, vehicleName } from '../../data/vehicles'
import { useLang } from '../../i18n'
import { cx } from '../../lib/format'
import { scrollToSection, vehicleHref } from '../../lib/nav'
import type { AssistantProvider } from '../../services/assistantService'
import { ChatIcon, SendIcon } from '../ui/Icons'
import { useAssistantChat, type ChatMessage } from './useAssistantChat'

function Bubble({ m }: { m: ChatMessage }) {
  const { t, fmt } = useLang()
  return (
    <li className={cx('chat__msg', `chat__msg--${m.role}`)}>
      <span className="chat__who">{m.role === 'user' ? t.assistant.you : t.assistant.name}</span>
      <div className="chat__bubble" dir={m.lang === 'ar' ? 'rtl' : 'ltr'} lang={m.lang}>{m.text}</div>
      {m.actions && m.actions.length > 0 && (
        <div className="chat__actions">
          {m.actions.map((a) => {
            if (a.kind === 'vehicle') {
              const v = getVehicle(a.id)
              return v ? <a key={a.id} className="chat__action" href={vehicleHref(a.id)}>{fmt(t.assistant.open, { name: vehicleName(v) })}</a> : null
            }
            return <button key="contact" type="button" className="chat__action" onClick={() => scrollToSection('contact')}>{t.assistant.openContact}</button>
          })}
        </div>
      )}
    </li>
  )
}

/** Presentational chat. Receives an AssistantProvider, so the answering logic can be replaced freely. */
export function AssistantChat({ provider }: { provider: AssistantProvider }) {
  const { t, lang } = useLang()
  const { messages, suggestions, typing, send, reset } = useAssistantChat(provider)
  const [draft, setDraft] = useState('')
  const log = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = log.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [messages, typing])

  const chips = suggestions ?? (messages.length === 0 ? assistantConfig.suggestions[lang] : [])
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (draft.trim()) { void send(draft); setDraft('') } }

  return (
    <div className="chat">
      <header className="chat__head">
        <span className="chat__avatar" aria-hidden="true"><ChatIcon /></span>
        <div className="chat__title">
          <p>{t.assistant.name}</p>
          {assistantConfig.isDemo && <span className="chat__badge">{t.assistant.demoBadge}</span>}
        </div>
        <button type="button" className="chat__reset" onClick={reset} disabled={messages.length === 0}>{t.assistant.reset}</button>
      </header>

      <ul className="chat__log" ref={log} role="log" aria-live="polite" aria-label={t.assistant.log}>
        <li className="chat__msg chat__msg--assistant">
          <span className="chat__who">{t.assistant.name}</span>
          <div className="chat__bubble">{assistantConfig.welcome[lang]}</div>
        </li>
        {messages.map((m) => <Bubble key={m.id} m={m} />)}
        {typing && (
          <li className="chat__msg chat__msg--assistant" aria-label={t.assistant.typing}>
            <div className="chat__bubble chat__typing" role="status"><i /><i /><i /></div>
          </li>
        )}
      </ul>

      {chips.length > 0 && (
        <div className="chat__chips">
          {chips.map((s) => <button key={s} type="button" className="chip" disabled={typing} onClick={() => void send(s)}>{s}</button>)}
        </div>
      )}

      <form className="chat__form" onSubmit={submit}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={t.assistant.placeholder} aria-label={t.assistant.placeholder} enterKeyHint="send" autoComplete="off" dir="auto" maxLength={300} />
        <button type="submit" className="chat__send" disabled={!draft.trim() || typing} aria-label={t.assistant.send}><SendIcon /></button>
      </form>
    </div>
  )
}
