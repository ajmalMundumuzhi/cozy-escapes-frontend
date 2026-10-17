export const formatStats = ({ guests, bedrooms, bathrooms }) =>
  `${guests} guests • ${bedrooms} bedrooms • ${bathrooms} bathrooms`

export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

export const parseISODate = (s) => {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatDate = (d) =>
  d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })