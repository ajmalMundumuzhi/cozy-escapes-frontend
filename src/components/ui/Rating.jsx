export default function Rating({ value }) {
  return (
    <div className="mt-2 flex items-center gap-2 text-[17px] text-body">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#f5a623]" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span>{value}</span>
    </div>
  )
}