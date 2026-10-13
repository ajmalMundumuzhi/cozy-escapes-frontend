import properties from '../data/properties.json'

// Later: replace with a fetch to the Express API. Components won't need to change.
export default function useProperties() {
  return { properties, loading: false, error: null }
}