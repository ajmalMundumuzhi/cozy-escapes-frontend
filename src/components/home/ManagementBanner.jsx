import Container from '../ui/Container'
import Button from '../ui/Button'
import { Link } from 'react-router'

export default function ManagementBanner() {
  return (
    <section className="py-12 md:py-20">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Text */}
          <div>
            <h2 className="font-heading text-5xl font-normal uppercase leading-[1.05] tracking-tight text-black md:text-6xl lg:text-[76px]">
              Stress-Free Management
            </h2>

            <p className="mt-10 max-w-[560px] text-[17px] font-normal leading-[1.9] text-[#4a4a4a]">
              Experience comfort and elegance with our carefully selected properties. Book your
              stay effortlessly and start your journey with us.
            </p>

            <Link to="/accommodation"> <Button to="/contact" className="mt-10 rounded-sm">
              List Your Property
            </Button>
            </Link>
          </div>

          <img
            src="https://picsum.photos/seed/cozy-living/900/1100"
            alt="Living room"
            className="aspect-[4/5] w-full rounded-lg object-cover md:min-h-[640px] md:aspect-auto"
          />
        </div>
      </Container>
    </section>
  )
}