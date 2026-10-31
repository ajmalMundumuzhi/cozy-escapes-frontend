import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

export default function WhatsAppButton() {
  const [showMessage, setShowMessage] = useState(true)

  const phoneNumber = '61406957539'
  const message = 'Hi! I have a question about Avanta Living.'

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-5">

      {showMessage && (
        <div className="relative flex max-w-[350px] items-center gap-4 rounded-xl bg-white p-4 pr-5 text-[#344054] shadow-xl sm:max-w-[380px]">

          <img
            src="/images/logo.png"
            alt="Avanta Living"
            className="h-11 w-11 shrink-0 rounded-full object-contain"
          />

          <p className="flex-1 text-base leading-6 md:leading-8 sm:text-lg md:px-4 p-0">
            Hi there! Have a question?
            <br />
            Chat with us here.
          </p>

          <button
            type="button"
            onClick={() => setShowMessage(false)}
            aria-label="Close message"
            className="absolute right-3 top-3 text-xl leading-none text-gray-600 hover:text-black"
          >
            ×
          </button>

          <span className="absolute -bottom-2 right-7 h-4 w-4 rotate-45 bg-white" />
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-green-950 text-white shadow-lg transition-transform duration-300 hover:scale-110"
      >
        <FaWhatsapp size={30} />
      </a>
    </div>
  )
}
