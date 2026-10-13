import Container from '../ui/Container'
import testimonials from '../../data/testimonials.json'

function Avatar() {
  return (
    <div className="flex h-[63px] w-[63px] shrink-0 items-center justify-center rounded-full bg-[#cbd6df]">
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="white" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="1.5" />
        <path d="M3 17l5-5 4 4 3-3 6 6" />
      </svg>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="bg-[#f7f7f7] py-14 md:py-16">
      <Container>
        <h2 className="text-center font-script text-5xl text-ink md:text-[56px]">What Our Guests Say</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name}>
              <blockquote className="text-[17px] font-light leading-6 text-body">{t.quote}</blockquote>
              <figcaption className="mt-5 flex items-center gap-4">
                <Avatar />
                <span className="text-[16px] font-normal italic text-ink">{t.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  )
}