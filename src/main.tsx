import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initGA } from './lib/analytics'

// Initialize Google Analytics (reads VITE_GA_MEASUREMENT_ID if set)
initGA()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
