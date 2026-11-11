import { useCallback, useEffect, useRef, useState } from 'react'
import type { AssistantAction, AssistantProvider } from '../../services/assistantService'
import { assistantConfig } from '../../data/assistantConfig'
import { useLang } from '../../i18n'
import type { Lang } from '../../lib/format'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  lang: Lang
  actions?: AssistantAction[]
}

const KEY = 'cobra:chat'
const load = (): { messages: ChatMessage[]; focus: string[]; suggestions?: string[] } => {
  try { return JSON.parse(sessionStorage.getItem(KEY) ?? '') } catch { return { messages: [], focus: [] } }
}
const sleep = (ms: number) => new Promise((r) => window.setTimeout(r, ms))
let seq = 0
const mid = () => `m${Date.now().toString(36)}${seq++}`

/** Chat state. Knows nothing about *how* answers are produced — that is the injected provider. */
export function useAssistantChat(provider: AssistantProvider) {
  const { lang, t } = useLang()
  const initial = useRef(load()).current
  const [messages, setMessages] = useState<ChatMessage[]>(initial.messages ?? [])
  const [suggestions, setSuggestions] = useState<string[] | undefined>(initial.suggestions)
  const [typing, setTyping] = useState(false)
  const focus = useRef<string[]>(initial.focus ?? [])

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify({ messages, focus: focus.current, suggestions })) } catch { /* ignore */ }
  }, [messages, suggestions])

  const send = useCallback(async (raw: string) => {
    const text = raw.trim()
    if (!text || typing) return
    setMessages((m) => [...m, { id: mid(), role: 'user', text, lang }])
    setSuggestions(undefined)
    setTyping(true)
    const { min, max } = assistantConfig.typingDelay
    try {
      const [reply] = await Promise.all([provider.reply(text, { uiLang: lang, lastFocusIds: focus.current }), sleep(min + Math.random() * (max - min))])
      if (reply.focusIds?.length) focus.current = reply.focusIds
      setMessages((m) => [...m, { id: mid(), role: 'assistant', text: reply.text, lang: reply.lang, actions: reply.actions }])
      setSuggestions(reply.suggestions)
    } catch {
      setMessages((m) => [...m, { id: mid(), role: 'assistant', text: t.assistant.error, lang }])
    } finally {
      setTyping(false)
    }
  }, [provider, lang, typing, t.assistant.error])

  const reset = useCallback(() => { setMessages([]); setSuggestions(undefined); focus.current = [] }, [])
  return { messages, suggestions, typing, send, reset }
}
