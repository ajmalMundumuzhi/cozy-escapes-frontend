
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
