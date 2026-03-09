import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { KonstaProvider } from 'konsta/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KonstaProvider theme='material'>
      <App />
    </KonstaProvider>
  </StrictMode>,
)
