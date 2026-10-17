import { plural } from '../../utils/formatters'

function Row({ label, value, children }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0 text-gold-deep"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
      <dt className="w-32 text-[15px] text-body">{label}</dt>
      <dd className="text-[16px] font-medium text-ink">{value}</dd>
    </div>
  )
}

export default function PropertyInfo({ guests, bedrooms, bathrooms, location }) {
  return (
    <div className="border border-gold bg-white p-7 md:p-10">
      <h2 className="font-display text-3xl font-medium tracking-tight text-ink">Details</h2>
      <span className="mt-4 block h-px w-12 bg-gold" />

      <dl className="mt-4 divide-y divide-gold/30">
        <Row label="Guests" value={guests}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </Row>
        <Row label="Bedrooms" value={bedrooms}>
          <path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 00-3-3h-7v5" />
          <circle cx="7" cy="11" r="1.5" />
        </Row>
        <Row label="Bathrooms" value={bathrooms}>
          <path d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3zM6 12V6a2 2 0 013.5-1.3M7 19l-1 2M17 19l1 2" />
        </Row>
        {location && (
          <Row label="Location" value={location}>
            <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </Row>
        )}
      </dl>
    </div>
  )
}