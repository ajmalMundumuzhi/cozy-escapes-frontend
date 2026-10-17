import { useState } from 'react'
import { Link } from 'react-router-dom'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Hotel Listings', to: '/accommodations' },
  { label: 'About Cozy Escapes', to: '/about-cozy-escapes' },
  { label: 'Terms', to: '/terms-and-conditions' },
]

const label = 'text-[11px] font-medium uppercase tracking-[0.18em]'

export default function Header({ overlay = false }) {
  const [open, setOpen] = useState(false)

  const wrapper = overlay
    ? 'absolute inset-x-0 top-0 z-30 px-3 pt-3 md:px-6 md:pt-5'
    : 'relative z-30 bg-navy px-3 py-3 md:px-6'

  const bar = overlay
    ? 'rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md'
    : ''

  return (
    <header className={wrapper}>
      <div className={`grid h-14 grid-cols-[1fr_auto_1fr] items-center px-4 text-white md:h-16 md:px-8 ${bar}`}>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="flex items-center gap-3 justify-self-start"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 9h16M4 15h10" />}
          </svg>
          <span className={label}>Menu</span>
        </button>

        <Link to="/" onClick={() => setOpen(false)} className="font-display text-xl italic md:text-2xl">
          Resort booking
        </Link>

        <div className="flex items-center justify-self-end">
          <Link
            to="/contact"
            className={`hidden border-l border-white/30 px-8 py-5 hover:text-white/70 md:block ${label}`}
          >
            Contacts
          </Link>
          <Link
            to="/accommodations"
            className={`flex items-center gap-3 md:border-l md:border-white/30 md:pl-8 hover:text-white/70 ${label}`}
          >
            Booking
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {open && (
        <nav className="absolute left-3 right-3 top-full z-40 mt-2 rounded-2xl border border-white/20 bg-navy/90 p-6 text-white backdrop-blur-xl md:left-6 md:right-auto md:w-72">
          <ul className="space-y-4">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} onClick={() => setOpen(false)} className="text-[15px] hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}