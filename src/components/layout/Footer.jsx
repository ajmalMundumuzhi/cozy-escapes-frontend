import { Link } from 'react-router-dom'
import Container from '../ui/Container'

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <Container className="pb-6 pt-16 md:pt-20">
        <div className="grid gap-10 text-center md:grid-cols-3 md:text-left">
          <div className="flex justify-center">
            <img
              src="/public/images/logo.png"
              alt="Avanta Living"
              className="h-24 w-auto object-contain"
            />
          </div>

          <div>
            <h3 className="text-[18px] font-medium">Navigate</h3>
            <ul className="mt-5 text-[16px] font-light leading-6">
              <li><Link to="/about-avanta">About Avanta Living</Link></li>
              <li><Link to="/accommodations">Hotel Listing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[18px] font-medium">Contact Us</h3>
            <ul className="mt-5 text-[16px] font-light leading-6">
              <li><a href="tel:+61420694394">+61 406957539</a></li>
              <li><a href="mailto:Hello.avantaliving@gmail.com">Hello.avantaliving@gmail.com</a></li>
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