import PropertyCard from './PropertyCard'

export default function PropertyGrid({ properties, onReset }) {
  if (!properties.length) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-3xl text-ink">No properties match your search</p>
        <p className="mt-3 text-[16px] text-body">Try a different bedroom count or fewer guests.</p>
        <button
          type="button"
          onClick={onReset}
          className="mt-8 border border-navy px-8 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-navy transition-colors hover:bg-navy hover:text-white"
        >
          Clear filters
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  )
}