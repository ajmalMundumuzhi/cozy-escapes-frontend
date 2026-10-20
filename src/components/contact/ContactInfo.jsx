import { contact } from '../../data/contact'

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

function Heading({ children }) {
  return <h3 className="text-[12px] font-medium uppercase tracking-[0.3em] text-gold">{children}</h3>
}

export default function ContactInfo() {
  return (
    <aside className="bg-navy p-8 text-white md:p-10">
      {/* Direct contact */}
      <Heading>Direct contact</Heading>
      <ul className="mt-6 space-y-4 text-[16px]">
        <li className="flex items-center gap-4">
          <Icon>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </Icon>
          <a href={`mailto:${contact.email}`} className="break-all transition-colors hover:text-gold">
            {contact.email}
          </a>
        </li>
        <li className="flex items-center gap-4">
          <Icon>
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
          </Icon>
          <a href={contact.phoneHref} className="transition-colors hover:text-gold">
            {contact.phone}
          </a>
        </li>
      </ul>

      {/* WhatsApp */}
      <div className="mt-10 border-t border-white/15 pt-10">
        <Heading>WhatsApp support</Heading>
        <p className="mt-4 text-[16px] leading-7 text-white/80">
          The fastest way to get answers about your stay.
        </p>
        <a
          href={contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-3 bg-[#1fa855] px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#178a45]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 20l1.3-4.2A8 8 0 118 18.8L4 20z" />
            <path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 .5c-.8-.4-1.6-1.2-2-2l.5-1-1-2L9 9z" />
          </svg>
          Chat on WhatsApp
        </a>
        <p className="mt-3 text-[13px] text-gold">{contact.replyTime}</p>
      </div>

      {/* Hours */}
      <div className="mt-10 border-t border-white/15 pt-10">
        <Heading>Business hours</Heading>
        <dl className="mt-6 space-y-3 text-[16px]">
          {contact.hours.map((h) => (
            <div key={h.days} className="flex justify-between gap-4">
              <dt className="text-white/70">{h.days}</dt>
              <dd>{h.time}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[13px] leading-6 text-white/60">
          {contact.hoursTimezone}. {contact.hoursNote}
        </p>
      </div>
    </aside>
  )
}