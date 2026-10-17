import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <Header overlay={pathname === '/'} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}