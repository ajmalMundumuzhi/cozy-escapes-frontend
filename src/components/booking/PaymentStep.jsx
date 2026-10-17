export default function PaymentStep({ onBack }) {
  return (
    <div className="border border-gold bg-white p-7 md:p-10">
      <h2 className="font-display text-3xl font-medium tracking-tight text-ink">Payment</h2>
      <span className="mt-4 block h-px w-12 bg-gold" />

      <p className="mt-6 text-[16px] leading-8 text-body">
        Payment provider not connected yet. This is where the secure payment step goes once the
        backend exists (for example a hosted checkout page from Stripe). Card details are entered
        on the provider’s own form, never on this site’s code.
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-8 border border-navy px-8 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-navy transition-colors hover:bg-navy hover:text-white"
      >
        ← Back to details
      </button>
    </div>
  )
}

export function SecureNote() {
  return (
    <div className="flex gap-4 border border-gold/40 bg-white p-6">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-deep text-gold-deep">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="5" y="11" width="14" height="9" rx="1.5" />
          <path d="M8 11V8a4 4 0 118 0v3" />
        </svg>
      </span>
      <div>
        <h3 className="font-display text-xl font-medium text-ink">Your payment is secure</h3>
        <p className="mt-1 text-[14px] leading-6 text-body">
          Payments are handled by a secure payment provider.
        </p>
      </div>
    </div>
  )
}