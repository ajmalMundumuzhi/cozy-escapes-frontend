
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCheckoutStatus } from '../services/api'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function verifyPayment() {
      if (!sessionId) {
        setError('The payment session is missing.')
        setLoading(false)
        return
      }

      try {
        const response = await getCheckoutStatus(sessionId)
        const result = response?.data ?? response

        if (!cancelled) {
          if (result?.confirmed && result?.paid) {
            setBooking(result)
          } else {
            setError(
              'Your payment is processing. Please refresh this page shortly.'
            )
          }
        }
      } catch {
        if (!cancelled) {
          setError(
            'We could not verify your payment right now. Please try again shortly.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    verifyPayment()

    return () => {
      cancelled = true
    }
  }, [sessionId])

  const total = Number(booking?.priceBreakdown?.total)
  const currency = booking?.priceBreakdown?.currency || 'AUD'

  const formattedTotal = Number.isFinite(total)
    ? new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency,
      }).format(total)
    : null

  return (
    <main className="mx-auto max-w-2xl px-5 py-20">
      {loading ? (
        <section className="border border-gold/30 bg-white p-8 text-center">
          <h1 className="font-display text-3xl text-ink">
            Verifying your payment
          </h1>
          <p className="mt-3 text-sm leading-7 text-body">
            Please wait while we confirm your reservation.
          </p>
        </section>
      ) : booking ? (
        <section className="border border-gold/30 bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl text-green-700">
            ✓
          </div>

          <p className="mt-5 text-xs font-medium uppercase tracking-[0.25em] text-gold-deep">
            Avanta Living
          </p>

          <h1 className="mt-3 font-display text-3xl text-ink">
            Your booking is confirmed!
          </h1>

          <p className="mt-3 text-sm leading-7 text-body">
            Your payment has been verified and your reservation is confirmed.
          </p>

          <div className="mt-7 space-y-4 border-y border-gray-200 py-5 text-left">
            <div className="flex justify-between gap-4">
              <span className="text-sm text-body">Booking reference</span>
              <span className="break-all text-right text-sm font-medium text-ink">
                {booking.reference}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-body">Check-in</span>
              <span className="text-right text-sm font-medium text-ink">
                {booking.checkin
                  ? new Date(booking.checkin).toLocaleDateString()
                  : '—'}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-body">Check-out</span>
              <span className="text-right text-sm font-medium text-ink">
                {booking.checkout
                  ? new Date(booking.checkout).toLocaleDateString()
                  : '—'}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-body">Guests</span>
              <span className="text-right text-sm font-medium text-ink">
                {booking.guests ?? '—'}
              </span>
            </div>

            {formattedTotal && (
              <div className="flex justify-between gap-4">
                <span className="text-sm text-body">Total paid</span>
                <span className="text-right text-lg font-medium text-ink">
                  {formattedTotal}
                </span>
              </div>
            )}
          </div>

          <Link
            to="/"
            className="mt-7 inline-block w-full bg-navy px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-navy/90"
          >
            Return to home
          </Link>
        </section>
      ) : (
        <section className="border border-gold/30 bg-white p-8 text-center">
          <h1 className="font-display text-3xl text-ink">
            Payment confirmation pending
          </h1>

          <p role="status" className="mt-3 text-sm leading-7 text-body">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-navy px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-white"
          >
            Check again
          </button>

          <Link to="/" className="mt-4 inline-block text-sm text-body underline">
            Return to home
          </Link>
        </section>
      )}
    </main>
  )
}
