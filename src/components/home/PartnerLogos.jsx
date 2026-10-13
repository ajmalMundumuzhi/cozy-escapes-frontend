import Container from '../ui/Container'

// Logos belong to the partners: get the files from the client
const partners = [
  { name: 'Colliers', src: '/images/partners/colliers.png' },
  { name: 'First National Real Estate', src: '/images/partners/first-national.png' },
  { name: 'Mirvac', src: '/images/partners/mirvac.png' },
  { name: 'Century 21', src: '/images/partners/century21.png' },
]

export default function PartnerLogos() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <h2 className="text-center font-script text-5xl text-ink md:text-[56px]">
          Trusted By Industry Leaders
        </h2>
        <div className="mt-12 grid grid-cols-2 items-center justify-items-center gap-10 md:grid-cols-4">
          {partners.map((p) => (
            <img key={p.name} src={p.src} alt={p.name} className="h-24 max-w-full object-contain md:h-32" />
          ))}
        </div>
      </Container>
    </section>
  )
}