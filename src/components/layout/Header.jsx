
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Find Your Stay', to: '/accommodations' },
  { label: 'About Avanta Living', to: '/about-avanta' },
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Contact', to: '/contact' },
]

export default function Header({ overlay = false }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return undefined

    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const wrapper = 'relative z-50 w-full'

  const closeMenu = () => setOpen(false)

  return (
    <header className={wrapper}>
      <div className="relative w-full bg-[#17352B] text-white shadow-sm">
        <div className="mx-auto flex min-h-[76px] items-center justify-between gap-5 px-5 sm:px-8 lg:min-h-[100px] lg:px-14">

          <Link
            to="/"
            aria-label="Avanta Living homepage"
            onClick={closeMenu}
            className="shrink-0"
          >
            <img
              src="/images/logo.png"
              alt="Avanta Living"
              className="h-14 w-auto object-contain sm:h-16 lg:h-[76px]"
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
            {links.slice(0, 3).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium transition-colors hover:text-[#D9BB83] xl:text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 lg:block">
            <Link
              to="/accommodations"
              className="flex min-w-[190px] items-center justify-center bg-[#D9BB83] px-8 py-5 text-sm font-medium uppercase tracking-[0.12em] text-[#17352B] transition-colors hover:bg-[#E6CEA3] xl:min-w-[230px]"
            >
              Book Now
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <svg
              viewBox="0 0 32 32"
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M3 8h26M3 16h26M3 24h26" />
            </svg>
          </button>
        </div>

        {open && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              className="absolute inset-0 bg-black/60"
            />

            <nav className="absolute inset-y-0 right-0 flex w-[88%] max-w-[440px] flex-col overflow-y-auto bg-[#17352B] px-8 pb-8 pt-5 text-white shadow-2xl sm:w-[75%]">

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center text-3xl leading-none text-[#D9BB83] transition hover:text-white"
                >
                  ×
                </button>
              </div>

              <Link
                to="/"
                onClick={closeMenu}
                className="mb-12 mt-8 flex justify-center"
              >
                <img
                  src="/images/logo.png"
                  alt="Avanta Living"
                  className="h-24 w-auto object-contain"
                />
              </Link>

              <div className="mb-5 text-sm font-semibold text-[#D9BB83]">
                Discover
              </div>

              <ul className="flex-1">
                {links.map((link) => (
                  <li key={link.to} className="border-t border-white/50">
                    <Link
                      to={link.to}
                      onClick={closeMenu}
                      className="block py-5 text-base font-medium transition-colors hover:text-[#D9BB83]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                to="/accommodations"
                onClick={closeMenu}
                className="mt-10 flex min-h-[58px] items-center justify-center bg-[#D9BB83] px-6 text-sm font-medium uppercase tracking-[0.15em] text-[#17352B] transition-colors hover:bg-[#E6CEA3]"
              >
                Book Your Stay
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
