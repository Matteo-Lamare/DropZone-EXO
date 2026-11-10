import { BrowserRouter, HashRouter, Link, Route, Routes } from 'react-router'
import { DropDetailPage } from './pages/DropDetailPage'
import { DropListPage } from './pages/DropListPage'

function AppContent() {
  return (
    <>
      <header className="topbar">
        <Link to="/" className="logo">
          Drop<span>Zone</span>
        </Link>
        <span className="tagline">Sneakers en édition limitée</span>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<DropListPage />} />
          <Route path="/drops/:id" element={<DropDetailPage />} />
          <Route path="*" element={<p>Page introuvable.</p>} />
        </Routes>
      </main>
    </>
  )
}

export function App() {
  const basename = import.meta.env.BASE_URL
  if (import.meta.env.VITE_ROUTER_MODE === 'hash') {
    return (
      <HashRouter basename={basename}>
        <AppContent />
      </HashRouter>
    )
  }
  return (
    <BrowserRouter basename={basename}>
      <AppContent />
    </BrowserRouter>
  )
}
