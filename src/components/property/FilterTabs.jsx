export default function FilterTabs({ tabs, active, onChange }) {
  return (
    <div role="group" aria-label="Filter by bedrooms" className="flex flex-wrap gap-3">
      {tabs.map((t) => {
        const isActive = t.value === active
        return (
          <button
            key={t.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(t.value)}
            className={`border px-5 py-2.5 text-[14px] transition-colors ${
              isActive
                ? 'border-gold-deep bg-gold-deep text-white'
                : 'border-gold/50 text-ink hover:border-gold-deep hover:text-gold-deep'
            }`}
          >
            {t.label} ({t.count})
          </button>
        )
      })}
    </div>
  )
}