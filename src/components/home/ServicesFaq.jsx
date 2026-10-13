import Container from '../ui/Container'
import faqs from '../../data/faqs.json'

function Icon() {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z" />
    </svg>
  )
}

export default function ServicesFaq() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <h2 className="font-script text-5xl text-ink md:text-[56px]">Management Services</h2>
        <p className="mt-4 max-w-[660px] text-[17px] leading-6 text-body">
          Experience comfort and elegance with our carefully selected properties. Book your stay
          effortlessly and start your journey with us.
        </p>

        <div className="mt-12 grid gap-[30px] md:grid-cols-2">
          {faqs.map((f) => (
            <div key={f.title} className="flex gap-5 border border-gold p-5">
              <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center bg-gold text-white">
                <Icon />
              </div>
              <div>
                <h3 className="text-[22px] font-semibold capitalize leading-tight text-body">{f.title}</h3>
                <p className="mt-2 text-[15px] font-light leading-[23px] text-body">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}