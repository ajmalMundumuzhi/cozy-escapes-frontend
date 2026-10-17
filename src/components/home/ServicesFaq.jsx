import Container from '../ui/Container'
import faqs from '../../data/faqs.json'

export default function ServicesFaq() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <h2 className="font-display font-medium tracking-tight text-5xl text-ink md:text-[48px]">Management Services</h2>
        <p className="mt-4 max-w-[660px] text-[17px] leading-6 text-body">
          Experience comfort and elegance with our carefully selected properties. Book your stay
          effortlessly and start your journey with us.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
          {faqs.map((f, i) => (
            <article
              key={f.title}
              className="group flex gap-6 rounded-lg bg-gold-deep p-7 text-white shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-emerald-950 hover:shadow-xl md:p-8"
            >
              <div className="flex shrink-0 flex-col items-center gap-2 pt-1">
                <span className="text-[13px] font-light">Step</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[14px] font-semibold text-gold-deep transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                  {i + 1}
                </span>
              </div>

              <div>
                <h3 className="text-[22px] font-medium leading-snug">{f.title}</h3>
                <p className="mt-3 text-[15px] font-normal leading-[1.7] text-white/90">{f.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}