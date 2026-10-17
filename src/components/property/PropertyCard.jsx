import { Link } from 'react-router-dom'
import { plural } from '../../utils/formatters'

function Stat({ label, children }) {
  return (
    <li className="flex items-center gap-2">
      <svg
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] shrink-0 text-gold-deep"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
      <span>{label}</span>
    </li>
  )
}

export default function PropertyCard({ property }) {
  const { id, title, image, rating, guests, bedrooms, bathrooms, amenities, bookUrl } = property

  // "Name | Highlights" -> main title + gold subtitle
  const [main, ...rest] = title.split('|')
  const sub = rest.join('|').trim()
  const detailPath = `/accommodations/property/${id}`

  return (
    <article className="group flex h-full flex-col bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={detailPath} className="relative block overflow-hidden" tabIndex={-1} aria-hidden="true">
        <img
          src={image}
          alt=""
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 flex items-center gap-1.5 bg-white/95 px-3 py-1.5 text-[13px] font-medium text-ink shadow-sm">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-gold" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {rating}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[22px] font-medium leading-snug text-ink">
          <Link to={detailPath} className="transition-colors hover:text-gold-deep">
            {main.trim()}
          </Link>
        </h3>
        {sub && (
          <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.14em] text-gold-deep">{sub}</p>
        )}

        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-gold/30 pt-5 text-[14px] text-body">
          <Stat label={plural(guests, 'guest')}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </Stat>
          <Stat label={plural(bedrooms, 'bedroom')}>
            <path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 00-3-3h-7v5" />
            <circle cx="7" cy="11" r="1.5" />
          </Stat>
          <Stat label={plural(bathrooms, 'bathroom')}>
            <path d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3zM6 12V6a2 2 0 013.5-1.3M7 19l-1 2M17 19l1 2" />
          </Stat>
        </ul>

        <ul className="mt-5 flex flex-wrap gap-2">
          {amenities.slice(0, 3).map((a) => (
            <li key={a} className="rounded-full border border-gold/40 px-3 py-1 text-[12px] text-ink">
              {a}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex gap-3 pt-7">
          <a
            href={bookUrl}
            className="flex-1 bg-gold-deep py-3 text-center text-[12px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-navy"
          >
            Book Now
          </a>
          <Link
            to={detailPath}
            className="flex-1 border border-navy py-3 text-center text-[12px] font-medium uppercase tracking-[0.18em] text-navy transition-colors hover:bg-navy hover:text-white"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  )
}