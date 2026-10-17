import Container from '../ui/Container'

export default function TermsHero() {
  return (
    <section className="bg-navy text-white">
      <Container className="py-20 text-center md:py-28">
        <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-gold">Legal</p>
        <span className="mx-auto mt-6 block h-px w-16 bg-gold" />
        <h1 className="mt-8 font-display text-5xl font-medium tracking-tight md:text-6xl">
          Terms and Conditions
        </h1>
      </Container>
    </section>
  )
}