import { AssistantChat } from '../components/assistant/AssistantChat'
import { Reveal } from '../components/ui/Reveal'
import { assistantConfig } from '../data/assistantConfig'
import { useLang } from '../i18n'
import { assistantProvider } from '../services/assistantService'

export function AssistantSection() {
  const { t } = useLang()
  return (
    <section id="assistant" className="section assistant" aria-labelledby="assistant-title">
      <div className="container assistant__grid">
        <Reveal className="assistant__copy">
          <h2 id="assistant-title" className="h2">{t.assistant.title}</h2>
          <p className="lead">{t.assistant.text}</p>
          {assistantConfig.isDemo && <p className="assistant__disclaimer">{t.assistant.disclaimer}</p>}
        </Reveal>
        <Reveal delay={140}><AssistantChat provider={assistantProvider} /></Reveal>
      </div>
    </section>
  )
}
