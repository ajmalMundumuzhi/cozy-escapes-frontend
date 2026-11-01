import ReCAPTCHA from 'react-google-recaptcha'

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

export default function AssessmentStepThree({
  values,
  onChange,
  onCaptchaChange,
}) {
  return (
    <div className="space-y-5">
      {[
        ['First Name', 'firstName', 'text'],
        ['Last Name', 'lastName', 'text'],
        ['Email', 'email', 'email'],
        ['Phone', 'phone', 'tel'],
      ].map(([label, name, type]) => (
        <label key={name} className="block">
          <span className="mb-3 block font-semibold text-[#333]">
            {label} <span className="text-red-500">*</span>
          </span>

          <input
            type={type}
            name={name}
            required
            value={values[name]}
            onChange={onChange}
            placeholder={label}
            autoComplete={name}
            className="w-full rounded-sm border border-gray-300 px-4 py-3 outline-none focus:border-[#397e89]"
          />
        </label>
      ))}

      {siteKey ? (
        <ReCAPTCHA
          sitekey={siteKey}
          onChange={onCaptchaChange}
        />
      ) : (
        <p className="text-sm text-red-600">
          reCAPTCHA is not configured. Please contact the administrator.
        </p>
      )}
    </div>
  )
}