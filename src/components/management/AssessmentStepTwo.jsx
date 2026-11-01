export default function AssessmentStepTwo({ values, onChange }) {
  return (
    <div className="space-y-5">
      <label className="block">
        <span className="mb-3 block font-semibold text-[#333]">
          How many bedrooms does your property have?
        </span>

        <input
          type="number"
          name="bedrooms"
          min="0"
          max="100"
          required
          value={values.bedrooms}
          onChange={onChange}
          placeholder="Number of bedrooms"
          className="w-full rounded-sm border border-gray-300 px-4 py-3 outline-none focus:border-[#397e89]"
        />
      </label>

      <label className="block">
        <span className="mb-3 block font-semibold text-[#333]">
          Address
        </span>

        <textarea
          name="address"
          required
          rows={3}
          value={values.address}
          onChange={onChange}
          placeholder="Enter your property address"
          className="w-full resize-y rounded-sm border border-gray-300 px-4 py-3 outline-none focus:border-[#397e89]"
        />
      </label>
    </div>
  )
}