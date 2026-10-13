import { Link } from 'react-router-dom'
import Rating from '../ui/Rating'
import { formatStats } from '../../utils/formatters'

export default function PropertyCard({ property }) {
  const { id, title, image, rating, amenities, bookUrl } = property
  const detailPath = `/accommodations/property/${id}`

  return (
    <article>
      <Link to={detailPath}>
        <img src={image} alt={title} className="block aspect-square w-full object-cover" />
      </Link>

      <h3 className="mt-5 text-[18px] font-semibold capitalize leading-snug text-body">
        <Link to={detailPath}>{title}</Link>
      </h3>

      <Rating value={rating} />

      <p className="mt-4 text-[17px] font-light text-body">{formatStats(property)}</p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {amenities.map((a) => (
          <li key={a} className="rounded-full border border-[#d8dbf0] px-3 py-1 text-[13px] text-ink">
            {a}
          </li>
        ))}
      </ul>

      <a
        href={bookUrl}
        className="mt-6 inline-block bg-black px-4 py-3 text-[13px] font-normal uppercase tracking-wider text-white transition-colors hover:bg-ink"
      >
        Book Now
      </a>
    </article>
  )
}