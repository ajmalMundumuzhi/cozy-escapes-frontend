import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import TermsPage from '../pages/TermsPage'
import ListingsPage from '../pages/ListingsPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path='/accommodations' element={<ListingsPage />} />
        <Route path='/about-alvanta' element={<AboutPage />} />
        <Route path='/terms' element={<TermsPage />} />
        <Route path="*" element={<p className="px-4 py-24 text-center">Coming soon</p>} />
      </Route>
    </Routes>
  )
}