import Hero from '../components/home/Hero'
import ManagementBanner from '../components/home/ManagementBanner'
import PartnerLogos from '../components/home/PartnerLogos'
import SearchBar from '../components/home/SearchBar'

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnerLogos />
      <SearchBar />
      <ManagementBanner />
    </>
  )
}