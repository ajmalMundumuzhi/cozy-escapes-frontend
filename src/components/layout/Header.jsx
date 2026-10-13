import { useState } from 'react'
import { Link } from 'react-router-dom'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Hotel Listings', to: '/accommodations' },
  { label: 'About Cozy Escapes', to: '/about-cozy-escapes' },
  { label: 'Terms', to: '/terms-and-conditions' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-navy text-white">
      <div className="mx-auto flex h-[89px] max-w-[1900px] items-center justify-between px-5 md:px-8">
        <Link to="/" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="Cozy Escapes" className="h-14 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-[16px] font-normal transition-colors hover:text-gold">
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-white/10 px-5 pb-4 md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-3 text-[16px] font-normal">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}