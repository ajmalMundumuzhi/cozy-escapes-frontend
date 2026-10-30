import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Hotel Listings', to: '/accommodations' },
  { label: 'About Avanta Living', to: '/about-avanta' },
  { label: 'Terms', to: '/terms' },
  { label: 'Contact', to: '/contact' },
]

const label = 'text-[11px] font-medium uppercase tracking-[0.18em]'

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

  const wrapper = overlay
    ? 'absolute inset-x-0 top-0 z-50'
    : 'relative z-50'

  return (
    <header className={wrapper}>
      <div className="relative w-full bg-[#17352B] text-white shadow-sm">
        <div className="mx-auto flex min-h-16 w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:min-h-[76px] lg:px-10">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="flex shrink-0 items-center gap-2"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
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

          <div className="flex justify-center">
            <Link to="/" aria-label="Avanta Living homepage">
              <img
                src="/images/logo.png"
                alt="Avanta Living"
                className="h-16 w-auto object-contain sm:h-20"
              />
            </Link>
          </div>

          <div className="flex shrink-0 items-center">
            <Link
              to="/contact"
              className={`hidden items-center border-l border-white/20 px-5 transition-colors hover:text-[#D9BB83] lg:flex xl:px-8 ${label}`}
            >
              Contacts
            </Link>
            <Link
              to="/accommodations"
              className={`flex items-center gap-1.5 transition-colors hover:text-[#D9BB83] lg:border-l lg:border-white/20 lg:pl-5 xl:pl-8 ${label}`}
            >
              <span className="hidden sm:inline">Booking</span>
              <span className="sm:hidden">Book</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {open && (
          <nav className="absolute left-3 right-3 top-full z-40 mt-1 rounded-2xl border border-[#C9AA70]/30 bg-[#17352B] p-6 text-white shadow-xl md:left-6 md:right-auto md:w-72">
            <div className="mb-6 flex items-center justify-between md:hidden">
              <Link to="/" onClick={() => setOpen(false)}>
                <img
                  src="/assets/logo.svg"
                  alt="Avanta Living"
                  className="h-12 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-2xl text-[#D9BB83]"
              >
                ×
              </button>
            </div>
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
      </div>
    </header>
  )
}
