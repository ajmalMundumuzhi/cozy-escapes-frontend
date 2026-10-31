
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import DateRangePicker from '../ui/DateRangePicker'
import { cancellationPolicy } from '../../data/policies'
import { formatDate, plural } from '../../utils/formatters'

const editBtn =
  'text-[14px] font-medium text-gold-deep underline underline-offset-4 transition-colors hover:text-navy'

const stepBtn =
  'flex h-9 w-9 items-center justify-center border border-gold/60 text-ink transition-colors hover:border-gold-deep disabled:opacity-30 disabled:hover:border-gold/60'

function formatMoney(amount, currency = 'AUD') {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: currency || 'AUD',
  }).format(Number(amount) || 0)
}

function PriceRow({ label, amount, currency }) {
  return (
    <div className="flex justify-between gap-4 text-[14px] text-body">
      <span>{label}</span>
      <span className="shrink-0">{formatMoney(amount, currency)}</span>
    </div>
  )
}

export default function TripSummary({
  property,
  range,
  onRangeChange,
  guests,
  onGuestsChange,
  marketing,
  onMarketingChange,
  submitLabel,
  submitting,
  showSubmit,
  datesError,
  pricingQuote,
  pricingLoading,
  pricingError,
  availability,
}) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [guestsOpen, setGuestsOpen] = useState(false)
  const pickerRef = useRef(null)

  // Close the calendar when clicking outside it.
  useEffect(() => {
    const onDown = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setPickerOpen(false)
      }
    }

    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const [main, ...rest] = property.title.split('|')
  const sub = rest.join('|').trim()

  const { start, end } = range
  const nights =
    start && end ? Math.round((end - start) / 86400000) : 0

  const datesText = start
    ? end
      ? `${formatDate(start)} – ${formatDate(end)}`
      : formatDate(start)
    : 'Select dates'

  const breakdown = pricingQuote?.priceBreakdown
  const showPrice =
    !pricingLoading && availability === true && Boolean(breakdown)

  return (
    <div className="border-t-2 border-gold bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-8">
      {/* Property */}
      <div className="flex gap-4">
        <img
          src={property.image}
          alt=""
          className="h-24 w-24 shrink-0 object-cover"
        />

        <div className="min-w-0">
          <h2 className="font-display text-xl font-medium leading-snug text-ink">
            {main.trim()}
          </h2>

          {sub && (
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-gold-deep">
              {sub}
            </p>
          )}

          <p className="mt-2 flex items-center gap-1.5 text-[14px] text-ink">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-gold"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {property.rating}
          </p>
        </div>
      </div>

      {/* Cancellation policy */}
      <div className="mt-7 border-t border-gold/30 pt-6">
        <h3 className="text-[16px] font-semibold text-ink">
          Cancellation policy
        </h3>

        <ul className="mt-3 space-y-2 text-[15px] text-body">
          {cancellationPolicy.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      {/* Trip details */}
      <div id="trip-details" className="mt-6 border-t border-gold/30 pt-6">
        <h3 className="text-[16px] font-semibold text-ink">Trip details</h3>

        <div ref={pickerRef} className="relative mt-3">
          <div className="flex items-center justify-between gap-4 py-2 text-[15px] text-body">
            <span>
              {datesText}
              {nights > 0 && (
                <span className="ml-2 text-gold-deep">
                  ({plural(nights, 'night')})
                </span>
              )}
            </span>

            <button
              type="button"
              onClick={() => setPickerOpen((open) => !open)}
              className={editBtn}
            >
              Edit
            </button>
          </div>

          {pickerOpen && (
            <DateRangePicker
              start={range.start}
              end={range.end}
              onChange={(s, e) => onRangeChange({ start: s, end: e })}
              onConfirm={() => setPickerOpen(false)}
            />
          )}
        </div>

        {datesError && (
          <p role="alert" className="text-[13px] text-red-600">
            {datesError}
          </p>
        )}

        <div className="flex items-center justify-between gap-4 py-2 text-[15px] text-body">
          <span>{plural(guests, 'guest')}</span>

          <button
            type="button"
            onClick={() => setGuestsOpen((open) => !open)}
            className={editBtn}
          >
            Edit
          </button>
        </div>

        {guestsOpen && (
          <div className="flex items-center gap-4 pb-2">
            <button
              type="button"
              aria-label="Fewer guests"
              onClick={() => onGuestsChange(Math.max(1, guests - 1))}
              disabled={guests <= 1}
              className={stepBtn}
            >
              −
            </button>

            <span
              aria-live="polite"
              className="w-6 text-center text-[16px] text-ink"
            >
              {guests}
            </span>

            <button
              type="button"
              aria-label="More guests"
              onClick={() =>
                onGuestsChange(Math.min(property.guests, guests + 1))
              }
              disabled={guests >= property.guests}
              className={stepBtn}
            >
              +
            </button>

            <span className="text-[13px] text-body">
              Max {property.guests}
            </span>
          </div>
        )}
      </div>

      {/* Live availability status */}
      {pricingLoading && (
        <p
          role="status"
          className="mt-6 border-t border-gold/30 pt-6 text-[14px] text-body"
        >
          Checking availability and calculating your price…
        </p>
      )}

      {!pricingLoading && pricingError && (
        <p
          role="alert"
          className="mt-6 border-t border-gold/30 pt-6 text-[14px] leading-6 text-red-600"
        >
          {pricingError}
        </p>
      )}

      {!pricingLoading &&
        !pricingError &&
        availability === true &&
        !breakdown && (
          <p className="mt-6 border-t border-gold/30 pt-6 text-[14px] text-body">
            Availability confirmed, but the price quote is unavailable.
          </p>
        )}

      {/* Server-generated price breakdown */}
      {showPrice && (
        <div className="mt-6 border-t border-gold/30 pt-6">
          <h3 className="text-[16px] font-semibold text-ink">
            Price breakdown
          </h3>

          <div className="mt-4 space-y-3">
            {breakdown.nightlyPrices?.map((night, index) => (
              <div
                key={`${night.date}-${index}`}
                className="flex justify-between gap-4 text-[14px] text-body"
              >
                <span>
                  {night.date}
                  {night.rule && night.rule !== 'base'
                    ? ` (${night.rule})`
                    : ''}
                </span>

                <span className="shrink-0">
                  {formatMoney(night.amount, breakdown.currency)}
                </span>
              </div>
            ))}

            <div className="border-t border-gold/20 pt-3">
              <PriceRow
                label="Accommodation"
                amount={breakdown.accommodationSubtotal}
                currency={breakdown.currency}
              />
            </div>

            <PriceRow
              label="Cleaning fee"
              amount={breakdown.cleaningFee}
              currency={breakdown.currency}
            />

            {breakdown.additionalFees?.map((fee, index) => (
              <PriceRow
                key={`${fee.name}-${index}`}
                label={fee.name}
                amount={fee.amount}
                currency={breakdown.currency}
              />
            ))}

            {breakdown.taxes?.map((tax, index) => (
              <PriceRow
                key={`${tax.name}-${index}`}
                label={tax.name}
                amount={tax.amount}
                currency={breakdown.currency}
              />
            ))}

            {(breakdown.discount ?? 0) > 0 && (
              <PriceRow
                label="Discount"
                amount={-breakdown.discount}
                currency={breakdown.currency}
              />
            )}

            <div className="flex justify-between gap-4 border-t border-gold/30 pt-4 text-[16px] font-semibold text-ink">
              <span>Total</span>
              <span className="shrink-0">
                {formatMoney(breakdown.total, breakdown.currency)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      {showSubmit && (
        <>
          <p className="mt-6 border-t border-gold/30 pt-6 text-[14px] leading-6 text-body">
            By clicking on this button, I agree to the{' '}
            <Link
              to="/terms-and-conditions"
              className="font-medium text-gold-deep underline underline-offset-4"
            >
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link
              to="/terms-and-conditions"
              className="font-medium text-gold-deep underline underline-offset-4"
            >
              Terms of Service
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={submitting || pricingLoading}
            className="mt-6 w-full bg-gold-deep py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-navy disabled:opacity-60"
          >
            {submitting
              ? 'Sending…'
              : pricingLoading
                ? 'Checking price…'
                : submitLabel}
          </button>
        </>
      )}
    </div>
  )
}
