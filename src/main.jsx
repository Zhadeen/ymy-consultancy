import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootEl = document.getElementById('root')
const tree = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Prerendered routes ship server-rendered HTML inside #root → hydrate it so the
// static content stays put. SPA-fallback routes ship an empty #root → plain
// client render.
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, tree)
} else {
  createRoot(rootEl).render(tree)
}
