import Container from '../ui/Container'

const pillars = ['Comfort', 'Design', 'The details that make a difference']

export default function OurStory() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-14 md:grid-cols-2 lg:gap-24">
          {/* Image with offset gold frame (replace the photo) */}
          <div className="relative">
            <span className="absolute inset-0 translate-x-4 translate-y-4 border border-gold" aria-hidden="true" />
            <img
              src="https://picsum.photos/seed/avanta-story/900/1100"
              alt="A thoughtfully designed living space"
              className="relative aspect-[4/5] w-full object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-gold-deep">
              Our Story
            </p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight text-ink md:text-[44px]">
              Born from a love of travel
            </h2>
            <span className="mt-6 block h-px w-16 bg-gold" />

            <p className="mt-8 text-[17px] leading-8 text-body">
              Avanta Living was born from our love of travel and our belief that the right space
              makes every trip more enjoyable.
            </p>
            <p className="mt-5 text-[17px] leading-8 text-body">
              We thoughtfully manage each property, focusing on comfort, design, and the details
              that make a difference. Whether you’re travelling with family, visiting for business,
              or taking a short break, our aim is to make your stay easy and memorable.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <ul className="mt-20 grid divide-gold/40 border-y border-gold/40 text-center sm:grid-cols-3 sm:divide-x">
          {pillars.map((p, i) => (
            <li key={p} className="px-6 py-8">
              <span className="text-[12px] font-medium tracking-[0.3em] text-gold-deep">
                0{i + 1}
              </span>
              <p className="mt-2 font-display text-2xl text-ink">{p}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}