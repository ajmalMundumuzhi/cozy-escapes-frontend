
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Hotel Listings', to: '/accommodations' },
  { label: 'About Avanta Living', to: '/about-avanta' },
  { label: 'Terms', to: '/terms' },
  { label: 'Contact', to: '/contact' },
]

const label =
  'text-[11px] font-medium uppercase tracking-[0.18em]'

export default function Header({ overlay = false }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Keep the header visible over every page, including property details.
  const wrapper = overlay
    ? 'absolute inset-x-0 top-0 z-30 px-3 pt-3 md:px-6 md:pt-5'
    : 'relative z-30 px-3 py-3 md:px-6 md:py-5'

  return (
    <header className={wrapper}>
      <div className="relative grid h-14 grid-cols-[1fr_auto_1fr] items-stretch rounded-2xl border border-[#C9AA70]/50 bg-[#17352B] px-3 text-white shadow-lg md:h-16 md:px-8">
        {/* Left: menu */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="flex items-center gap-2 justify-self-start md:gap-3"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 9h16M4 15h10" />
            )}
          </svg>
          <span className={label}>Menu</span>
        </button>

        {/* Center: brand */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center font-display text-base italic text-[#D9BB83] sm:text-xl md:text-2xl"
        >
          Avanta Living
        </Link>

        {/* Right: contacts and booking */}
        <div className="flex items-stretch justify-self-end">
          <Link
            to="/contact"
            className={`hidden items-center border-l border-white/20 px-8 transition-colors hover:text-[#D9BB83] md:flex ${label}`}
          >
            Contacts
          </Link>

          <Link
            to="/accommodations"
            className={`flex items-center gap-1.5 transition-colors hover:text-[#D9BB83] sm:gap-3 md:border-l md:border-white/20 md:pl-8 ${label}`}
          >
            Booking
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Menu panel */}
      {open && (
        <nav className="absolute left-3 right-3 top-full z-40 mt-1 rounded-2xl border border-[#C9AA70]/30 bg-[#17352B] p-6 text-white shadow-xl md:left-6 md:right-auto md:w-72">
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="text-[15px] transition-colors hover:text-[#D9BB83]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
