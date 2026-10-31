import Field, { inputClass } from './Field'

const DIAL_CODES = ['+61', '+1', '+44', '+64', '+91', '+971']
const COUNTRIES = [
  'Australia', 'New Zealand', 'United States', 'United Kingdom',
  'India', 'United Arab Emirates', 'Canada', 'Singapore',
]

function SectionTitle({ children, hint }) {
  return (
    <div>
      <h2 className="font-display text-3xl font-medium tracking-tight text-ink">{children}</h2>
      <span className="mt-4 block h-px w-12 bg-gold" />
      {hint && <p className="mt-4 text-[16px] text-body">{hint}</p>}
    </div>
  )
}

export default function GuestDetailsForm({ values, errors, onChange }) {
  const bind = (name) => ({
    id: `f-${name}`,
    name,
    value: values[name],
    onChange,
    className: inputClass(errors[name]),
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `f-${name}-error` : undefined,
  })

  return (
    <div>
      <SectionTitle>Personal details</SectionTitle>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field label="First name" required htmlFor="f-firstName" error={errors.firstName}>
          <input {...bind('firstName')} autoComplete="given-name" placeholder="First name" />
        </Field>

        <Field label="Last name" required htmlFor="f-lastName" error={errors.lastName}>
          <input {...bind('lastName')} autoComplete="family-name" placeholder="Last name" />
        </Field>

        <Field label="Email" required htmlFor="f-email" error={errors.email}>
          <input {...bind('email')} type="email" autoComplete="email" placeholder="Email" />
        </Field>

        <Field label="Phone number" required htmlFor="f-phone" error={errors.phone}>
          <div className="grid w-full grid-cols-[110px_minmax(0,1fr)] gap-2">
            <select
              name="dialCode"
              value={values.dialCode}
              onChange={onChange}
              aria-label="Country code"
              className={`${inputClass(false)} !w-full min-w-0 px-3`}
            >
              {DIAL_CODES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              {...bind('phone')}
              type="tel"
              autoComplete="tel-national"
              placeholder="Phone number"
              className={`${inputClass(errors.phone)} !w-full min-w-0`}
            />
          </div>
        </Field>
      </div>

      <div className="mt-14">
        <SectionTitle>Where are you travelling from?</SectionTitle>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Field label="City" required htmlFor="f-city" error={errors.city}>
            <input {...bind('city')} autoComplete="address-level2" placeholder="City" />
          </Field>

          <Field label="Country" required htmlFor="f-country" error={errors.country}>
            <input
              {...bind('country')}
              list="country-list"
              autoComplete="country-name"
              placeholder="Country"
            />
            <datalist id="country-list">
              {COUNTRIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
        </div>
      </div>

      <div className="mt-14">
        <SectionTitle hint="Let us know if you have any additional requests or comments">
          Special requests (optional)
        </SectionTitle>
        <textarea
          id="f-message"
          name="message"
          value={values.message}
          onChange={onChange}
          rows={7}
          placeholder="Your message"
          className={`${inputClass(false)} mt-6 resize-y`}
        />
      </div>
    </div>
  )
}