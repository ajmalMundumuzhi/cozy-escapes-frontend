import { useState } from 'react'

export default function ExpandableText({ paragraphs, limit = 280 }) {
  const [open, setOpen] = useState(false)
  const isLong = paragraphs.join(' ').length > limit

  return (
    <div>
      {open || !isLong ? (
        <div className="space-y-4 text-[17px] leading-8 text-body">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : (
        <p className="line-clamp-4 text-[17px] leading-8 text-body">{paragraphs[0]}</p>
      )}

      {isLong && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="mt-5 border-b border-gold-deep pb-0.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-gold-deep"
        >
          {open ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}