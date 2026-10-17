import { Link } from 'react-router-dom'

export default function BookingAva({ id, rating, search = '' }) {
  const base = `/accommodations/property/${id}`
  const book = `${base}/book${search}`
  const inquiry = `${base}/inquiry${search}`

  return (
    <>
      {/* Desktop: sticky card */}
      <aside className="hidden self-start border-t-2 border-gold bg-white p-8 shadow-lg ring-1 ring-black/5 lg:sticky lg:top-8 lg:block">
        <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-gold-deep">Reserve</p>
        <h2 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight text-ink">
          Reserve your stay today
        </h2>
        <p className="mt-4 text-[16px] leading-7 text-body">
          Lock in your dates instantly or send an inquiry for custom requests and availability details.
        </p>

        <div className="mt-8 grid gap-3">
          <Link
            to={book}
            className="bg-gold-deep py-4 text-center text-[12px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-navy"
          >
            Book Now
          </Link>
          <Link
            to={inquiry}
            className="border border-navy py-4 text-center text-[12px] font-medium uppercase tracking-[0.18em] text-navy transition-colors hover:bg-navy hover:text-white"
          >
            Send Inquiry
          </Link>
        </div>

        <p className="mt-6 border-t border-gold/30 pt-5 text-center text-[14px] text-body">
          Prefer to talk?{' '}
          <a href="tel:+61426964657" className="text-ink underline decoration-gold underline-offset-4">
            +61 426964657
          </a>
        </p>
      </aside>

      {/* Mobile / tablet: bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-gold/40 bg-white px-5 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="flex items-center gap-2 text-[15px] text-ink">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-gold" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {rating}
        </div>
        <div className="flex gap-2">
          <Link
            to={inquiry}
            className="border border-navy px-4 py-3 text-[12px] font-medium uppercase tracking-[0.15em] text-navy"
          >
            Inquiry
          </Link>
          <Link
            to={book}
            className="bg-gold-deep px-6 py-3 text-[12px] font-medium uppercase tracking-[0.15em] text-white"
          >
            Book Now
          </Link>
        </div>
      </div>
    </>
  )
}