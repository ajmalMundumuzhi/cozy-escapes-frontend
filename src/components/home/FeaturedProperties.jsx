import { useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import useProperties from '../../hooks/useProperties'
import useMediaQuery from '../../hooks/useMediaQuery'
import { formatStats } from '../../utils/formatters'

// Card height by distance from the selected card (selected, next to it, further away)
const HEIGHTS = [600, 520, 440]

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-gold" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

// All the property data, shown on the selected card
function Details({ property }) {
  const { id, title, rating, amenities } = property
  const shown = amenities.slice(0, 3)
  const more = amenities.length - shown.length

  const chip = 'max-w-full truncate rounded-full border border-white/40 px-3 py-1 text-[12px]'

  return (
    <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
      <div className="flex items-center gap-2 text-sm">
        <Star />
        <span>{rating}</span>
      </div>

      <h3 className="mt-3 line-clamp-3 font-display text-2xl font-medium leading-snug md:text-3xl">
        {title}
      </h3>

      <p className="mt-3 text-[15px] text-white/80">{formatStats(property)}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {shown.map((a) => (
          <li key={a} className={chip}>
            {a}
          </li>
        ))}
        {more > 0 && (
          <li>
            <Link
              to={`/accommodations/property/${id}`}
              className="block rounded-full border border-gold px-3 py-1 text-[12px] text-gold transition-colors hover:bg-gold hover:text-navy"
            >
              +{more} more
            </Link>
          </li>
        )}
      </ul>

      <div className="mt-6 flex gap-3">
        {/* <Link
          to={`/accommodations/property/${id}/book`}
          className="flex-1 whitespace-nowrap bg-gold-deep px-4 py-3 text-center text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-navy"
        >
          Book Now
        </Link> */}
        <Link
          to={`/accommodations/property/${id}`}
          className="flex-1 whitespace-nowrap border border-white/50 px-4 py-3 text-center text-[12px] font-medium uppercase tracking-[0.14em] transition-colors hover:bg-white hover:text-navy"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default function FeaturedProperties() {
  const { properties } = useProperties()
  const items = properties.slice(0, 6)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [active, setActive] = useState(Math.floor((items.length - 1) / 2))

  const prev = () => setActive((a) => Math.max(0, a - 1))
  const next = () => setActive((a) => Math.min(items.length - 1, a + 1))

  const arrow =
    'flex h-9 w-9 items-center justify-center border border-white/40 text-white transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent'

  return (
    <section className="bg-navy py-16 text-white md:py-24">
      <Container>
        {/* Heading */}
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="font-display text-5xl font-medium tracking-tight md:text-[48px]">
            Reserve Your Escape
          </h2>
          <p className="mt-5 text-[17px] leading-7 text-white/70">
            We manage every aspect of your short-term rental with care and precision. From guest
            screening to professional upkeep, your home is protected, maintained, and optimised to
            deliver strong returns.
          </p>
        </div>

        {isDesktop ? (
          <>
            {/* Desktop: selected card expands, the rest get narrower and shorter */}
            <div className="mt-14 flex items-end gap-3">
              {items.map((p, i) => {
                const isActive = i === active
                const distance = Math.abs(i - active)

                return (
                  <div
                    key={p.id}
                    role={isActive ? undefined : 'button'}
                    tabIndex={isActive ? -1 : 0}
                    aria-label={isActive ? undefined : `Show ${p.title}`}
                    onClick={() => !isActive && setActive(i)}
                    onKeyDown={(e) => {
                      if (!isActive && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault()
                        setActive(i)
                      }
                    }}
                    style={{
                      flexGrow: isActive ? 4 : 1,
                      flexBasis: 0,
                      height: HEIGHTS[Math.min(distance, 2)],
                    }}
                    className={`group relative min-w-0 overflow-hidden rounded-sm transition-[flex-grow,height] duration-700 ease-out ${
                      isActive ? '' : 'cursor-pointer'
                    }`}
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />

                    {/* Small cards: title label only */}
                    {!isActive && (
                      <span className="absolute inset-x-4 top-4 line-clamp-3 text-[11px] font-medium uppercase tracking-[0.15em] text-white">
                        {p.title}
                      </span>
                    )}

                    {/* Selected card: full details */}
                    <div
                      aria-hidden={!isActive}
                      className={`transition-[opacity,visibility] duration-500 ${
                        isActive ? 'visible opacity-100 delay-300' : 'invisible opacity-0'
                      }`}
                    >
                      <Details property={p} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Arrows + progress bar */}
            <div className="mx-auto mt-10 flex max-w-[640px] items-center gap-5">
              <button type="button" onClick={prev} disabled={active === 0} aria-label="Previous property" className={arrow}>
                ←
              </button>
              <div className="h-[2px] flex-1 bg-white/25">
                <div
                  className="h-full bg-gold transition-[width] duration-700 ease-out"
                  style={{ width: `${((active + 1) / items.length) * 100}%` }}
                />
              </div>
              <button type="button" onClick={next} disabled={active === items.length - 1} aria-label="Next property" className={arrow}>
                →
              </button>
            </div>
          </>
        ) : (
          /* Tablet / mobile: swipeable cards, all details visible */
          <div className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:-mx-8 md:px-8">
            {items.map((p) => (
              <div
                key={p.id}
                className="relative h-[500px] w-[82%] shrink-0 snap-center overflow-hidden rounded-sm md:w-[46%]"
              >
                <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
                <Details property={p} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/accommodations"
            className="inline-block border border-white/50 px-10 py-3 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-white hover:text-navy"
          >
            View All
          </Link>
        </div>
      </Container>
    </section>
  )
}