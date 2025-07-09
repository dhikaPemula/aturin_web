import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { DataRefreshProvider } from './core/context/DataRefreshContext'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <DataRefreshProvider>
        <App />
      </DataRefreshProvider>
    </BrowserRouter>
  </StrictMode>,
)