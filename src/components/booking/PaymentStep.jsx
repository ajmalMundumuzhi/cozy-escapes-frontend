
import { useState } from 'react'
import { createCheckoutSession } from '../../services/api'

export default function PaymentStep({ booking, onBack }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const bookingData = booking?.data ?? booking
  const savedBooking = bookingData?.booking ?? bookingData

  const bookingId =
    savedBooking?._id ??
    savedBooking?.bookingId ??
    bookingData?.bookingId

  const reference = savedBooking?.reference
  const breakdown = savedBooking?.priceBreakdown
  const currency = breakdown?.currency ?? 'AUD'
  const total = Number(breakdown?.total)

  const formattedTotal = Number.isFinite(total)
    ? new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency,
      }).format(total)
    : 'Price unavailable'

  async function handlePayNow() {
    setError('')

    if (!bookingId) {
      setError('Booking ID is missing. Please restart your reservation.')
      return
    }

    try {
      setLoading(true)

      const response = await createCheckoutSession(bookingId)
      const result = response?.data ?? response
      const checkoutUrl = result?.checkoutUrl

      if (!checkoutUrl) {
        throw new Error('Stripe did not return a checkout URL.')
      }

      if (!checkoutUrl.startsWith('https://checkout.stripe.com/')) {
        throw new Error('The checkout URL returned by the server is invalid.')
      }

      window.location.assign(checkoutUrl)
    } catch (err) {
      setError(err.message || 'Unable to start checkout. Please try again.')
      setLoading(false)
    }
  }

  return (
    <section className="border border-gold/30 bg-white p-6 md:p-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-gold-deep">
        Reservation
      </p>

      <h2 className="mt-3 font-display text-3xl font-medium text-ink">
        Review your booking
      </h2>

      <p className="mt-3 text-sm leading-7 text-body">
        Your booking is on hold. Continue to Stripe to complete your payment.
      </p>

      <div className="mt-6 space-y-4 border-y border-gray-200 py-5">
        <div className="flex items-start justify-between gap-4">
          <span className="text-sm text-body">Booking reference</span>
          <span className="break-all text-right text-sm font-medium text-ink">
            {reference || 'Reference unavailable'}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <span className="text-sm text-body">Payment status</span>
          <span className="text-sm font-medium text-ink">Unpaid</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <span className="text-sm text-body">Total amount</span>
          <span className="text-right text-lg font-medium text-ink">
            {formattedTotal}
          </span>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handlePayNow}
        disabled={loading}
        className="mt-6 w-full bg-navy px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Redirecting to Stripe...' : 'Pay Now'}
      </button>

      <button
        type="button"
        onClick={onBack}
        disabled={loading}
        className="mt-4 w-full border border-navy px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-navy transition-colors hover:bg-navy hover:text-white disabled:opacity-60"
      >
        Back to guest details
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-body">
        Your reservation is confirmed only after the server verifies successful payment.
      </p>
    </section>
  )
}

export function SecureNote() {
  return (
    <div className="border border-gold/30 bg-white p-5">
      <p className="text-sm font-medium text-ink">Secure reservation</p>
      <p className="mt-2 text-sm leading-6 text-body">
        Payment confirmation is handled by the payment provider and verified
        by our server.
      </p>
    </div>
  )
}
