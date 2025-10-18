
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { useGameStore } from './store/useGameStore'

function Root() {
  const lang = useGameStore(s => s.lang)
  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <App />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
