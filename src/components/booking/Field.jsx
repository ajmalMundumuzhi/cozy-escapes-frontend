export const inputClass = (hasError) =>
  `w-full border ${hasError ? 'border-red-500' : 'border-gold/40'} bg-white px-4 py-3.5 text-[16px] text-ink placeholder:text-body/50 outline-none transition-colors focus:border-gold-deep focus:ring-1 focus:ring-gold-deep`

export default function Field({ label, required, error, htmlFor, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-[14px] font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-red-600" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-[13px] text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}