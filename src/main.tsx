import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LifeInsuranceProvider } from './context/LifeInsuranceContext.tsx'
import { InsuranceApplicationProvider } from './context/InsuranceApplicationContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InsuranceApplicationProvider>
      <LifeInsuranceProvider>
    <App />
    </LifeInsuranceProvider>
    </InsuranceApplicationProvider>
  </StrictMode>,
)
