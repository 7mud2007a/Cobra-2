import { createRoot } from 'react-dom/client'
import App from './App'
import { LangProvider } from './i18n'
import './styles/fonts.css'
import './styles/base.css'
import './styles/chrome.css'
import './styles/home.css'
import './styles/details.css'
import './styles/assistant.css'

// Scroll position is managed by the app (see lib/nav.ts + HomePage), not the browser.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')!).render(
  <LangProvider>
    <App />
  </LangProvider>,
)
