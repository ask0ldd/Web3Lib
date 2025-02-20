import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StoreProvider } from './contexts/StoreContext.tsx'
import { RouterProvider } from './router/RouterProvider.tsx'
import Page1 from './pages/Page1.tsx'
import Page2 from './pages/Page2.tsx'
import Route from './components/Route.tsx'
import Item from './pages/Item.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <RouterProvider base={'http://localhost:5173'}>
        <Route path={''} element={<App/>}/>
        <Route path={'/test1'} element={<Page1/>}/>
        <Route path={'/test2'} element={<Page2/>}/>
        <Route path={'/item/:id'} element={<Item/>}/>
      </RouterProvider>
    </StoreProvider>
  </StrictMode>,
)