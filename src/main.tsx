import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StoreProvider } from './contexts/StoreContext.tsx'
import { RouterProvider } from './contexts/RouterContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </RouterProvider>
  </StrictMode>,
)
