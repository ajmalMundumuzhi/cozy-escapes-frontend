import Container from '../ui/Container'

const cards = [
  {
    no: '01',
    title: 'For our guests',
    text: 'We create spaces that bring people together and help guests enjoy their time away.',
  },
  {
    no: '02',
    title: 'For property owners',
    text: 'We also build trusted relationships with property owners, caring for each home as if it were our own and delivering thoughtful property management.',
  },
]

export default function MoreThanAStay() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <Container>
        <div className="text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-gold-deep">
            What we do
          </p>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink md:text-[44px]">
            More Than a Stay
          </h2>
          <span className="mx-auto mt-6 block h-px w-16 bg-gold" />
        </div>

        <div className="mx-auto mt-14 grid max-w-[1100px] gap-8 md:grid-cols-2">
          {cards.map((c) => (
            <article
              key={c.no}
              className="border-t-2 border-gold bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-12"
            >
              <span className="font-display text-5xl text-gold/60">{c.no}</span>
              <h3 className="mt-6 font-display text-2xl text-ink md:text-[28px]">{c.title}</h3>
              <p className="mt-4 text-[17px] leading-8 text-body">{c.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}