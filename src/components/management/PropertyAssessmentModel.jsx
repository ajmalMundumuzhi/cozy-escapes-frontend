import { useState } from 'react'
import AssessmentStepOne from './AssessmentStepOne'
import AssessmentStepTwo from './AssessmentStepTwo'
import AssessmentStepThree from './AssessmentThree'
import { submitPropertyAssessment } from '../../services/assessment.service'

const INITIAL_VALUES = {
  propertyType: '',
  managementType: '',
  availability: '',
  annualRevenue: '',
  bedrooms: '',
  address: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}

const REQUIRED_FIELDS = {
  1: ['propertyType', 'managementType', 'availability', 'annualRevenue'],
  2: ['bedrooms', 'address'],
  3: ['firstName', 'lastName', 'email', 'phone'],
}

export default function PropertyAssessmentModal({ onClose }) {
  const [step, setStep] = useState(1)
  const [values, setValues] = useState(INITIAL_VALUES)
  const [captchaToken, setCaptchaToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    setError('')
  }

  const validateStep = () => {
    const missing = REQUIRED_FIELDS[step].find(
      (field) => !String(values[field]).trim()
    )

    if (missing) {
      setError('Please complete all required fields.')
      return false
    }

    if (step === 2 && Number(values.bedrooms) < 0) {
      setError('Please enter a valid bedroom count.')
      return false
    }

    if (step === 3) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        setError('Please enter a valid email address.')
        return false
      }

      if (!/^[+()\d\s-]{7,20}$/.test(values.phone)) {
        setError('Please enter a valid phone number.')
        return false
      }

      if (!captchaToken) {
        setError('Please complete the reCAPTCHA verification.')
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (!validateStep()) return
    setStep((previous) => Math.min(previous + 1, 3))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateStep()) return

    try {
      setLoading(true)
      setError('')

      await submitPropertyAssessment({
        ...values,
        bedrooms: Number(values.bedrooms),
        captchaToken,
      })

      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Unable to submit your assessment request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="assessment-title"
        className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto bg-white px-6 py-10 sm:px-12 sm:py-14"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close survey"
          className="absolute right-5 top-4 text-3xl text-gray-700 hover:text-black"
        >
          &times;
        </button>

        {submitted ? (
          <div className="py-16 text-center">
            <h2 className="font-heading text-3xl text-[#397e89]">
              THANK YOU!
            </h2>
            <p className="mt-5 text-gray-600">
              Your property assessment request has been submitted
              successfully. Our team will contact you soon.
            </p>
            <button
              onClick={onClose}
              className="mt-8 bg-green-950 px-10 py-4 text-white"
            >
              CLOSE
            </button>
          </div>
        ) : (
          <>
            <h2
              id="assessment-title"
              className="text-center font-heading text-3xl font-medium uppercase text-[#397e89] sm:text-5xl"
            >
              Complete Survey
            </h2>

            <p className="mt-5 text-center text-gray-700 sm:text-xl">
              Hi, please take your time and fill out the survey form
            </p>

            <div className="my-12 flex items-center justify-center">
              {[1, 2, 3].map((number) => (
                <div key={number} className="flex flex-1 items-center">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                      step >= number
                        ? 'border-[#efb9a8] bg-[#efb9a8] text-white'
                        : 'border-gray-400 text-gray-700'
                    }`}
                  >
                    {number}
                  </div>

                  {number !== 3 && (
                    <div className="mx-3 h-px flex-1 bg-gray-400" />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <AssessmentStepOne
                  values={values}
                  onChange={handleChange}
                />
              )}

              {step === 2 && (
                <AssessmentStepTwo
                  values={values}
                  onChange={handleChange}
                />
              )}

              {step === 3 && (
                <AssessmentStepThree
                  values={values}
                  onChange={handleChange}
                  onCaptchaChange={setCaptchaToken}
                />
              )}

              {error && (
                <p role="alert" className="mt-5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setStep((previous) => previous - 1)
                      setError('')
                    }}
                    className="flex-1 bg-[#efb9a8] py-4 font-medium uppercase text-white"
                  >
                    Previous
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 bg-[#efb9a8] py-4 font-medium uppercase text-white"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#efb9a8] py-4 font-medium uppercase text-white disabled:opacity-60"
                  >
                    {loading ? 'Submitting...' : 'Send'}
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}