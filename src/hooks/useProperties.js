
import { useEffect, useState } from 'react'
import { apiRequest } from '../services/http'
import {
  details,
  fallbackDescription,
  makeGallery,
} from '../data/propertyDetails'

function normalizeProperty(property) {
  const id = String(property.propertyId ?? property.id)
  const extra = details[id]

  const images = Array.isArray(property.images)
    ? property.images
        .slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((image) => image.url)
        .filter(Boolean)
    : []

  const image = images[0] || property.image || ''
  const amenities = Array.isArray(property.amenities)
    ? property.amenities
    : []

  return {
    ...property,
    id,
    image,
    amenities,
    location: extra?.location ?? property.location ?? null,
    description:
      extra?.description ??
      property.description ??
      fallbackDescription,
    gallery:
      extra?.gallery ??
      (images.length > 0 ? images : [image, ...makeGallery(id, 7)]),
    amenityGroups:
      extra?.amenityGroups ??
      property.amenityGroups ?? [
        { title: 'Highlights', items: amenities },
      ],
    bookUrl: `/accommodations/property/${id}/book`,
  }
}

// Fetch all properties for listing pages
export default function useProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadProperties() {
      try {
        setLoading(true)
        setError(null)

        const result = await apiRequest('/properties')

        if (!Array.isArray(result.data)) {
          throw new Error('The server returned an invalid property list.')
        }

        if (!cancelled) {
          setProperties(result.data.map(normalizeProperty))
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
  }, [])

  return { properties, loading, error }
}

// Fetch a single property and return the property directly.
// Retained for components that already use useProperty(id).
export function useProperty(id) {
  const [property, setProperty] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadProperty() {
      if (!id) {
        setProperty(null)
        return
      }

      try {
        const result = await apiRequest(
          `/properties/${encodeURIComponent(id)}`
        )

        if (!result.data) {
          throw new Error('The server returned no property data.')
        }

        if (!cancelled) {
          setProperty(normalizeProperty(result.data))
        }
      } catch {
        if (!cancelled) {
          setProperty(null)
        }
      }
    }

    setProperty(null)
    loadProperty()

    return () => {
      cancelled = true
    }
  }, [id])

  return property
}

// Fetch a single property with loading and error states.
// Used by PropertyDetailPage.jsx.
export function usePropertyState(id) {
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

        const result = await apiRequest(
          `/properties/${encodeURIComponent(id)}`
        )

        if (!result.data) {
          throw new Error('The server returned no property data.')
        }

        if (!cancelled) {
          setProperty(normalizeProperty(result.data))
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
