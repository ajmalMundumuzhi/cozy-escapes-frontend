import { useState } from 'react'

const VISIBLE = 6

function Group({ title, items }) {
  const [open, setOpen] = useState(false)
  const canExpand = items.length > VISIBLE
  const shown = open || !canExpand ? items : items.slice(0, VISIBLE)

  return (
    <div className="border border-gold/40 bg-white p-6 md:p-7">
      <h3 className="font-display text-2xl font-medium text-ink">{title}</h3>
      <span className="mt-3 block h-px w-10 bg-gold" />

      <ul className="mt-5 space-y-3">
        {shown.map((item) => (
          <li key={item} className="flex items-center gap-3 text-[15px] text-body">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      {canExpand && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="mt-5 border-b border-gold-deep pb-0.5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-gold-deep"
        >
          {open ? 'See less' : `See more (${items.length - VISIBLE})`}
        </button>
      )}
    </div>
  )
}

export default function AmenityList({ groups }) {
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      {groups.map((g) => (
        <Group key={g.title} title={g.title} items={g.items} />
      ))}
    </div>
  )
}