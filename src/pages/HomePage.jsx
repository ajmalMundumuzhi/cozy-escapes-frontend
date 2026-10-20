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
      <FeaturedProperties/>
      {/* <PartnerLogos /> */}
      <ManagementBanner />
      <Testimonials />
      <ServicesFaq />
    </>
  )
}