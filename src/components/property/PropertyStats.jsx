import { plural } from '../../utils/formatters'

function Item({ label, children }) {
  return (
    <li className="flex items-center gap-3">
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 shrink-0 text-gold-deep"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
      <span className="text-[15px] text-ink">{label}</span>
    </li>
  )
}

export default function PropertyStats({ guests, bedrooms, bathrooms, rating }) {
  return (
    <ul className="grid grid-cols-2 gap-x-8 gap-y-5 border-y border-gold/40 py-6 sm:grid-cols-4">
      <Item label={plural(guests, 'guest')}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </Item>
      <Item label={plural(bedrooms, 'bedroom')}>
        <path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 00-3-3h-7v5" />
        <circle cx="7" cy="11" r="1.5" />
      </Item>
      <Item label={plural(bathrooms, 'bathroom')}>
        <path d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3zM6 12V6a2 2 0 013.5-1.3M7 19l-1 2M17 19l1 2" />
      </Item>
      <li className="flex items-center gap-3">
        <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 fill-gold" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="text-[15px] text-ink">{rating} rating</span>
      </li>
    </ul>
  )
}