import { apiRequest } from './http'

const GUESTY_BOOKING_SITE = 'https://avantaliving.guestybookings.com'

// All Guesty properties (listing page)
export async function getGuestyProperties() {
  const result = await apiRequest('/guesty/properties')
  return Array.isArray(result?.data) ? result.data : []
}

// One property (detail page)
export async function getGuestyPropertyById(id) {
  if (!id) throw new Error('Property ID is required.')

  const result = await apiRequest(
    `/guesty/properties/${encodeURIComponent(id)}`
  )

  return result?.data || null
}

// Featured section on the home page
export async function getFeaturedGuestyProperties(limit = 3) {
  const properties = await getGuestyProperties()
  return properties.slice(0, limit)
}

// Hero slideshow: first image of each property only
export async function getGuestyHeroSlides() {
  const properties = await getGuestyProperties()

  return properties
    .filter((property) => property.image)
    .map((property) => ({
      id: property.id,
      title: property.title,
      location: property.location,
      image: property.image,
    }))
}

// ---------- Booking redirect ----------

function toDateParam(value) {
  if (!value) return ''
  if (typeof value === 'string') return value.slice(0, 10)

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Used by "Book now" on the property detail page
export function buildGuestyBookingUrl({
  propertyId,
  checkIn,
  checkOut,
  guests,
} = {}) {
  if (!propertyId) throw new Error('Property ID is required.')

  const url = new URL(
    `${GUESTY_BOOKING_SITE}/en/properties/${encodeURIComponent(propertyId)}`
  )

  const checkInParam = toDateParam(checkIn)
  const checkOutParam = toDateParam(checkOut)

  if (checkInParam) url.searchParams.set('checkIn', checkInParam)
  if (checkOutParam) url.searchParams.set('checkOut', checkOutParam)
  if (guests) url.searchParams.set('minOccupancy', String(guests))

  return url.toString()
}