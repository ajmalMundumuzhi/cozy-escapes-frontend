import Container from '../ui/Container'
import Button from '../ui/Button'

export default function ManagementBanner() {
  return (
    <section className="py-12">
      <Container>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-[30px]">
          <img
            src="https://picsum.photos/seed/cozy-living/900/900"
            alt="Living room"
            className="aspect-square w-full object-cover"
          />
          <div>
            <h2 className="font-script text-5xl text-ink md:text-[56px]">Stress-Free Management</h2>
            <p className="mt-4 max-w-[700px] text-[17px] leading-6 text-body">
              Experience comfort and elegance with our carefully selected properties. Book your stay
              effortlessly and start your journey with us.
            </p>
            <Button to="/contact" className="mt-8">List Your Property</Button>
          </div>
        </div>
      </Container>
    </section>
  )
}