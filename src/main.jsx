import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import './styles/tokens.css'
import './styles/base.css'
import Layout from './components/Layout.jsx'
import { shouldPlayIntro } from './components/Intro.jsx'
import Home from './pages/Home.jsx'
import { ToastProvider } from './lib/toast.jsx'

if (shouldPlayIntro()) document.documentElement.dataset.intro = ''

// Home ships in the main bundle; every other page (and Leaflet with it) loads on demand.
const page = (load) => ({ lazy: async () => ({ Component: (await load()).default }) })

const router = createBrowserRouter([
  {
    Component: Layout,
    HydrateFallback: () => null,
    children: [
      { index: true, Component: Home },
      { path: 'pantau', ...page(() => import('./pages/Monitor.jsx')) },
      { path: 'prakiraan', ...page(() => import('./pages/Forecast.jsx')) },
      { path: 'berita', ...page(() => import('./pages/News.jsx')) },
      { path: 'edukasi', ...page(() => import('./pages/Education.jsx')) },
      { path: 'tentang', ...page(() => import('./pages/About.jsx')) },
      { path: '*', ...page(() => import('./pages/NotFound.jsx')) },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </StrictMode>,
)
