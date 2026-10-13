import FeaturedProperties from '../components/home/FeaturedProperties'
import Hero from '../components/home/Hero'
import ManagementBanner from '../components/home/ManagementBanner'
import PartnerLogos from '../components/home/PartnerLogos'
import SearchBar from '../components/home/SearchBar'
import Testimonials from '../components/home/Testimonials'

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnerLogos />
      <SearchBar />
      <ManagementBanner />
      <FeaturedProperties/>
      <Testimonials />
    </>
  )
}