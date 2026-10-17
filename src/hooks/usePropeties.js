import properties from '../data/properties.json'
import { details, fallbackDescription, makeGallery } from '../data/propertyDetails'

export default function useProperties() {
  return { properties, loading: false, error: null }
}

export function useProperty(id) {
  const base = properties.find((p) => p.id === id)
  if (!base) return null

  const extra = details[id]
  return {
    ...base,
    location: extra?.location ?? null,
    description: extra?.description ?? fallbackDescription,
    gallery: extra?.gallery ?? [base.image, ...makeGallery(id, 7)],
    amenityGroups: extra?.amenityGroups ?? [{ title: 'Highlights', items: base.amenities }],
  }
}