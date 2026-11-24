
import { useEffect, useState } from 'react'
import {
  getGuestyProperties,
  getGuestyPropertyById,
} from '../services/guesty.service'
import { fallbackDescription } from '../data/propertyDetails'

function toParagraphs(publicDescription) {
  const text = [publicDescription?.summary, publicDescription?.space]
    .filter(Boolean)
    .join('\n\n')

  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return paragraphs.length > 0 ? paragraphs : fallbackDescription
}

function normalizeGuestyProperty(property) {
  const id = String(property.id ?? property._id)
  const reviews = property.reviews || {}

  const images = Array.isArray(property.images)
    ? property.images.map((image) => image.url).filter(Boolean)
    : []

  const image = images[0] || property.image || ''

  const amenities = Array.isArray(property.amenities)
    ? property.amenities
    : []

  const rawRating =
    property.rating ??
    reviews.avg ??
    reviews.average ??
    reviews.averageRating ??
    reviews.averageScore ??
    null

  const rating =
    rawRating !== null && rawRating !== ''
      ? Number(rawRating)
      : null

  const rawReviewCount =
    reviews.total ??
    reviews.count ??
    reviews.numberOfReviews ??
    reviews.totalReviews ??
    0

  const reviewCount = Math.max(0, Number(rawReviewCount) || 0)

  return {
    ...property,
    id,
    title: property.title || 'Untitled property',
    image,
    images,
    amenities,
    rating: Number.isFinite(rating)
      ? Math.min(5, Math.max(0, rating > 5 ? rating / 2 : rating))
      : null,
    reviewCount,
    reviews,
    guests: Number(property.guests) || 0,
    bedrooms: Number(property.bedrooms) || 0,
    bathrooms: Number(property.bathrooms) || 0,
    location: property.address?.city || property.location || null,
    description: toParagraphs(property.publicDescription),
    gallery: images.length > 0 ? images : image ? [image] : [],
    amenityGroups: [{ title: 'Highlights', items: amenities }],
  }
}

export default function useGuestyProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadProperties() {
      try {
        setLoading(true)
        setError(null)

        const list = await getGuestyProperties()

        if (!cancelled) {
          setProperties(list.map(normalizeGuestyProperty))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load properties.')
          setProperties([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProperties()

    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = () => setAttempt((n) => n + 1)

  return { properties, loading, error, retry }
}

export function useGuestyPropertyState(id) {
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadProperty() {
      if (!id) {
        setProperty(null)
        setError('A property ID is required.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        setProperty(null)

        const result = await getGuestyPropertyById(id)

        if (!result) {
          throw new Error('The server returned no property data.')
        }

        if (!cancelled) {
          setProperty(normalizeGuestyProperty(result))
        }
      } catch (err) {
        if (!cancelled) {
          setProperty(null)
          setError(err.message || 'Unable to load this property.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProperty()

    return () => {
      cancelled = true
    }
  }, [id])

  return { property, loading, error }
}
