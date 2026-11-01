const PROPERTY_TYPES = [
  'My entire vacation home (or condo)',
  'I have more than one property type',
  "No property yet, but I'm looking to buy",
  'My primary residence',
  'My timeshare',
  'A private room in my home',
  'A guesthouse with a private entrance',
  'My unique property (treehouse, glamp site, etc.)',
  'Other',
]

const MANAGEMENT_TYPES = [
  'I self-manage my property',
  'I use a property manager',
  "Nobody. I've never rented it out before",
]

const AVAILABILITY_OPTIONS = [
  'Under 10% (0-4 weeks)',
  '10-50% (5-26 weeks)',
  '50-90% (26-47 weeks)',
  '90%+ (Over 47 weeks)',
]

const REVENUE_OPTIONS = [
  '$50,000 or less',
  '$50,000-$75,000',
  '$75,000-$100,000',
  '$100,000+',
]

function SurveySelect({ label, name, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-3 block font-semibold text-[#333]">
        {label} <span className="text-red-500">*</span>
      </span>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-sm border border-gray-300 bg-white px-4 py-3 text-[#444] outline-none focus:border-[#397e89]"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export default function AssessmentStepOne({ values, onChange }) {
  return (
    <div className="space-y-5">
      <SurveySelect
        label="What type of property will you rent out?"
        name="propertyType"
        value={values.propertyType}
        options={PROPERTY_TYPES}
        onChange={onChange}
      />

      <SurveySelect
        label="Who currently manages your property?"
        name="managementType"
        value={values.managementType}
        options={MANAGEMENT_TYPES}
        onChange={onChange}
      />

      <SurveySelect
        label="What percentage of the year will your property be available to rent?"
        name="availability"
        value={values.availability}
        options={AVAILABILITY_OPTIONS}
        onChange={onChange}
      />

      <SurveySelect
        label="What is the current (or projected) annual gross revenue for your property?"
        name="annualRevenue"
        value={values.annualRevenue}
        options={REVENUE_OPTIONS}
        onChange={onChange}
      />
    </div>
  )
}