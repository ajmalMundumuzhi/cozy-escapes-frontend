// Desktop: sticky side list
export default function TermsNav({ sections, active }) {
  return (
    <nav aria-label="Terms sections" className="sticky top-8 hidden self-start lg:block">
      <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-gold-deep">On this page</p>
      <ul className="mt-5 border-l border-gold/40">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`-ml-px block border-l-2 py-2 pl-5 text-[15px] transition-colors ${
                active === s.id
                  ? 'border-gold-deep font-medium text-ink'
                  : 'border-transparent text-body hover:text-ink'
              }`}
            >
              <span className="mr-3 text-[12px] text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Mobile / tablet: sticky row of tabs
export function MobileNav({ sections, active }) {
  return (
    <nav aria-label="Terms sections" className="sticky top-0 z-20 border-b border-gold/30 bg-white/95 backdrop-blur lg:hidden">
      <ul className="flex gap-2 overflow-x-auto px-5 py-3 md:px-8">
        {sections.map((s) => (
          <li key={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              className={`block rounded-full border px-4 py-1.5 text-[13px] transition-colors ${
                active === s.id
                  ? 'border-gold-deep bg-gold-deep text-white'
                  : 'border-gold/50 text-ink hover:border-gold-deep'
              }`}
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}