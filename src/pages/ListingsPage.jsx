import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Container from '../components/ui/Container'
import FilterTabs from '../components/property/FilterTabs'
import PropertyGrid from '../components/property/PropertyGrid'
import useProperties from '../hooks/useProperties'
import { plural } from '../utils/formatters'

const BEDROOMS = ['1', '2', '3']

export default function ListingsPage() {
  const { properties } = useProperties()
  const [params, setParams] = useSearchParams()

  // Filters live in the URL, so the home-page search and shared links both work
  const bedrooms = BEDROOMS.includes(params.get('bedrooms')) ? params.get('bedrooms') : 'all'
  const guests = Number(params.get('guests')) || 0
  const sort = params.get('sort') || 'recommended'

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'all' || value === 'recommended') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const tabs = [
    { value: 'all', label: 'All', count: properties.length },
    ...BEDROOMS.map((n) => ({
      value: n,
      label: `${n} Bedroom`,
      count: properties.filter((p) => String(p.bedrooms) === n).length,
    })),
  ]

  const visible = useMemo(() => {
    const list = properties.filter(
      (p) => (bedrooms === 'all' || String(p.bedrooms) === bedrooms) && p.guests >= guests
    )
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating)
    if (sort === 'guests') list.sort((a, b) => b.guests - a.guests)
    return list
  }, [properties, bedrooms, guests, sort])

  return (
    <>
      {/* Banner */}
      <section className="bg-navy text-white">
        <Container className="py-16 text-center md:py-24">
          <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-gold">Hotel Listings</p>
          <span className="mx-auto mt-6 block h-px w-16 bg-gold" />
          <h1 className="mt-8 font-display text-5xl font-medium tracking-tight md:text-6xl">
            Our Properties
          </h1>
          <p className="mx-auto mt-6 max-w-[560px] text-[17px] font-light leading-8 text-white/75">
            Thoughtfully designed stays, each one managed with care for comfort and the details
            that make a difference.
          </p>
        </Container>
      </section>

      {/* Listings */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <FilterTabs tabs={tabs} active={bedrooms} onChange={(v) => update('bedrooms', v)} />

            <label className="flex items-center gap-3 text-[14px] text-body">
              <span>Sort by</span>
              <select
                value={sort}
                onChange={(e) => update('sort', e.target.value)}
                className="border-b border-gold/60 bg-transparent py-1 pr-6 text-ink outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Top rated</option>
                <option value="guests">Most guests</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-[14px] text-body">
            <span>
              Showing {visible.length} of {properties.length} {visible.length === 1 ? 'stay' : 'stays'}
            </span>
            {guests > 0 && (
              <button
                type="button"
                onClick={() => update('guests', '')}
                className="flex items-center gap-2 rounded-full border border-gold/50 px-3 py-1 text-[13px] text-ink hover:border-gold-deep"
              >
                {plural(guests, 'guest')} or more <span aria-hidden="true">×</span>
                <span className="sr-only">Remove guests filter</span>
              </button>
            )}
          </div>

          {/* key makes the grid fade in again whenever the filter changes */}
          <div key={`${bedrooms}-${guests}-${sort}`} className="mt-10 animate-fade-up">
            <PropertyGrid properties={visible} onReset={() => setParams({}, { replace: true })} />
          </div>
        </Container>
      </section>
    </>
  )
}