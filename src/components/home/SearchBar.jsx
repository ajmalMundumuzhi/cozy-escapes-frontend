import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DateRangePicker from '../ui/DateRangePicker'

const label = 'text-[11px] font-medium uppercase tracking-[0.18em] text-white/70'
const field = 'mt-3 flex w-full items-center justify-between border-b border-white/40 pb-2 text-left text-[13px] text-white'

const fmt = (d) => d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
const iso = (d) => d.toLocaleDateString('en-CA') // YYYY-MM-DD

function Chevron({ up = false }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-3 w-3 shrink-0 transition-transform ${up ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export default function SearchBar() {
  const navigate = useNavigate()
  const dateRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState({ start: null, end: null })
  const [type, setType] = useState('')
  const [guests, setGuests] = useState('')

  // Close the calendar when clicking outside it
  useEffect(() => {
    const onClick = (e) => {
      if (dateRef.current && !dateRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const dateText = range.start
    ? range.end ? `${fmt(range.start)} – ${fmt(range.end)}` : fmt(range.start)
    : 'Add date'

  const submit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (range.start) params.set('checkin', iso(range.start))
    if (range.end) params.set('checkout', iso(range.end))
    if (type) params.set('bedrooms', type)
    if (guests) params.set('guests', guests)
    navigate(`/accommodations?${params}`)
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-6 bg-white/15 px-6 py-7 text-white backdrop-blur-md md:grid-cols-[1fr_1fr_1fr_auto] md:items-end md:gap-10 md:px-16"
    >
      {/* Date */}
      <div ref={dateRef} className="relative">
        <span className={label}>Date</span>
        <button type="button" onClick={() => setOpen(!open)} className={field}>
          <span>{dateText}</span>
          <Chevron up={open} />
        </button>
        {open && (
          <DateRangePicker
            start={range.start}
            end={range.end}
            onChange={(start, end) => setRange({ start, end })}
            onConfirm={() => setOpen(false)}
          />
        )}
      </div>

      {/* Type */}
      <div>
        <span className={label}>Type</span>
        <div className="relative">
          <select value={type} onChange={(e) => setType(e.target.value)} className={`${field} appearance-none bg-transparent outline-none`}>
            <option value="" className="text-slate-800">Apartment</option>
            <option value="1" className="text-slate-800">1 Bedroom</option>
            <option value="2" className="text-slate-800">2 Bedroom</option>
            <option value="3" className="text-slate-800">3 Bedroom</option>
          </select>
          <span className="pointer-events-none absolute right-0 top-[18px]"><Chevron /></span>
        </div>
      </div>

      {/* Guests */}
      <div>
        <span className={label}>Guests</span>
        <div className="relative">
          <select value={guests} onChange={(e) => setGuests(e.target.value)} className={`${field} appearance-none bg-transparent outline-none`}>
            <option value="" className="text-slate-800">Number of guests</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n} className="text-slate-800">{n} {n === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-0 top-[18px]"><Chevron /></span>
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-3 border border-white/40 py-3 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-white/20 md:border-0 md:p-6"
      >
        Booking <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}