import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Container from '../ui/Container'
import GuestDetailsForm from './GuestDetailsForm'
import TripSummary from './TripSummary'
import PaymentStep, { SecureNote } from './PaymentStep'
import { useProperty } from '../../hooks/useProperties'
import { parseISODate } from '../../utils/formatters'
import { validateGuest } from '../../utils/validators'
import { submitInquiry } from '../../services/api'

const MODES = {
  inquiry: { title: 'Inquiry', button: 'Send Inquiry', needsDates: false },
  booking: { title: 'Book your stay', button: 'Continue to payment', needsDates: true },
}

const initialValues = {
  firstName: '', lastName: '', email: '', dialCode: '+61', phone: '',
  address: '', address2: '', city: '', zip: '', state: '', country: '', message: '',
}

export default function Reservation({ mode }) {
  const cfg = MODES[mode]
  const { id } = useParams()
  const [params] = useSearchParams()
  const property = useProperty(id)

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  // Dates and guests can arrive from the home-page search via the URL
  const [range, setRange] = useState(() => ({
    start: parseISODate(params.get('checkin')),
    end: parseISODate(params.get('checkout')),
  }))
  const [guests, setGuests] = useState(() =>
    Math.max(1, Math.min(Number(params.get('guests')) || 1, property?.guests ?? 1))
  )
  const [marketing, setMarketing] = useState(false)
  const [stage, setStage] = useState('form') // form | payment | sent
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [stage, id])

  if (!property) {
    return (
      <Container className="py-32 text-center">
        <h1 className="font-display text-4xl text-ink">Property not found</h1>
        <Link
          to="/accommodations"
          className="mt-8 inline-block bg-gold-deep px-8 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-white hover:bg-navy"
        >
          Back to listings
        </Link>
      </Container>
    )
  }

  const back = `/accommodations/property/${id}`
  const [mainTitle] = property.title.split('|')

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errs = validateGuest(values)
    if (cfg.needsDates && !(range.start && range.end)) {
      errs.dates = 'Select your check-in and check-out dates'
    }
    setErrors(errs)

    const first = Object.keys(errs)[0]
    if (first) {
      const el = document.getElementById(first === 'dates' ? 'trip-details' : `f-${first}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (first !== 'dates') el?.focus({ preventScroll: true })
      return
    }

    const payload = {
      propertyId: id,
      guest: values,
      checkin: range.start,
      checkout: range.end,
      guests,
      marketing,
    }

    if (mode === 'inquiry') {
      setSubmitting(true)
      setSubmitError('')

      try {
        await submitInquiry(payload)
        setStage('sent')
      } catch (error) {
        setSubmitError(
          error.message || 'Unable to send your inquiry. Please try again.'
        )
      } finally {
        setSubmitting(false)
      }
    } else {
      console.log('Booking payload (no payment provider yet):', payload)
      setStage('payment')
    }
  }

  // Thank-you screen (inquiry)
  if (stage === 'sent') {
    return (
      <Container className="py-24 text-center md:py-32">
        <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-gold-deep">Inquiry</p>
        <span className="mx-auto mt-6 block h-px w-16 bg-gold" />
        <h1 className="mt-8 font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
          Thank you, {values.firstName.trim()}
        </h1>
        <p className="mx-auto mt-6 max-w-[520px] text-[17px] leading-8 text-body">
          We’ve noted your inquiry for {mainTitle.trim()} and will be in touch at {values.email.trim()}.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/accommodations"
            className="bg-gold-deep px-8 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-navy"
          >
            Browse more stays
          </Link>
          <Link
            to="/"
            className="border border-navy px-8 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-navy transition-colors hover:bg-navy hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-10 md:py-16">
      <div className="flex items-center gap-4">
        <Link
          to={back}
          aria-label="Back to property"
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/50 text-ink transition-colors hover:border-gold-deep"
        >
          ←
        </Link>
        <h1 className="font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
          {cfg.title}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-10 grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-16"
      >
        <div className="min-w-0">
          {stage === 'payment' ? (
            <PaymentStep onBack={() => setStage('form')} />
          ) : (
            <>
              <GuestDetailsForm
                values={values}
                errors={errors}
                onChange={handleChange}
              />

              {submitError && (
                <p
                  role="alert"
                  className="mt-4 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800"
                >
                  {submitError}
                </p>
              )}
            </>
          )}
        </div>

        <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <TripSummary
            property={property}
            range={range}
            onRangeChange={(r) => {
              setRange(r)
              setErrors((er) => ({ ...er, dates: undefined }))
            }}
            guests={guests}
            onGuestsChange={setGuests}
            marketing={marketing}
            onMarketingChange={setMarketing}
            submitLabel={cfg.button}
            submitting={submitting}
            showSubmit={stage === 'form'}
            datesError={errors.dates}
          />
          {mode === 'booking' && <SecureNote />}
        </div>
      </form>
    </Container>
  )
}