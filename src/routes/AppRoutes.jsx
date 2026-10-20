
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import TermsPage from '../pages/TermsPage'
import ListingsPage from '../pages/ListingsPage'
import PropertyDetailPage from '../pages/PropertyDetailPage'
import InquiryPage from '../pages/InquiryPage'
import BookingPage from '../pages/BookingPage'
import PaymentSuccess from '../pages/PaymentSuccess'
import PaymentCancelled from '../pages/PaymentCancelled'
import AdminProtectedRoute from '../components/admin/AdminProtectedRoute'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminProperties from '../pages/admin/AdminProperties'
import AdminPropertyForm from '../pages/admin/AdminPropertyForm'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/accommodations" element={<ListingsPage />} />
        <Route path="/about-alvanta" element={<AboutPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route
          path="/accommodations/property/:id"
          element={<PropertyDetailPage />}
        />
        <Route
          path="/accommodations/property/:id/inquiry"
          element={<InquiryPage />}
        />
        <Route
          path="/accommodations/property/:id/book"
          element={<BookingPage />}
        />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancelled" element={<PaymentCancelled />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<AdminProtectedRoute />}>
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path='/admin/properties' element={<AdminProperties />} />
        <Route path='/admin/properties/new' element={<AdminPropertyForm />} />
        <Route path='/admin/properties/:id/edit' element={<AdminPropertyForm />} />
        
      </Route>
    </Routes>
  )
}
