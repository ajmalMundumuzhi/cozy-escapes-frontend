import GuestySearchWidget from '../components/booking/GuestySearchWidget'
import FeaturedProperties from '../components/home/FeaturedProperties'
import Hero from '../components/home/Hero'
import ManagementBanner from '../components/home/ManagementBanner'
import PartnerLogos from '../components/home/PartnerLogos'
import ServicesFaq from '../components/home/ServicesFaq'
import Testimonials from '../components/home/Testimonials'

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="relative z-20 mx-auto w-full h-1 max-w-7xl px-4 py-8">
        <GuestySearchWidget />
      </section>
      <FeaturedProperties/>
      {/* <PartnerLogos /> */}
      <ManagementBanner />
      <Testimonials />
      <ServicesFaq />
    </>
  )
}