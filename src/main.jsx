import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Modal from 'react-modal'

import './index.css'
import App from './App.jsx'
import { AuthProvider } from './features/auth/AuthProvider.jsx'

Modal.setAppElement('#root');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
