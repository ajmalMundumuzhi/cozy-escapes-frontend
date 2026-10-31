import { useState } from 'react'
import Field, { inputClass } from '../booking/Field'
import { subjects } from '../../data/contact'
import { submitContact } from '../../services/api'

const empty = { name: '', email: '', message: '', website: '' } // "website" is a hidden spam trap

function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Enter your name'
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = 'Enter a valid email address'
  if (v.message.trim().length < 10) e.message = 'Please write a short message (at least 10 characters)'
  return e
}

export default function ContactForm({ initialSubject }) {
  const [values, setValues] = useState(empty)
  const [subject, setSubject] = useState(initialSubject)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errs = validate(values)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) {
      document.getElementById(`c-${first}`)?.focus()
      return
    }

    // Bots fill the hidden field: pretend success and send nothing
    if (values.website) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      await submitContact({
        name: values.name.trim(),
        email: values.email.trim(),
        subject,
        message: values.message.trim(),
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => {
    setValues(empty)
    setErrors({})
    setStatus('idle')
  }

  if (status === 'sent') {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-deep text-gold-deep">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12l5 5 9-10" />
          </svg>
        </span>
        <h2 className="mt-6 font-display text-3xl font-medium text-ink">Thank you, {values.name.trim()}</h2>
        <p role="status" className="mt-4 max-w-[420px] text-[16px] leading-7 text-body">
          Your message has been sent. We’ll reply to {values.email.trim()} as soon as we can.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 border border-navy px-8 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-navy transition-colors hover:bg-navy hover:text-white"
        >
          Send another message
        </button>
      </div>
    )
  }

  const bind = (name) => ({
    id: `c-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    className: inputClass(errors[name]),
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `c-${name}-error` : undefined,
  })

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="font-display text-3xl font-medium tracking-tight text-ink">Send us a message</h2>
      <span className="mt-4 block h-px w-12 bg-gold" />

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field label="Name" required htmlFor="c-name" error={errors.name}>
          <input {...bind('name')} autoComplete="name" placeholder="Your name" />
        </Field>
        <Field label="Email" required htmlFor="c-email" error={errors.email}>
          <input {...bind('email')} type="email" autoComplete="email" placeholder="Your email" />
        </Field>

        <Field label="Subject" htmlFor="c-subject" className="sm:col-span-2">
          <div className="relative">
            <select
              id="c-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`${inputClass(false)} appearance-none pr-10`}
            >
              {subjects.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </Field>

        <Field label="Message" required htmlFor="c-message" error={errors.message} className="sm:col-span-2">
          <textarea {...bind('message')} rows={7} placeholder="How can we help?" className={`${inputClass(errors.message)} resize-y`} />
        </Field>

        {/* Spam trap: hidden from people, visible to bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input name="website" value={values.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </div>

      {status === 'error' && (
        <p role="alert" className="mt-6 border border-red-300 bg-red-50 px-4 py-3 text-[14px] text-red-700">
          Sorry, your message couldn’t be sent. Please try again, or call us on {' '}
          <a href="tel:+61426964657" className="underline">+61 406957539</a>.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-8 w-full bg-gold-deep px-10 py-4 text-[12px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-navy disabled:opacity-60 sm:w-auto"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}