import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

// Pages that begin with a photo or a navy banner: the header floats over them
const OVERLAY_PAGES = new Set([
  '/',
  '/accommodations',
  '/about-cozy-escapes',
  '/terms-and-conditions',
  '/contact',
])

export default function Layout() {
  const { pathname } = useLocation()
  const overlay = OVERLAY_PAGES.has(pathname.replace(/\/$/, '') || '/')

  return (
    <div className="flex min-h-screen flex-col">
      <Header overlay={overlay} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}