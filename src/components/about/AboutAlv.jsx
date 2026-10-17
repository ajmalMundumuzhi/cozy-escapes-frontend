import { Link } from 'react-router-dom'
import Container from '../ui/Container'

const label = 'text-[11px] font-medium uppercase tracking-[0.25em] text-gold'

export default function AboutAlv() {
  return (
    <section className="bg-navy py-20 text-center text-white md:py-28">
      <Container>
        <p className="mx-auto max-w-[820px] font-display text-3xl italic leading-snug md:text-5xl">
          Welcome to Avanta Living — your space to unwind, connect, and feel at home.
        </p>

        <span className="mx-auto mt-10 block h-px w-16 bg-gold" />

        <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-16 md:inline-grid">
          <div>
            <p className={label}>Call us</p>
            <a href="tel:+61426964657" className="mt-3 block text-[18px] transition-colors hover:text-gold">
              +61 426964657
            </a>
          </div>
          <div>
            <p className={label}>Email us</p>
            <a
              href="mailto:Hello.avantaliving@gmail.com"
              className="mt-3 block break-all text-[18px] transition-colors hover:text-gold"
            >
              Hello.avantaliving@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            to="/accommodations"
            className="bg-gold px-8 py-3 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-gold-dark"
          >
            Browse Properties
          </Link>
          <Link
            to="/contact"
            className="border border-white/50 px-8 py-3 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-white hover:text-navy"
          >
            Contact
          </Link>
        </div>
      </Container>
    </section>
  )
}