function Block({ block }) {
  if (block.type === 'lead') {
    return <p className="mt-6 font-display text-2xl text-ink md:text-3xl">{block.text}</p>
  }

  if (block.type === 'list') {
    return (
      <div className="mt-6">
        {block.intro && <p className="text-[17px] font-normal leading-8 text-ink">{block.intro}</p>}
        <ul className="mt-4 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-4 text-[16px] leading-8 text-body">
              <span className="mt-[14px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return <p className="mt-5 text-[16px] leading-8 text-body">{block.text}</p>
}

export default function TermsSection({ section, index }) {
  return (
    <section id={section.id} className="scroll-mt-24 border-t border-gold/40 py-12 first:border-t-0 first:pt-0">
      <span className="text-[12px] font-medium tracking-[0.3em] text-gold-deep">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink md:text-[36px]">
        {section.title}
      </h2>
      {section.blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </section>
  )
}