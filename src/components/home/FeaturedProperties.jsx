import Container from '../ui/Container'
import Button from '../ui/Button'
import PropertyCard from '../property/PropertyCard'
import useProperties from '../../hooks/useProperties'

export default function FeaturedProperties() {
  const { properties } = useProperties()

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-script text-5xl text-ink md:text-[56px]">Reserve Your Escape</h2>
            <p className="mt-4 max-w-[660px] text-[17px] leading-6 text-body">
              We manage every aspect of your short-term rental with care and precision. From guest
              screening to professional upkeep, your home is protected, maintained, and optimised to
              deliver strong returns.
            </p>
          </div>
          <Button to="/accommodations" className="self-start">View All</Button>
        </div>

        <div className="mt-8 grid gap-x-[30px] gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0, 6).map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </Container>
    </section>
  )
}