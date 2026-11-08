
import { Link } from 'react-router-dom'
import { buildGuestyBookingUrl } from '../../services/guesty.service'

export default function BookingAva({
  id,
  guests,
  bedrooms,
  bathrooms,
  search = '',
}) {
  const inquiry = `/accommodations/property/${id}/inquiry${search}`

  const searchParams = new URLSearchParams(search)

  const bookingUrl = buildGuestyBookingUrl({
    propertyId: id,
    checkIn: searchParams.get('checkIn'),
    checkOut: searchParams.get('checkOut'),
    guests: searchParams.get('guests') || guests,
  })

  return (
    <>
      <aside className="hidden h-fit self-start border border-gold/30 bg-white p-8 shadow-sm lg:sticky lg:top-8 lg:block">
        <h2 className="font-display text-3xl font-medium text-ink">
          Reserve Your Stay
        </h2>

        <div className="mt-6 border-t border-gold/30 pt-6">
          <ul className="space-y-5 text-[16px] text-body">
            <li className="flex items-center justify-between">
              <span>Guests</span>
              <span className="font-medium text-ink">{guests}</span>
            </li>

            <li className="flex items-center justify-between">
              <span>Bedrooms</span>
              <span className="font-medium text-ink">{bedrooms}</span>
            </li>

            <li className="flex items-center justify-between">
              <span>Bathrooms</span>
              <span className="font-medium text-ink">{bathrooms}</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-gold-deep px-3 py-4 text-center text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-navy"
          >
            Book Now
          </a>

          <Link
            to={inquiry}
            className="flex items-center justify-center border border-navy px-3 py-4 text-center text-[12px] font-medium uppercase tracking-[0.14em] text-navy transition-colors hover:bg-navy hover:text-white"
          >
            Send Enquiry
          </Link>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-3 border-t border-gold/40 bg-white px-5 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] lg:hidden">
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center bg-gold-deep px-3 py-3 text-center text-[12px] font-medium uppercase tracking-[0.14em] text-white"
        >
          Book Now
        </a>

        <Link
          to={inquiry}
          className="flex items-center justify-center border border-navy px-3 py-3 text-center text-[12px] font-medium uppercase tracking-[0.14em] text-navy"
        >
          Send Enquiry
        </Link>
      </div>
    </>
  )
}
