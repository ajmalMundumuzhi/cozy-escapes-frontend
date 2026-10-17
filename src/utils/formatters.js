export const formatStats = ({ guests, bedrooms, bathrooms }) =>
  `${guests} guests • ${bedrooms} bedrooms • ${bathrooms} bathrooms`

export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`