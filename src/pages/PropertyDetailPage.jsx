
import { Link, useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import Container from '../components/ui/Container'
import Gallery from '../components/property/Gallery'
import PropertyStats from '../components/property/PropertyStats'
import ExpandableText from '../components/property/ExpandableText'
import AmenityList from '../components/property/AmenityList'
import PropertyInfo from '../components/property/PropertyInfo'
import BookingAva from '../components/property/BookingAva'
import { usePropertyState } from '../hooks/useProperties'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const { search } = useLocation()
  const { property, loading, error } = usePropertyState(id)

  // Start at the top when arriving from the listings page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [id])

  // Loading state
  if (loading) {
    return (
      <Container className="py-32 text-center">
        <p className="text-body">Loading property details...</p>
      </Container>
    )
  }

  // Error or property not found
  if (error || !property) {
    return (
      <Container className="py-32 text-center">
        <h1 className="font-display text-4xl text-ink">
          Property not found
        </h1>

        <p className="mt-4 text-body">
          {error || 'This listing doesn’t exist or may have been removed.'}
        </p>

        <Link
          to="/accommodations"
          className="mt-8 inline-block bg-gold-deep px-8 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-white hover:bg-navy"
        >
          Back to listings
        </Link>
      </Container>
    )
  }

  const {
    title,
    rating,
    guests,
    bedrooms,
    bathrooms,
    location,
    description,
    gallery,
    amenityGroups,
  } = property

  const [main, ...rest] = title.split('|')
  const sub = rest.join('|').trim()

  return (
    <section className="pb-28 pt-8 md:pt-12 lg:pb-24">
      <Container>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-[13px] text-body"
        >
          <Link to="/" className="hover:text-gold-deep">
            Home
          </Link>

          <span className="mx-2 text-gold-deep">/</span>

          <Link
            to="/accommodations"
            className="hover:text-gold-deep"
          >
            Hotel Listings
          </Link>
        </nav>

        {/* Title */}
        <div className="mt-6 mb-8">
          <h1 className="font-display text-4xl font-medium leading-tight tracking-tight text-ink md:text-5xl">
            {main.trim()}
          </h1>

          {sub && (
            <p className="mt-3 text-[13px] font-medium uppercase tracking-[0.16em] text-gold-deep">
              {sub}
            </p>
          )}
        </div>

        <Gallery images={gallery} title={title} />

        <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* Left column */}
          <div className="min-w-0">
            <PropertyStats
              guests={guests}
              bedrooms={bedrooms}
              bathrooms={bathrooms}
              rating={rating}
            />

            <h2 className="mt-12 font-display text-3xl font-medium tracking-tight text-ink">
              About this stay
            </h2>

            <span className="mt-4 block h-px w-12 bg-gold" />

            <div className="mt-6">
              <ExpandableText paragraphs={description} />
            </div>

            <h2 className="mt-16 font-display text-3xl font-medium tracking-tight text-ink">
              What this place offers
            </h2>

            <span className="mt-4 block h-px w-12 bg-gold" />

            <div className="mt-8">
              <AmenityList groups={amenityGroups} />
            </div>

            <div className="mt-16">
              <PropertyInfo
                guests={guests}
                bedrooms={bedrooms}
                bathrooms={bathrooms}
                location={location}
              />
            </div>
          </div>

          {/* Right column */}
          <BookingAva
            id={id}
            rating={rating}
            search={search}
          />
        </div>
      </Container>
    </section>
  )
}
