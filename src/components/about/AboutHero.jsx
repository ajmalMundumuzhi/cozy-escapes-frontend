import Container from '../ui/Container'

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {/* Replace with the client's photo */}
      <img
        src="https://picsum.photos/seed/avanta-hero/1920/900"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/70 to-navy" />

      <Container className="relative z-10 py-24 text-center md:py-36">
        <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-gold">
          About Avanta Living
        </p>
        <span className="mx-auto mt-6 block h-px w-16 bg-gold" />

        <h1 className="mx-auto mt-8 max-w-[900px] font-display text-5xl font-medium leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          Thoughtfully Designed Stays.
          <span className="mt-2 block italic text-gold">A Feeling of Home.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-[640px] text-[17px] font-light leading-8 text-white/80 md:text-[18px]">
          At Avanta Living, we believe every stay should feel comfortable, welcoming, and
          effortless. Whether it’s a family holiday, weekend escape, or work trip, we create spaces
          where guests can relax and feel at home.
        </p>
      </Container>
    </section>
  )
}