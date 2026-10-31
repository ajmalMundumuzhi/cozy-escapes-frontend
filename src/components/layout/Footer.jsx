import { Link } from 'react-router-dom'
import Container from '../ui/Container'

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <Container className="pb-6 pt-16 md:pt-20">
        <div className="grid gap-10 text-center sm:grid-cols-2 lg:grid-cols-4 lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <Link to="/" aria-label="Avanta Living homepage">
              <img
                src="/images/logo.png"
                alt="Avanta Living"
                className="h-20 w-auto object-contain"
              />
            </Link>
          </div>

          <div>
            <h3 className="text-[18px] font-medium">Navigate</h3>
            <ul className="mt-5 space-y-2 text-[16px] font-light leading-6">
              <li>
                <Link to="/about-avanta" className="transition hover:text-[#D9BB83]">
                  About Avanta Living
                </Link>
              </li>
              <li>
                <Link to="/accommodations" className="transition hover:text-[#D9BB83]">
                  Find Your Stay
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition hover:text-[#D9BB83]">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-[#D9BB83]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[18px] font-medium">Contact Us</h3>
            <ul className="mt-5 space-y-2 text-[16px] font-light leading-6">
              <li>
                <a href="tel:+61406957539" className="transition hover:text-[#D9BB83]">
                  +61 406957539
                </a>
              </li>
              <li>
                <a
                  href="mailto:Hello.avantaliving@gmail.com"
                  className="break-all transition hover:text-[#D9BB83]"
                >
                  Hello.avantaliving@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[18px] font-medium">Social Media</h3>
            <ul className="mt-5 space-y-2 text-[16px] font-light leading-6">
              <li>
                <a
                  href="https://www.instagram.com/avantaliving?mdxt=MTh1MnllYTlrbHVwdg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#D9BB83]"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/14zbzkTUQgB/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#D9BB83]"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-14 text-center text-xs font-light text-white/70">
          © 2026 Avanta Living. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}