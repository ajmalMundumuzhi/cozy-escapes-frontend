
import { apiRequest } from './http'

export async function submitInquiry(payload) {
  return apiRequest('/inquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

function buildBookingQuery(checkin, checkout, guests) {
  return new URLSearchParams({
    checkin,
    checkout,
    guests: String(guests),
  }).toString()
}

export async function getAvailability(propertyId, checkin, checkout, guests) {
  const query = buildBookingQuery(checkin, checkout, guests)

  return apiRequest(
    `/availability/${encodeURIComponent(propertyId)}?${query}`
  )
}

export async function getPriceQuote(propertyId, checkin, checkout, guests) {
  const query = buildBookingQuery(checkin, checkout, guests)

  return apiRequest(
    `/pricing/${encodeURIComponent(propertyId)}/quote?${query}`
  )
}

export async function createBooking(payload) {
  return apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function createCheckoutSession(bookingId) {
  return apiRequest('/payments/checkout-session', {
    method: 'POST',
    body: JSON.stringify({ bookingId }),
  })
}

export async function getCheckoutStatus(sessionId) {
  return apiRequest(
    `/payments/session/${encodeURIComponent(sessionId)}`
  )
}
// export async function submitContact(payload) {
//   const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   })
//   if (!res.ok) throw new Error('Could not send message')
//   return res.json()
// }

export async function submitContact(payload) {
  return apiRequest('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}